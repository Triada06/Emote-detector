using System.Text;
using System.Text.Json;
using GestureDetector.Api.Contracts;
using GestureDetector.Api.Services.Interfaces;

namespace GestureDetector.Api.Services;

public class AiEmoteService(IConfiguration configuration, HttpClient httpClient, IBlobService blobService)
{
    private readonly string _apiKey = configuration["Gemini:ApiKey"] ??
                                      throw new InvalidOperationException("Gemini API key not found");

    public async Task<EmoteResponse> DetectEmoteAsync(HandDataRequest handData)
    {
        try
        {
            var handDescription = FormatHandDataForAi(handData);

            var prompt = $$"""
                           You are an expert at recognizing Clash Royale emotes from hand gestures.

                                                     Common Clash Royale emotes include:
                                                     - Crying Face (laughing crying)
                                                     - Thumbs Up
                                                     - King Laugh
                                                     - Angry Face
                                                     - Shrugging
                                                     - Blowing Kiss
                                                     - Clapping
                                                     - Yawning

                                                     Analyze the hand landmark data below and determine which emote the user is performing.

                                                     Respond with ONLY a JSON object (no markdown, no extra text):
                                                     {
                                                         "emote": "Emote Name",
                                                         "confidence": 0.85,
                                                         "description": "Brief description"
                                                     }

                                                     Hand gesture data:
                                                     {{handDescription}}
                           """;

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url =
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

            var response = await httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Gemini API error: {error}");
                return new EmoteResponse { Emote = "Error", Description = "API request failed" };
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Raw Gemini Response: {responseJson}");

            // Parse Gemini response structure with better options
            GeminiResponse? geminiResponse = null;
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseJson, options);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to parse Gemini response: {ex.Message}");
                return new EmoteResponse { Emote = "Error", Description = "Invalid API response format" };
            }

            // Extract text with detailed logging
            var aiText = "";
            if (geminiResponse?.Candidates != null && geminiResponse.Candidates.Length > 0)
            {
                var candidate = geminiResponse.Candidates[0];

                if (candidate?.Content?.Parts != null && candidate.Content.Parts.Length > 0)
                {
                    aiText = candidate.Content.Parts[0].Text ?? "";
                }
                else
                {
                    Console.WriteLine("Parts is null or empty");
                }
            }
            else
            {
                Console.WriteLine("Candidates is null or empty");
            }

            if (string.IsNullOrEmpty(aiText))
            {
                Console.WriteLine("No text in Gemini response");
                return new EmoteResponse { Emote = "Unknown", Description = "Empty AI response" };
            }

            Console.WriteLine($"AI Text before cleanup: {aiText}");

            // Clean up response - remove markdown code blocks
            aiText = aiText.Trim();
            if (aiText.StartsWith("```json"))
            {
                aiText = aiText.Substring(7);
            }

            if (aiText.StartsWith("```"))
            {
                aiText = aiText.Substring(3);
            }

            if (aiText.EndsWith("```"))
            {
                aiText = aiText.Substring(0, aiText.Length - 3);
            }

            aiText = aiText.Trim();

            Console.WriteLine($"AI Text after cleanup: {aiText}");

            // Parse AI's JSON response
            AiEmoteResult? aiResponse = null;
            try
            {
                aiResponse = JsonSerializer.Deserialize<AiEmoteResult>(aiText, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to parse AI JSON: {ex.Message}");
                Console.WriteLine($"AI text was: {aiText}");

                return new EmoteResponse
                {
                    Emote = "Unknown",
                    Description = "Could not parse AI response",
                    Confidence = 0.5
                };
            }

            if (aiResponse == null)
            {
                return new EmoteResponse { Emote = "Unknown", Description = "Could not parse AI response" };
            }

            var image = GetEmoteImage(aiResponse.Emote);
            Console.WriteLine(image);
            var imageUrl = blobService.GetBlobSasUri(image);

            Console.WriteLine($"Final result: {aiResponse.Emote}, Confidence: {aiResponse.Confidence}");

            return new EmoteResponse
            {
                Emote = aiResponse.Emote,
                ImageUrl = imageUrl,
                Confidence = aiResponse.Confidence,
                Description = aiResponse.Description
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error detecting emote: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return new EmoteResponse { Emote = "Error", Description = ex.Message };
        }
    }

    private static string FormatHandDataForAi(HandDataRequest handData)
    {
        var description = $"Number of hands detected: {handData.Hands.Count}\n\n";

        foreach (var (hand, index) in handData.Hands.Select((h, i) => (h, i)))
        {
            description += $"Hand {index + 1} ({hand.Handedness}):\n";
            description += $"- Detection confidence: {hand.Score:P}\n";
            description += $"- Number of landmarks: {hand.Landmarks.Count}\n";

            var keyLandmarks = new[] { 4, 8, 12, 16, 20 };
            description += "- Fingertip positions:\n";

            foreach (var idx in keyLandmarks)
            {
                if (idx < hand.Landmarks.Count)
                {
                    var lm = hand.Landmarks[idx];
                    description += $"  Landmark {idx}: X={lm.X:F3}, Y={lm.Y:F3}, Z={lm.Z:F3}\n";
                }
            }

            description += "- Finger states:\n";
            var fingerNames = new[] { "Thumb", "Index", "Middle", "Ring", "Pinky" };
            var tipIndices = new[] { 4, 8, 12, 16, 20 };
            var pipIndices = new[] { 2, 6, 10, 14, 18 };

            for (var i = 0; i < 5; i++)
            {
                if (tipIndices[i] < hand.Landmarks.Count && pipIndices[i] < hand.Landmarks.Count)
                {
                    var tip = hand.Landmarks[tipIndices[i]];
                    var pip = hand.Landmarks[pipIndices[i]];
                    var distance = Math.Sqrt(Math.Pow(tip.X - pip.X, 2) + Math.Pow(tip.Y - pip.Y, 2));
                    var extended = distance > 0.1 ? "Extended" : "Folded";
                    description += $"  {fingerNames[i]}: {extended}\n";
                }
            }

            description += "\n";
        }

        return description;
    }


    private static string GetEmoteImage(string emoteName)
    {
        var emoteImageMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "Crying Face", "crying-face.jpg" },
            { "Thumbs Up", "thumbs-up.jpeg" },
            { "King Laugh", "king-laugh.jpeg" },
            { "Angry Face", "angry-face.jpg" },
            { "Shrugging", "shrugging.jpg" },
            { "Blowing Kiss", "blowing-kiss.jpg" },
            { "Clapping", "clapping.jpeg" },
            { "Yawning", "yawning.jpg" }
        };

        if (emoteImageMap.TryGetValue(emoteName, out var fileName))
        {
            return $"{fileName}";
        }

        return string.Empty;
    }

    // Response models for Gemini API
    private class GeminiResponse
    {
        public Candidate[]? Candidates { get; set; }
    }

    private class Candidate
    {
        public ContentData? Content { get; set; }
    }

    private class ContentData
    {
        public Part[]? Parts { get; set; }
    }

    private class Part
    {
        public string? Text { get; set; }
    }

    private class AiEmoteResult
    {
        public string Emote { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public string? Description { get; set; }
    }
}