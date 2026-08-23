namespace DyplomBooking2026.DTOs.Admin;

public class AdminUserDto
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FullName { get; set; }
    public string? AvatarPath { get; set; }

    public bool IsBlocked { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<string> Roles { get; set; } = [];

    public int HousingsCount { get; set; }
    public int BookingsCount { get; set; }
    public int WishlistCount { get; set; }
}