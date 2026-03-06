namespace GLAT.Api.Models
{
    public class TelemetryLog
    {
        public int Id { get; set; }
        public string AssetId { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public double Temperature { get; set; }
        public double BatteryLevel { get; set; }
        public double Vibration { get; set; }
    }
}