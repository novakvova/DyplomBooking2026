namespace DyplomBooking2026.Models;

public class Review
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
    public int HousingId { get; set; }
    public Housing Housing { get; set; } = null!;
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
    public bool IsVisible { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}