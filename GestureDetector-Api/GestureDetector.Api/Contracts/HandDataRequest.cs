namespace GestureDetector.Api.Contracts
{
    public class HandDataRequest
    {
        public List<HandInfo> Hands { get; set; } = [];
        public long Timestamp { get; set; }
    }

    public class HandInfo
    {
        public List<Landmark> Landmarks { get; set; } = [];
        public string Handedness { get; set; } = string.Empty;
        public double Score { get; set; }
    }

    public class Landmark
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }
    }
}