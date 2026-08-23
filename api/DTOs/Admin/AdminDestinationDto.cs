namespace DyplomBooking2026.DTOs.Admin;

public class AdminDestinationDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = "";
    public string CountryCode { get; set; } = "";
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public string ImagePath { get; set; } = "";
    public string Description { get; set; } = "";
    public int ViewCount { get; set; }
    public bool IsPopular { get; set; }
}

public class AdminDestinationsResponseDto
{
    public List<AdminDestinationDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}