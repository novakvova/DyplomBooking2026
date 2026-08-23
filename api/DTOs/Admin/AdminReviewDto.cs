namespace DyplomBooking2026.DTOs.Admin;

public class AdminReviewDto
{
    public int Id { get; set; }

    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string UserEmail { get; set; } = "";

    public int HousingId { get; set; }
    public string HousingTitle { get; set; } = "";

    public int Rating { get; set; }
    public string Comment { get; set; } = "";

    public bool IsVisible { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AdminReviewsResponseDto
{
    public List<AdminReviewDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}