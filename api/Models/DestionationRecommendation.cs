namespace DyplomBooking2026.Models
{
    public class DestinationRecommendation
    {
        public int Id { get; set; }
        public int DestinationId { get; set; }
        public string UserId { get; set; } = "";
        public int Score { get; set; }
    }
}
