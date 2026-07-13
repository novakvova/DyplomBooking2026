namespace DyplomBooking2026.Models
{
    public class HousingBooking
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        public int HousingId { get; set; }
        public Housing Housing { get; set; } = null!;

        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int GuestsCount { get; set; }

        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public decimal TotalPrice => Housing is null
            ? 0
            : Housing.PricePerNight * (decimal)(CheckOut - CheckIn).TotalDays;
    }
}
