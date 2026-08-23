namespace DyplomBooking2026.DTOs.Admin;

public class AdminUserDetailsDto
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

    public List<AdminUserHousingDto> Housings { get; set; } = [];
    public List<AdminUserBookingDto> Bookings { get; set; } = [];
    public List<AdminUserWishlistDto> Wishlist { get; set; } = [];
}

public class AdminUserHousingDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string City { get; set; } = null!;
    public decimal PricePerNight { get; set; }
    public bool IsAvailable { get; set; }
    public string? MainPhotoPath { get; set; }
}

public class AdminUserBookingDto
{
    public int Id { get; set; }
    public int HousingId { get; set; }
    public string HousingTitle { get; set; } = null!;
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int GuestsCount { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "";
}

public class AdminUserWishlistDto
{
    public int HousingId { get; set; }
    public string Title { get; set; } = null!;
    public string City { get; set; } = null!;
    public decimal PricePerNight { get; set; }
    public string? MainPhotoPath { get; set; }
}