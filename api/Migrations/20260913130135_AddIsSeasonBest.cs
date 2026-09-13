using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    public partial class AddIsSeasonBest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSeasonBest",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSeasonBest",
                table: "Housings");
        }
    }
}