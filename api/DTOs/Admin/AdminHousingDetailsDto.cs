namespace DyplomBooking2026.DTOs.Admin;

public class AdminHousingDetailsDto
{
    public int Id { get; set; }

    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Type { get; set; } = "";

    public string Address { get; set; } = "";
    public string City { get; set; } = "";

    public int Rooms { get; set; }
    public int MaxGuests { get; set; }

    public decimal PricePerNight { get; set; }
    public bool IsAvailable { get; set; }

    public DateTime CreatedAt { get; set; }

    public string OwnerId { get; set; } = "";
    public string OwnerName { get; set; } = "";
    public string OwnerEmail { get; set; } = "";

    public int BookingsCount { get; set; }

    public List<AdminHousingPhotoDto> Photos { get; set; } = [];
}

public class AdminHousingPhotoDto
{
    public int Id { get; set; }
    public string FilePath { get; set; } = "";
    public bool IsMain { get; set; }
}