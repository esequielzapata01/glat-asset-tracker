using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GLAT.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddVibrationToTelemetry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Vibration",
                table: "TelemetryLogs",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Vibration",
                table: "TelemetryLogs");
        }
    }
}
