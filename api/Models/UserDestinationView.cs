namespace DyplomBooking2026.Models
{
    public class UserDestinationView
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public int DestinationId { get; set; }
        public DateTime ViewedAt { get; set; }
        public Destination Destination { get; set; } = null!;
    }
}
