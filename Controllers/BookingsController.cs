using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    [Authorize] // усі дії з бронюваннями вимагають авторизації
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

        // GET /api/bookings/my — бронювання поточного користувача
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Where(b => b.UserId == CurrentUserId)
                .Select(b => ToDto(b))
                .ToListAsync();

            return Ok(bookings);
        }

        // GET /api/bookings — усі бронювання, лише Admin/Manager
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAll()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Select(b => ToDto(b))
                .ToListAsync();

            return Ok(bookings);
        }

        // POST /api/bookings — створити бронювання
        [HttpPost]
        public async Task<ActionResult<BookingDto>> Create(CreateBookingDto dto)
        {
            if (dto.StartTime >= dto.EndTime)
            {
                return BadRequest("Час початку має бути раніше часу завершення.");
            }

            if (dto.StartTime < DateTime.UtcNow)
            {
                return BadRequest("Неможливо забронювати кімнату в минулому.");
            }

            var room = await _context.Rooms.FindAsync(dto.RoomId);
            if (room == null || !room.IsActive)
            {
                return NotFound("Кімнату не знайдено.");
            }

            // Перевірка перетину часу з існуючими (не скасованими) бронюваннями
            var hasConflict = await _context.Bookings.AnyAsync(b =>
                b.RoomId == dto.RoomId &&
                b.Status != BookingStatus.Cancelled &&
                dto.StartTime < b.EndTime &&
                dto.EndTime > b.StartTime);

            if (hasConflict)
            {
                return Conflict("Кімната вже зайнята на цей час.");
            }

            var booking = new Booking
            {
                UserId = CurrentUserId,
                RoomId = dto.RoomId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Status = BookingStatus.Pending
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            await _context.Entry(booking).Reference(b => b.Room).LoadAsync();
            await _context.Entry(booking).Reference(b => b.User).LoadAsync();

            return CreatedAtAction(nameof(GetMyBookings), null, ToDto(booking));
        }

        // PATCH /api/bookings/5/status — змінити статус, лише Admin/Manager
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] BookingStatus status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/bookings/5 — скасувати власне бронювання
        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            var isOwner = booking.UserId == CurrentUserId;
            var isStaff = User.IsInRole("Admin") || User.IsInRole("Manager");

            if (!isOwner && !isStaff) return Forbid();

            booking.Status = BookingStatus.Cancelled;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static BookingDto ToDto(Booking b) => new()
        {
            Id = b.Id,
            RoomId = b.RoomId,
            RoomName = b.Room?.Name ?? string.Empty,
            UserId = b.UserId,
            UserFullName = b.User?.FullName,
            StartTime = b.StartTime,
            EndTime = b.EndTime,
            Status = b.Status
        };
    }
}
