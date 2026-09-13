using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// Друга виправна міграція. Попередня (FixHousingHomePageSectionsColumns)
    /// використовувала "ADD COLUMN IF NOT EXISTS" для TravelCategory
    /// /IsHotDeal/HotDealDiscountPercent/IsSeasonBest — але якщо котрась
    /// із цих колонок уже існувала (з більш ранньої, іншої спроби
    /// міграції) з НЕПРАВИЛЬНИМ типом (наприклад, TravelCategory як
    /// integer замість text), "IF NOT EXISTS" просто пропускав її,
    /// залишаючи хибний тип — звідси помилка Npgsql "Reading as
    /// 'System.String' is not supported for fields having DataTypeName
    /// 'integer'".
    ///
    /// Ця міграція не покладається на "чи існує колонка" — вона прямо
    /// перевіряє поточний тип кожної колонки через information_schema
    /// і ALTER COLUMN ... TYPE, якщо тип не збігається з очікуваним.
    /// Ідемпотентна: повторний запуск нічого не зламає.
    /// </summary>
    public partial class FixHousingHomePageColumnTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DO $$
BEGIN
    -- TravelCategory має бути text.
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Housings'
          AND column_name = 'TravelCategory'
          AND data_type <> 'text'
    ) THEN
        ALTER TABLE ""Housings""
            ALTER COLUMN ""TravelCategory"" DROP DEFAULT;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""TravelCategory"" TYPE text
            USING ""TravelCategory""::text;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""TravelCategory"" SET DEFAULT '';

        UPDATE ""Housings"" SET ""TravelCategory"" = ''
            WHERE ""TravelCategory"" IS NULL;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""TravelCategory"" SET NOT NULL;
    END IF;

    -- IsHotDeal має бути boolean.
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Housings'
          AND column_name = 'IsHotDeal'
          AND data_type <> 'boolean'
    ) THEN
        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsHotDeal"" DROP DEFAULT;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsHotDeal"" TYPE boolean
            USING (""IsHotDeal""::integer <> 0);

        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsHotDeal"" SET DEFAULT false;

        UPDATE ""Housings"" SET ""IsHotDeal"" = false
            WHERE ""IsHotDeal"" IS NULL;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsHotDeal"" SET NOT NULL;
    END IF;

    -- HotDealDiscountPercent має бути integer.
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Housings'
          AND column_name = 'HotDealDiscountPercent'
          AND data_type <> 'integer'
    ) THEN
        ALTER TABLE ""Housings""
            ALTER COLUMN ""HotDealDiscountPercent"" DROP DEFAULT;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""HotDealDiscountPercent"" TYPE integer
            USING ROUND(""HotDealDiscountPercent""::numeric)::integer;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""HotDealDiscountPercent"" SET DEFAULT 0;

        UPDATE ""Housings"" SET ""HotDealDiscountPercent"" = 0
            WHERE ""HotDealDiscountPercent"" IS NULL;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""HotDealDiscountPercent"" SET NOT NULL;
    END IF;

    -- IsSeasonBest має бути boolean.
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Housings'
          AND column_name = 'IsSeasonBest'
          AND data_type <> 'boolean'
    ) THEN
        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsSeasonBest"" DROP DEFAULT;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsSeasonBest"" TYPE boolean
            USING (""IsSeasonBest""::integer <> 0);

        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsSeasonBest"" SET DEFAULT false;

        UPDATE ""Housings"" SET ""IsSeasonBest"" = false
            WHERE ""IsSeasonBest"" IS NULL;

        ALTER TABLE ""Housings""
            ALTER COLUMN ""IsSeasonBest"" SET NOT NULL;
    END IF;
END $$;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Типи навмисно не відкочуються — попередній (хибний)
            // тип не ніс жодного корисного сенсу, повертатись до
            // нього немає причин.
        }
    }
}
