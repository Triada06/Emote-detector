using GestureDetector.Api.Contracts;
using GestureDetector.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GestureDetector.Api.Controllers;

[ApiController]
public class EmoteController(AiEmoteService aiService, ILogger<EmoteController> logger, IConfiguration config)
    : ControllerBase
{
    [HttpPost(AppEndPoints.Emote.Detect)]
    public async Task<IActionResult> DetectEmote([FromBody] HandDataRequest request)
    {
        try
        {
            if (request.Hands.Count == 0)
            {
                return BadRequest(new { error = "No hand data provided" });
            }

            logger.LogInformation($"Received hand data with {request.Hands.Count} hand(s)");

            var result = await aiService.DetectEmoteAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError($"Error processing request: {ex.Message}");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
    
    [HttpGet("test-models")]
    public async Task<IActionResult> TestModels()
    {
        try
        {
            var apiKey = config["Gemini:ApiKey"];
            var httpClient = new HttpClient();
        
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";
            var response = await httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();
        
            return Ok(new { response = content });
        }
        catch (Exception ex)
        {
            return Ok(new { error = ex.Message });
        }
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}