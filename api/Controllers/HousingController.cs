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
    [Route("api/housing")]
    public class HousingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HousingController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

        // ──────────────────────────────────────────
        // HOUSING CRUD
        // ──────────────────────────────────────────

        /// <summary>
        /// Отримати всі доступні об'єкти житла (публічно)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HousingDto>>> GetAll(
            [FromQuery] string? city = null,
            [FromQuery] int? minGuests = null,
            [FromQuery] decimal? maxPrice = null)
        {
            var query = _context.Housings
                .Include(h => h.Owner)
                .Where(h => h.IsAvailable);

            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(h => h.City.ToLower().Contains(city.ToLower()));

            if (minGuests.HasValue)
                query = query.Where(h => h.MaxGuests >= minGuests.Value);

            if (maxPrice.HasValue)
                query = query.Where(h => h.PricePerNight <= maxPrice.Value);

            var result = await query.Select(h => ToDto(h)).ToListAsync();
            return Ok(result);
        }

        /// <summary>
        /// Отримати конкретний об'єкт житла за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<HousingDto>> GetById(int id)
        {
            var housing = await _context.Housings
                .Include(h => h.Owner)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (housing == null) return NotFound();

            return Ok(ToDto(housing));
        }

        /// <summary>
        /// Створити новий об'єкт житла (тільки Admin/Manager)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<HousingDto>> Create(CreateHousingDto dto)
        {
            if (dto.PricePerNight <= 0)
                return BadRequest("Ціна за ніч повинна бути більше 0.");

            if (dto.MaxGuests <= 0)
                return BadRequest("Кількість гостей повинна бути більше 0.");

            if (dto.Rooms <= 0)
                return BadRequest("Кількість кімнат повинна бути більше 0.");

            var housing = new Housing
            {
                Title = dto.Title,
                Description = dto.Description,
                Type = dto.Type,
                Address = dto.Address,
                City = dto.City,
                Rooms = dto.Rooms,
                MaxGuests = dto.MaxGuests,
                PricePerNight = dto.PricePerNight,
                OwnerId = CurrentUserId
            };

            _context.Housings.Add(housing);
            await _context.SaveChangesAsync();

            await _context.Entry(housing).Reference(h => h.Owner).LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = housing.Id }, ToDto(housing));
        }

        /// <summary>
        /// Оновити об'єкт житла (тільки Admin/Manager)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<HousingDto>> Update(int id, UpdateHousingDto dto)
        {
            var housing = await _context.Housings
                .Include(h => h.Owner)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (housing == null) return NotFound();

            if (dto.Title is not null) housing.Title = dto.Title;
            if (dto.Description is not null) housing.Description = dto.Description;
            if (dto.Address is not null) housing.Address = dto.Address;
            if (dto.City is not null) housing.City = dto.City;
            if (dto.Rooms.HasValue) housing.Rooms = dto.Rooms.Value;
            if (dto.MaxGuests.HasValue) housing.MaxGuests = dto.MaxGuests.Value;
            if (dto.PricePerNight.HasValue) housing.PricePerNight = dto.PricePerNight.Value;
            if (dto.IsAvailable.HasValue) housing.IsAvailable = dto.IsAvailable.Value;

            await _context.SaveChangesAsync();

            return Ok(ToDto(housing));
        }

        /// <summary>
        /// Видалити (деактивувати) об'єкт житла (тільки Admin)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var housing = await _context.Housings.FindAsync(id);
            if (housing == null) return NotFound();

            housing.IsAvailable = false; // м'яке видалення
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ──────────────────────────────────────────
        // HOUSING BOOKINGS
        // ──────────────────────────────────────────

        /// <summary>
        /// Забронювати житло (авторизований користувач)
        /// </summary>
        [HttpPost("{id}/book")]
        [Authorize]
        public async Task<ActionResult<HousingBookingDto>> Book(int id, CreateHousingBookingDto dto)
        {
            if (dto.CheckIn >= dto.CheckOut)
                return BadRequest("Дата заїзду має бути раніше дати виїзду.");

            if (dto.CheckIn < DateTime.UtcNow.Date)
                return BadRequest("Неможливо забронювати на минулу дату.");

            var housing = await _context.Housings.FindAsync(id);
            if (housing == null || !housing.IsAvailable)
                return NotFound("Житло не знайдено або недоступне.");

            if (dto.GuestsCount > housing.MaxGuests)
                return BadRequest($"Максимальна кількість гостей: {housing.MaxGuests}.");

            var hasConflict = await _context.HousingBookings.AnyAsync(b =>
                b.HousingId == id &&
                b.Status != BookingStatus.Cancelled &&
                dto.CheckIn < b.CheckOut &&
                dto.CheckOut > b.CheckIn);

            if (hasConflict)
                return Conflict("Житло вже заброньоване на ці дати.");

            var booking = new HousingBooking
            {
                UserId = CurrentUserId,
                HousingId = id,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                GuestsCount = dto.GuestsCount,
                Status = BookingStatus.Pending
            };

            _context.HousingBookings.Add(booking);
            await _context.SaveChangesAsync();

            await _context.Entry(booking).Reference(b => b.Housing).LoadAsync();
            await _context.Entry(booking).Reference(b => b.User).LoadAsync();

            return CreatedAtAction(nameof(GetMyBookings), null, ToBookingDto(booking));
        }

        /// <summary>
        /// Мої бронювання житла
        /// </summary>
        [HttpGet("bookings/my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<HousingBookingDto>>> GetMyBookings()
        {
            var bookings = await _context.HousingBookings
                .Include(b => b.Housing)
                .Include(b => b.User)
                .Where(b => b.UserId == CurrentUserId)
                .ToListAsync();

            return Ok(bookings.Select(ToBookingDto));
        }

        /// <summary>
        /// Всі бронювання житла (тільки Admin/Manager)
        /// </summary>
        [HttpGet("bookings")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<HousingBookingDto>>> GetAllBookings()
        {
            var bookings = await _context.HousingBookings
                .Include(b => b.Housing)
                .Include(b => b.User)
                .ToListAsync();

            return Ok(bookings.Select(ToBookingDto));
        }

        /// <summary>
        /// Змінити статус бронювання (Admin/Manager)
        /// </summary>
        [HttpPatch("bookings/{id}/status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatus status)
        {
            var booking = await _context.HousingBookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ──────────────────────────────────────────
        // Маппери
        // ──────────────────────────────────────────

        private static HousingDto ToDto(Housing h) => new()
        {
            Id = h.Id,
            Title = h.Title,
            Description = h.Description,
            Type = h.Type.ToString(),
            Address = h.Address,
            City = h.City,
            Rooms = h.Rooms,
            MaxGuests = h.MaxGuests,
            PricePerNight = h.PricePerNight,
            IsAvailable = h.IsAvailable,
            OwnerName = h.Owner?.FullName ?? h.Owner?.Email ?? "—",
            CreatedAt = h.CreatedAt
        };

        private static HousingBookingDto ToBookingDto(HousingBooking b) => new()
        {
            Id = b.Id,
            HousingId = b.HousingId,
            HousingTitle = b.Housing?.Title ?? string.Empty,
            UserId = b.UserId,
            UserFullName = b.User?.FullName,
            CheckIn = b.CheckIn,
            CheckOut = b.CheckOut,
            GuestsCount = b.GuestsCount,
            Status = b.Status,
            TotalPrice = b.Housing is not null
                ? b.Housing.PricePerNight * (decimal)(b.CheckOut - b.CheckIn).TotalDays
                : 0
        };
    }
}
