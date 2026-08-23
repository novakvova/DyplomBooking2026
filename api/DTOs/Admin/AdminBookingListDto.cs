namespace DyplomBooking2026.DTOs.Admin;

public class AdminBookingListDto
{
    public int Id { get; set; }

    public int HousingId { get; set; }
    public string HousingTitle { get; set; } = "";

    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string UserEmail { get; set; } = "";

    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }

    public int GuestsCount { get; set; }
    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class AdminBookingsResponseDto
{
    public List<AdminBookingListDto> Items { get; set; } = [];

    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}