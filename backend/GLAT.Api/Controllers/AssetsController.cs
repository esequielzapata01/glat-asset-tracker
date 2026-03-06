using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GLAT.Api.Data;
using GLAT.Api.Models;
using GLAT.Api.Interop;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GLAT.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("assets")]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssets()
        {
            return await _context.Assets.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAsset(string id)
        {
            var asset = await _context.Assets.FindAsync(id);

            if (asset == null)
                return NotFound();

            return asset;
        }

        [HttpPost]
        public async Task<ActionResult<Asset>> CreateAsset(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAsset), new { id = asset.Id }, asset);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsset(string id, Asset asset)
        {
            if (id != asset.Id)
                return BadRequest();

            _context.Entry(asset).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(string id)
        {
            var asset = await _context.Assets.FindAsync(id);

            if (asset == null)
                return NotFound();

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/status")]
        public async Task<ActionResult<AssetStatus>> GetAssetStatus(string id)
        {
            var assetExists = await _context.Assets.AnyAsync(a => a.Id == id);

            if (!assetExists)
                return NotFound($"Asset with id '{id}' was not found.");

            var latestTelemetry = await _context.TelemetryLogs
                .Where(t => t.AssetId == id)
                .OrderByDescending(t => t.Timestamp)
                .FirstOrDefaultAsync();

            if (latestTelemetry == null)
                return NotFound("No telemetry found for this asset.");

            double healthScore;

            try
            {
                healthScore = HealthScoreNative.CalculateHealthScore(
                    latestTelemetry.Temperature,
                    latestTelemetry.BatteryLevel,
                    latestTelemetry.Vibration
                );
            }
            catch (DllNotFoundException)
            {
                healthScore = 100;

                if (latestTelemetry.Temperature > 20)
                    healthScore -= 30;

                if (latestTelemetry.BatteryLevel < 20)
                    healthScore -= 40;

                if (latestTelemetry.Vibration > 0.8)
                    healthScore -= 20;

                if (healthScore < 0)
                    healthScore = 0;
            }

            string status = "healthy";

            if (healthScore < 80)
                status = "warning";

            if (healthScore < 50)
                status = "critical";

            var assetStatus = new AssetStatus
            {
                AssetId = id,
                Status = status,
                HealthScore = healthScore,
                LastTelemetry = latestTelemetry.Timestamp,
                Sensors = new List<SensorStatus>
                {
                    new SensorStatus
                    {
                        SensorName = "temperature",
                        Value = latestTelemetry.Temperature,
                        HealthScore = latestTelemetry.Temperature > 20 ? 0.4 : 1.0
                    },
                    new SensorStatus
                    {
                        SensorName = "battery",
                        Value = latestTelemetry.BatteryLevel,
                        HealthScore = latestTelemetry.BatteryLevel < 20 ? 0.3 : 1.0
                    },
                    new SensorStatus
                    {
                        SensorName = "vibration",
                        Value = latestTelemetry.Vibration,
                        HealthScore = latestTelemetry.Vibration > 0.8 ? 0.5 : 1.0
                    }
                }
            };

            return Ok(assetStatus);
        }
        
    }
}