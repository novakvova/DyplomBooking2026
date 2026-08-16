namespace DyplomBooking2026.Models
{
    public class WishlistItem
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
        public int HousingId { get; set; }
        public Housing Housing { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
