namespace DyplomBooking2026.DTOs.Admin;

public class AdminBookingDetailsDto
{
    public int Id { get; set; }

    public int HousingId { get; set; }
    public string HousingTitle { get; set; } = "";
    public string HousingCity { get; set; } = "";
    public string? HousingMainPhotoPath { get; set; }

    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string UserEmail { get; set; } = "";

    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }

    public int GuestsCount { get; set; }
    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "";

    public AdminBookingPaymentDto? Payment { get; set; }
}

public class AdminBookingPaymentDto
{
    public int Id { get; set; }
    public string TransactionId { get; set; } = "";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "";
    public string Status { get; set; } = "";
    public string Method { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}