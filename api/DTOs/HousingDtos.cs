using DyplomBooking2026.Models;

namespace DyplomBooking2026.DTOs;

public class CreateHousingDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public HousingType Type { get; set; }
    public string Address { get; set; } = null!;
    public string City { get; set; } = null!;
    public int Rooms { get; set; }
    public int MaxGuests { get; set; }
    public decimal PricePerNight { get; set; }
}

public class UpdateHousingDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public HousingType? Type { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public int? Rooms { get; set; }
    public int? MaxGuests { get; set; }
    public decimal? PricePerNight { get; set; }
    public bool? IsAvailable { get; set; }
}

public class HousingDto
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string Type { get; set; } = null!;

    public string Address { get; set; } = null!;
    public string City { get; set; } = null!;

    public int Rooms { get; set; }
    public int MaxGuests { get; set; }

    public decimal PricePerNight { get; set; }
    public decimal PricePerHour { get; set; }

    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }

    public string OwnerName { get; set; } = "—";
    public string? MainPhotoPath { get; set; }

    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }

    // Реєстрація житла
    public string Category { get; set; } = "";
    public string PropertyType { get; set; } = "";
    public string RentalFormat { get; set; } = "";
    public string AccommodationType { get; set; } = "";

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
    public string[] Highlights { get; set; } = [];

    public string BookingMode { get; set; } = "manual";

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

public class CreateHousingBookingDto
{
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int GuestsCount { get; set; }
}

public class HousingBookingDto
{
    public int Id { get; set; }
    public int HousingId { get; set; }
    public string HousingTitle { get; set; } = null!;

    public string UserId { get; set; } = null!;
    public string? UserFullName { get; set; }

    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int GuestsCount { get; set; }

    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
}
