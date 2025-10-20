namespace GestureDetector.Api;

public static class AppEndPoints
{
    private const string ApiBase = "api";
    
    public static class Emote
    {
        private const string Base = $"{ApiBase}/emote";
        public const string Detect =  $"{Base}/detect";
    }
}