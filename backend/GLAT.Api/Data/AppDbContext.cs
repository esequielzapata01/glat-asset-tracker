using Microsoft.EntityFrameworkCore;
using GLAT.Api.Models;

namespace GLAT.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Asset> Assets { get; set; }
        public DbSet<TelemetryLog> TelemetryLogs { get; set; }
        public DbSet<SensorStatus> SensorStatuses { get; set; }
    }
}