using System.ComponentModel.DataAnnotations;

namespace DyplomBooking2026.Models;

public class WishlistFolder
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;

    [MaxLength(100)]
    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WishlistItem> Items { get; set; } = new List<WishlistItem>();
}