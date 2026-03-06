namespace GLAT.Api.Models
{
    public class Asset
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Location { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}