using System.Text.Json;

namespace DyplomBooking2026.DTOs.Housing;

public class CreateHousingRequestDto
{
    public JsonElement? Address { get; set; }

    public string? Category { get; set; }
    public string? PropertyType { get; set; }
    public string? RentalFormat { get; set; }
    public string? AccommodationType { get; set; }

    public int Guests { get; set; }
    public int Bedrooms { get; set; }
    public int Beds { get; set; }
    public int Bathrooms { get; set; }

    public int PrivateBathroomInside { get; set; }
    public int PrivateBathroomOutside { get; set; }
    public int SharedBathroom { get; set; }

    public string? BedroomLock { get; set; }

    public bool LivesWithHost { get; set; }
    public bool LivesWithFamily { get; set; }
    public bool OtherGuestsPresent { get; set; }
    public bool PetsPresent { get; set; }

    public string[] Amenities { get; set; } = [];
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string[] Highlights { get; set; } = [];

    public string? BookingMode { get; set; }

    // У frontend ці значення зберігаються в базовій валюті UAH.
    public decimal PricePerNight { get; set; }
    public decimal PricePerHour { get; set; }

    public int WeeklyDiscountPercent { get; set; }
    public int MonthlyDiscountPercent { get; set; }
    public int ShortStayDiscountPercent { get; set; }

    public bool SecurityCameras { get; set; }
    public bool NoiseMonitor { get; set; }
    public bool PropertySafetyFeatures { get; set; }

    public string SecurityCamerasDescription { get; set; } = "";
    public string NoiseMonitorDescription { get; set; } = "";
    public string PropertySafetyFeaturesDescription { get; set; } = "";

    public string CheckInTime { get; set; } = "14:00";
    public string CheckOutTime { get; set; } = "11:00";

    public string HourlyStartTime { get; set; } = "09:00";
    public string HourlyEndTime { get; set; } = "21:00";

    public string EarlyCheckIn { get; set; } = "none";

    public string SmokingRule { get; set; } = "forbidden";
    public string PetsRule { get; set; } = "forbidden";
    public string PartiesRule { get; set; } = "forbidden";

    public string QuietHoursMode { get; set; } = "disabled";
    public string QuietHoursFrom { get; set; } = "22:00";
    public string QuietHoursTo { get; set; } = "08:00";

    public string AdditionalRules { get; set; } = "";

    public int MinimumStay { get; set; } = 1;
    public int BookingWindowMonths { get; set; } = 6;
    public string PreparationTime { get; set; } = "none";
}
