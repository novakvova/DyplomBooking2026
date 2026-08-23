namespace DyplomBooking2026.DTOs.Admin;

public class AdminHousingListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string City { get; set; } = "";
    public string Type { get; set; } = "";

    public decimal PricePerNight { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }

    public string OwnerId { get; set; } = "";
    public string OwnerName { get; set; } = "";
    public string OwnerEmail { get; set; } = "";

    public int BookingsCount { get; set; }
    public string? MainPhotoPath { get; set; }
}

public class AdminHousingsResponseDto
{
    public List<AdminHousingListDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}