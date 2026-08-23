using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    /// <inheritdoc />
    public partial class AddDestinationViewTrackingSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDestinationView_Destinations_DestinationId",
                table: "UserDestinationView");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserDestinationView",
                table: "UserDestinationView");

            migrationBuilder.RenameTable(
                name: "UserDestinationView",
                newName: "UserDestinationViews");

            migrationBuilder.RenameIndex(
                name: "IX_UserDestinationView_DestinationId",
                table: "UserDestinationViews",
                newName: "IX_UserDestinationViews_DestinationId");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserDestinationViews",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "VisitorId",
                table: "UserDestinationViews",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserDestinationViews",
                table: "UserDestinationViews",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "AppSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSettings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppSettings_Key",
                table: "AppSettings",
                column: "Key",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserDestinationViews_Destinations_DestinationId",
                table: "UserDestinationViews",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDestinationViews_Destinations_DestinationId",
                table: "UserDestinationViews");

            migrationBuilder.DropTable(
                name: "AppSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserDestinationViews",
                table: "UserDestinationViews");

            migrationBuilder.DropColumn(
                name: "VisitorId",
                table: "UserDestinationViews");

            migrationBuilder.RenameTable(
                name: "UserDestinationViews",
                newName: "UserDestinationView");

            migrationBuilder.RenameIndex(
                name: "IX_UserDestinationViews_DestinationId",
                table: "UserDestinationView",
                newName: "IX_UserDestinationView_DestinationId");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserDestinationView",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserDestinationView",
                table: "UserDestinationView",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDestinationView_Destinations_DestinationId",
                table: "UserDestinationView",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
