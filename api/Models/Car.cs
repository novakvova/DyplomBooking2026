namespace DyplomBooking2026.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string Brand { get; set; } = "";
        public string Model { get; set; } = "";
        public string City { get; set; } = "";
        public string ImagePath { get; set; } = "";
        public decimal PricePerDay { get; set; }
        public string Transmission { get; set; } = "";
        public string FuelType { get; set; } = "";
        public int Seats { get; set; }
        public double Rating { get; set; }
        public bool Available { get; set; }
    }
}
