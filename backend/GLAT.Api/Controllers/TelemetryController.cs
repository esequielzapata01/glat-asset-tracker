using GLAT.Api.Data;
using GLAT.Api.DTOs;
using GLAT.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GLAT.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("telemetry")]
    public class TelemetryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TelemetryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTelemetry([FromBody] CreateTelemetryLogDto dto)
        {
            if (dto == null)
                return BadRequest("Telemetry payload is required.");

            if (string.IsNullOrWhiteSpace(dto.AssetId))
                return BadRequest("AssetId is required.");

            var assetExists = await _context.Assets.AnyAsync(a => a.Id == dto.AssetId);

            if (!assetExists)
                return NotFound($"Asset with id '{dto.AssetId}' was not found.");

            var telemetryLog = new TelemetryLog
            {
                AssetId = dto.AssetId,
                Timestamp = dto.Timestamp == default ? DateTime.UtcNow : dto.Timestamp,
                Temperature = dto.Temperature,
                BatteryLevel = dto.BatteryLevel,
                Vibration = dto.Vibration
            };

            _context.TelemetryLogs.Add(telemetryLog);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Telemetry data received successfully.",
                telemetryId = telemetryLog.Id
            });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelemetryLog>>> GetAllTelemetry()
        {
            var telemetryLogs = await _context.TelemetryLogs
                .OrderByDescending(t => t.Timestamp)
                .ToListAsync();

            return Ok(telemetryLogs);
        }

        [HttpGet("{assetId}")]
        public async Task<ActionResult<IEnumerable<TelemetryLog>>> GetTelemetryByAsset(string assetId)
        {
            var assetExists = await _context.Assets.AnyAsync(a => a.Id == assetId);

            if (!assetExists)
                return NotFound($"Asset with id '{assetId}' was not found.");

            var telemetryLogs = await _context.TelemetryLogs
                .Where(t => t.AssetId == assetId)
                .OrderByDescending(t => t.Timestamp)
                .ToListAsync();

            return Ok(telemetryLogs);
        }
    }
}