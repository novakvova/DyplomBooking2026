namespace DyplomBooking2026.Models
{
    public class Destination
    {
        public int Id { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string CountryCode { get; set; } = string.Empty;
        public string City { get; set; } = "";
        public string Country { get; set; } = "";
        public string ImagePath { get; set; } = "";
        public string Description { get; set; } = "";
        public int ViewCount { get; set; }
        public bool IsPopular { get; set; }
        public ICollection<UserDestinationView> UserViews { get; set; } = new List<UserDestinationView>();
    }
}
