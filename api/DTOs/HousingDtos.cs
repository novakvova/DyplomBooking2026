using DyplomBooking2026.Models;

namespace DyplomBooking2026.DTOs
{
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
        public bool IsAvailable { get; set; }
        public string OwnerName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateHousingBookingDto
    {
        public int HousingId { get; set; }
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
}
