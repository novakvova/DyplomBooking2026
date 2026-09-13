namespace DyplomBooking2026.DTOs.Wishlist;

public class AddWishlistDto
{
    public int HousingId { get; set; }
    public List<int> FolderIds { get; set; } = [];
}