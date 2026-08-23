using Microsoft.AspNetCore.Identity;

namespace DyplomBooking2026.Models;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }

    // Шлях до аватара.
    public string? AvatarPath { get; set; }

    // Дата реєстрації користувача.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Адміністративне блокування акаунта.
    public bool IsBlocked { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}