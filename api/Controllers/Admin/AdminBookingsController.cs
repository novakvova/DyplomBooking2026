using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs.Admin;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers.Admin;

[ApiController]
[Route("api/admin/bookings")]
[Authorize(Roles = "Admin")]
public class AdminBookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminBookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/bookings
    // Список бронювань + пошук + фільтри + pagination.
    // ─────────────────────────────────────────────

    [HttpGet]
    public async Task<ActionResult<AdminBookingsResponseDto>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.HousingBookings
            .AsNoTracking()
            .AsQueryable();

        // Пошук по користувачу та житлу.
        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLower();

            query = query.Where(b =>
                b.Housing.Title.ToLower().Contains(normalizedSearch) ||
                (b.User.Email != null &&
                 b.User.Email.ToLower().Contains(normalizedSearch)) ||
                (b.User.FullName != null &&
                 b.User.FullName.ToLower().Contains(normalizedSearch))
            );
        }

        // Фільтр за статусом.
        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<BookingStatus>(
                status,
                true,
                out var bookingStatus
            ))
            {
                return BadRequest("Недопустимий статус бронювання.");
            }

            query = query.Where(b => b.Status == bookingStatus);
        }

        // Дата заїзду від.
        if (from.HasValue)
        {
            query = query.Where(b =>
                b.CheckIn >= from.Value
            );
        }

        // Дата заїзду до.
        if (to.HasValue)
        {
            var endDate = to.Value.Date.AddDays(1);

            query = query.Where(b =>
                b.CheckIn < endDate
            );
        }

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new AdminBookingListDto
            {
                Id = b.Id,

                HousingId = b.HousingId,
                HousingTitle = b.Housing.Title,

                UserId = b.UserId,

                UserName =
                    b.User.FullName
                    ?? b.User.Email
                    ?? "—",

                UserEmail =
                    b.User.Email
                    ?? "",

                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,

                GuestsCount = b.GuestsCount,
                TotalPrice = b.TotalPrice,

                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(new AdminBookingsResponseDto
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(
                totalItems / (double)pageSize
            )
        });
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/bookings/{id}
    // Детальна інформація про бронювання.
    // ─────────────────────────────────────────────

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminBookingDetailsDto>> GetById(int id)
    {
        var booking = await _context.HousingBookings
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new AdminBookingDetailsDto
            {
                Id = b.Id,

                HousingId = b.HousingId,
                HousingTitle = b.Housing.Title,
                HousingCity = b.Housing.City,

                HousingMainPhotoPath = b.Housing.Photos
                    .Where(p => p.IsMain)
                    .Select(p => p.FilePath)
                    .FirstOrDefault()
                    ?? b.Housing.Photos
                        .Select(p => p.FilePath)
                        .FirstOrDefault(),

                UserId = b.UserId,

                UserName = b.User != null
                    ? b.User.FullName ?? b.User.Email ?? "—"
                    : "—",

                UserEmail = b.User != null
                    ? b.User.Email ?? ""
                    : "",

                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,

                GuestsCount = b.GuestsCount,
                TotalPrice = b.TotalPrice,

                Status = b.Status.ToString(),

                Payment = _context.Payments
                    .Where(p => p.HousingBookingId == b.Id)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new AdminBookingPaymentDto
                    {
                        Id = p.Id,
                        TransactionId = p.TransactionId,
                        Amount = p.Amount,
                        Currency = p.Currency,
                        Status = p.Status.ToString(),
                        Method = p.Method.ToString(),
                        CreatedAt = p.CreatedAt
                    })
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (booking == null)
            return NotFound("Бронювання не знайдено.");

        return Ok(booking);
    }

    // ─────────────────────────────────────────────
    // PATCH: api/admin/bookings/{id}/status
    // Зміна статусу HousingBooking.
    // ─────────────────────────────────────────────

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateBookingStatusDto dto
    )
    {
        var booking = await _context.HousingBookings
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return NotFound("Бронювання не знайдено.");

        if (string.IsNullOrWhiteSpace(dto.Status))
            return BadRequest("Статус не вказано.");

        if (!Enum.TryParse<BookingStatus>(
            dto.Status,
            true,
            out var newStatus
        ))
        {
            return BadRequest("Недопустимий статус бронювання.");
        }

        if (!Enum.IsDefined(typeof(BookingStatus), newStatus))
            return BadRequest("Недопустимий статус бронювання.");

        // Статус уже такий самий.
        if (booking.Status == newStatus)
            return NoContent();

        // Допустимі переходи між статусами.
        var isValidTransition = booking.Status switch
        {
            BookingStatus.Pending =>
                newStatus is BookingStatus.Confirmed
                or BookingStatus.Cancelled,

            BookingStatus.Confirmed =>
                newStatus is BookingStatus.Completed
                or BookingStatus.Cancelled,

            BookingStatus.Cancelled => false,
            BookingStatus.Completed => false,

            _ => false
        };

        if (!isValidTransition)
        {
            return BadRequest(
                $"Неможливо змінити статус з {booking.Status} на {newStatus}."
            );
        }

        booking.Status = newStatus;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}