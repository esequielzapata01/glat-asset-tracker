namespace GLAT.Api.Models
{
    public class AssetStatus
    {
        public int Id { get; set; }
        public string AssetId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double HealthScore { get; set; }
        public DateTime LastTelemetry { get; set; }
        public List<SensorStatus> Sensors { get; set; } = new();
    }
}