using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    /// <inheritdoc />
    public partial class AddWishlistFolders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WishlistItems_UserId_HousingId",
                table: "WishlistItems");


            migrationBuilder.CreateTable(
                name: "WishlistFolders",
                columns: table => new
                {
                    Id = table.Column<int>(
                        type: "integer",
                        nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),

                    UserId = table.Column<string>(
                        type: "text",
                        nullable: false),

                    Name = table.Column<string>(
                        type: "text",
                        nullable: false),

                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_WishlistFolders",
                        x => x.Id);

                    table.ForeignKey(
                        name: "FK_WishlistFolders_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });


            migrationBuilder.CreateIndex(
                name: "IX_WishlistFolders_UserId",
                table: "WishlistFolders",
                column: "UserId");


            migrationBuilder.AddColumn<int>(
                name: "FolderId",
                table: "WishlistItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);


            // Створюємо стандартну папку для користувачів,
            // у яких вже є wishlist
            migrationBuilder.Sql(@"
        INSERT INTO ""WishlistFolders""
        (""UserId"", ""Name"", ""CreatedAt"")
        SELECT DISTINCT
            ""UserId"",
            'Мої бажання',
            NOW()
        FROM ""WishlistItems"";
    ");


            // Прив'язуємо старі записи wishlist до папки
            migrationBuilder.Sql(@"
        UPDATE ""WishlistItems"" wi
        SET ""FolderId"" = wf.""Id""
        FROM ""WishlistFolders"" wf
        WHERE wi.""UserId"" = wf.""UserId"";
    ");


            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_FolderId",
                table: "WishlistItems",
                column: "FolderId");


            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_UserId_HousingId_FolderId",
                table: "WishlistItems",
                columns: new[]
                {
            "UserId",
            "HousingId",
            "FolderId"
                },
                unique: true);


            migrationBuilder.AddForeignKey(
                name: "FK_WishlistItems_WishlistFolders_FolderId",
                table: "WishlistItems",
                column: "FolderId",
                principalTable: "WishlistFolders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WishlistItems_WishlistFolders_FolderId",
                table: "WishlistItems");

            migrationBuilder.DropTable(
                name: "WishlistFolders");

            migrationBuilder.DropIndex(
                name: "IX_WishlistItems_FolderId",
                table: "WishlistItems");

            migrationBuilder.DropIndex(
                name: "IX_WishlistItems_UserId_HousingId_FolderId",
                table: "WishlistItems");

            migrationBuilder.DropColumn(
                name: "FolderId",
                table: "WishlistItems");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_UserId_HousingId",
                table: "WishlistItems",
                columns: new[] { "UserId", "HousingId" },
                unique: true);
        }
    }
}
