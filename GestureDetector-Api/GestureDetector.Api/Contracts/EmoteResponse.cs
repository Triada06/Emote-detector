namespace GestureDetector.Api.Contracts;

public class EmoteResponse
{
    public string Emote { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public double? Confidence { get; set; }
    public string? Description { get; set; }
}