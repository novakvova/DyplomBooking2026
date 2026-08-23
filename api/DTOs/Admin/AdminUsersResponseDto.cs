namespace DyplomBooking2026.DTOs.Admin;

public class AdminUsersResponseDto
{
    public List<AdminUserDto> Items { get; set; } = [];

    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}
