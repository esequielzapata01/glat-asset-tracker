using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GLAT.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAssetStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "SensorStatuses");

            migrationBuilder.AddColumn<double>(
                name: "HealthScore",
                table: "SensorStatuses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Value",
                table: "SensorStatuses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HealthScore",
                table: "SensorStatuses");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "SensorStatuses");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "SensorStatuses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
