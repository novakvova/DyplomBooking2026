using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    public partial class AddHotDealDiscountPercent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotDealDiscountPercent",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HotDealDiscountPercent",
                table: "Housings");
        }
    }
}