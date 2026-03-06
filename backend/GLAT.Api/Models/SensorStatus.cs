namespace GLAT.Api.Models
{
    public class SensorStatus
    {
        public int Id { get; set; }
        public string SensorName { get; set; } = string.Empty;
        public double Value { get; set; }
        public double HealthScore { get; set; }
    }
}