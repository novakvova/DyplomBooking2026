namespace DyplomBooking2026.Models
{
    public enum HousingType
    {
        // Квартири
        Apartment,
        Studio,
        Loft,
        Aparthotel,
        Penthouse,
        Duplex,

        // Будинки
        House,
        Villa,
        Townhouse,
        Chalet,
        Bungalow,
        Estate,

        // Готельне житло
        Hotel,
        MiniHotel,
        Hostel,
        GuestHouse,
        Motel,

        // Альтернативне житло
        Glamping,
        AFrame,
        Barnhouse,
        TreeHouse,
        Houseboat,
        Camper,

        Room
    }

    public class Housing
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public HousingType Type { get; set; }
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public int Rooms { get; set; }
        public int MaxGuests { get; set; }
        public decimal PricePerNight { get; set; }
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string OwnerId { get; set; } = null!;
        public ApplicationUser Owner { get; set; } = null!;


        public decimal PricePerHour { get; set; }

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


        public ICollection<HousingBooking> Bookings { get; set; } = new List<HousingBooking>();
        public ICollection<HousingPhoto> Photos { get; set; } = new List<HousingPhoto>();
    }
}
