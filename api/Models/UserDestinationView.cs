namespace DyplomBooking2026.Models
{
    public class UserDestinationView
    {
        public int Id { get; set; }

        // Для авторизованого користувача.
        public string? UserId { get; set; }

        // Для неавторизованого браузера.
        public string? VisitorId { get; set; }

        public int DestinationId { get; set; }
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;

        public Destination Destination { get; set; } = null!;
    }
}