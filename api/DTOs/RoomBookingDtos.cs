using DyplomBooking2026.Models;

namespace DyplomBooking2026.DTOs
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public decimal PricePerHour { get; set; }
        public string? Location { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateRoomDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public decimal PricePerHour { get; set; }
        public string? Location { get; set; }
    }

    public class CreateBookingDto
    {
        public int RoomId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class BookingDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string RoomName { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? UserFullName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public BookingStatus Status { get; set; }
    }
}
