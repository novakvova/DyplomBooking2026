using Microsoft.AspNetCore.Identity;

namespace DyplomBooking2026.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }

        // Шлях до аватара, наприклад: /images/avatars/abc123.webp
        public string? AvatarPath { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
