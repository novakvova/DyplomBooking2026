namespace DyplomBooking2026.DTOs.Admin;

public class AdminDestinationRequestDto
{
    public string Slug { get; set; } = "";
    public string CountryCode { get; set; } = "";
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public string ImagePath { get; set; } = "";
    public string Description { get; set; } = "";
    public bool IsPopular { get; set; }
}