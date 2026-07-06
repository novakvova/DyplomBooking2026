namespace DyplomBooking2026.Models
{
    public enum HousingType
    {
        Apartment,
        House,
        Room,
        Studio,
        Villa
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

        public ICollection<HousingBooking> Bookings { get; set; } = new List<HousingBooking>();
        public ICollection<HousingPhoto> Photos { get; set; } = new List<HousingPhoto>();
    }
}
