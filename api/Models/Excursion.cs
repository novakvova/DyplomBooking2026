namespace DyplomBooking2026.Models
{
    public class Excursion
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string City { get; set; } = "";
        public string ImagePath { get; set; } = "";
        public decimal Price { get; set; }
        public string Category { get; set; } = "";
        public string Duration { get; set; } = "";
        public double Rating { get; set; }
        public string Description { get; set; } = "";
    }
}
