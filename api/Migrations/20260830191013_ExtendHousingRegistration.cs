using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DyplomBooking2026.Migrations
{
    /// <inheritdoc />
    public partial class ExtendHousingRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccommodationType",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalRules",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string[]>(
                name: "Amenities",
                table: "Housings",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<int>(
                name: "Bathrooms",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BedroomLock",
                table: "Housings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Bedrooms",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Beds",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BookingMode",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "BookingWindowMonths",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CheckInTime",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CheckOutTime",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EarlyCheckIn",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string[]>(
                name: "Highlights",
                table: "Housings",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string>(
                name: "HourlyEndTime",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HourlyStartTime",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "LivesWithFamily",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LivesWithHost",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MinimumStay",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MonthlyDiscountPercent",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "NoiseMonitor",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NoiseMonitorDescription",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "OtherGuestsPresent",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PartiesRule",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "PetsPresent",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PetsRule",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreparationTime",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "PricePerHour",
                table: "Housings",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "PrivateBathroomInside",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PrivateBathroomOutside",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "PropertySafetyFeatures",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PropertySafetyFeaturesDescription",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PropertyType",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "QuietHoursFrom",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "QuietHoursMode",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "QuietHoursTo",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RentalFormat",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "SecurityCameras",
                table: "Housings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SecurityCamerasDescription",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SharedBathroom",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ShortStayDiscountPercent",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SmokingRule",
                table: "Housings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "WeeklyDiscountPercent",
                table: "Housings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccommodationType",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "AdditionalRules",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "Amenities",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "Bathrooms",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "BedroomLock",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "Bedrooms",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "Beds",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "BookingMode",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "BookingWindowMonths",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "CheckOutTime",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "EarlyCheckIn",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "Highlights",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "HourlyEndTime",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "HourlyStartTime",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "LivesWithFamily",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "LivesWithHost",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "MinimumStay",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "MonthlyDiscountPercent",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "NoiseMonitor",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "NoiseMonitorDescription",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "OtherGuestsPresent",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PartiesRule",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PetsPresent",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PetsRule",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PreparationTime",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PricePerHour",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PrivateBathroomInside",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PrivateBathroomOutside",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PropertySafetyFeatures",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PropertySafetyFeaturesDescription",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "PropertyType",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "QuietHoursFrom",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "QuietHoursMode",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "QuietHoursTo",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "RentalFormat",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "SecurityCameras",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "SecurityCamerasDescription",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "SharedBathroom",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "ShortStayDiscountPercent",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "SmokingRule",
                table: "Housings");

            migrationBuilder.DropColumn(
                name: "WeeklyDiscountPercent",
                table: "Housings");
        }
    }
}
