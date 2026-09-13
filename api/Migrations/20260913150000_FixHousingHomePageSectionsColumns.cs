using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// Виправна міграція. У базі опинилися колонки (Country,
    /// DiscountPercent, HomeSortOrder, IsSeasonal), яких немає в
    /// поточній моделі Housing.cs — судячи з усього, залишок від
    /// більш ранньої, іншої версії міграції "AddHousingHomePageSections",
    /// яка була застосована до того, як цей файл набув фінального
    /// вигляду. Через це в __EFMigrationsHistory ця міграція вже
    /// позначена виконаною, і "dotnet ef database update" її більше
    /// не чіпає, хоча реальні колонки не збігаються з очікуваними
    /// EF Core (TravelCategory, IsHotDeal, HotDealDiscountPercent,
    /// IsSeasonBest) — звідси помилка "column ... does not exist".
    ///
    /// Ця міграція прибирає зайві колонки і додає відсутні, ідемпотентно
    /// (IF EXISTS / IF NOT EXISTS), щоб безпечно відпрацювати незалежно
    /// від того, у якому саме проміжному стані зараз перебуває база.
    /// </summary>
    public partial class FixHousingHomePageSectionsColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Прибираємо колонки-сироти ────────────────────────
            // Вони не відповідають жодній властивості в Housing.cs,
            // тому EF Core про них нічого не знає і ніколи не буде
            // намагатись їх використати.
            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"Country\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"DiscountPercent\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"HomeSortOrder\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"IsSeasonal\";");

            // ── Додаємо реально відсутні колонки ─────────────────
            // IF NOT EXISTS — щоб не впасти, якщо котрась із них
            // вже якимось чином є (наприклад, якщо стара міграція
            // встигла додати частину з цих назв теж).
            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" " +
                "ADD COLUMN IF NOT EXISTS \"TravelCategory\" text NOT NULL DEFAULT '';");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" " +
                "ADD COLUMN IF NOT EXISTS \"IsHotDeal\" boolean NOT NULL DEFAULT false;");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" " +
                "ADD COLUMN IF NOT EXISTS \"HotDealDiscountPercent\" integer NOT NULL DEFAULT 0;");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" " +
                "ADD COLUMN IF NOT EXISTS \"IsSeasonBest\" boolean NOT NULL DEFAULT false;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Down навмисно не відновлює видалені колонки-сироти
            // (Country/DiscountPercent/HomeSortOrder/IsSeasonal) —
            // вони не мали відповідника в моделі й не повинні
            // повертатися. Відкатуємо лише додавання нових колонок.
            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"TravelCategory\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"IsHotDeal\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"HotDealDiscountPercent\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"Housings\" DROP COLUMN IF EXISTS \"IsSeasonBest\";");
        }
    }
}
