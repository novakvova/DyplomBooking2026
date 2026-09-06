using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers;

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
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")!;

    // ──────────────────────────────────────────
    // HOUSING CRUD
    // ──────────────────────────────────────────

    /// <summary>
    /// Отримати всі доступні об'єкти житла.
    /// Повертає також середній рейтинг і кількість видимих відгуків.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HousingDto>>> GetAll(
        [FromQuery] string? city = null,
        [FromQuery] int? minGuests = null,
        [FromQuery] decimal? maxPrice = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Housings
            .AsNoTracking()
            .Include(h => h.Owner)
            .Include(h => h.Photos)
            .Where(h => h.IsAvailable);

        if (!string.IsNullOrWhiteSpace(city))
        {
            var cityQuery = city.Trim().ToLower();

            query = query.Where(
                h => h.City.ToLower().Contains(cityQuery));
        }

        if (minGuests.HasValue)
        {
            query = query.Where(
                h => h.MaxGuests >= minGuests.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(
                h => h.PricePerNight <= maxPrice.Value);
        }

        var housings = await query
            .ToListAsync(cancellationToken);

        if (housings.Count == 0)
            return Ok(Array.Empty<HousingDto>());

        var housingIds = housings
            .Select(h => h.Id)
            .ToList();

        var reviewStats = await _context.Reviews
            .AsNoTracking()
            .Where(r =>
                housingIds.Contains(r.HousingId) &&
                r.IsVisible)
            .GroupBy(r => r.HousingId)
            .Select(group => new
            {
                HousingId = group.Key,
                ReviewCount = group.Count(),
                AverageRating = group.Average(r => (double)r.Rating)
            })
            .ToDictionaryAsync(
                item => item.HousingId,
                cancellationToken);

        var result = housings
            .Select(h =>
            {
                reviewStats.TryGetValue(
                    h.Id,
                    out var stats);

                return ToDto(
                    h,
                    stats?.AverageRating ?? 0,
                    stats?.ReviewCount ?? 0);
            })
            .ToList();

        return Ok(result);
    }

    /// <summary>
    /// Отримати житло за ID.
    /// Повертає повну інформацію для сторінки житла,
    /// середній рейтинг і кількість видимих відгуків.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<HousingDto>> GetById(
        int id,
        CancellationToken cancellationToken = default)
    {
        var housing = await _context.Housings
            .AsNoTracking()
            .Include(h => h.Owner)
            .Include(h => h.Photos)
            .FirstOrDefaultAsync(
                h => h.Id == id,
                cancellationToken);

        if (housing is null)
            return NotFound();

        var stats = await _context.Reviews
            .AsNoTracking()
            .Where(r =>
                r.HousingId == id &&
                r.IsVisible)
            .GroupBy(r => r.HousingId)
            .Select(group => new
            {
                ReviewCount = group.Count(),
                AverageRating = group.Average(
                    r => (double)r.Rating)
            })
            .FirstOrDefaultAsync(cancellationToken);

        return Ok(
            ToDto(
                housing,
                stats?.AverageRating ?? 0,
                stats?.ReviewCount ?? 0));
    }

    /// <summary>
    /// Створити нове житло.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<HousingDto>> Create(
        CreateHousingDto dto,
        CancellationToken cancellationToken = default)
    {
        if (dto.PricePerNight <= 0)
        {
            return BadRequest(
                "Ціна за ніч повинна бути більше 0.");
        }

        if (dto.MaxGuests <= 0)
        {
            return BadRequest(
                "Кількість гостей повинна бути більше 0.");
        }

        if (dto.Rooms <= 0)
        {
            return BadRequest(
                "Кількість кімнат повинна бути більше 0.");
        }

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

        await _context.SaveChangesAsync(
            cancellationToken);

        await _context.Entry(housing)
            .Reference(h => h.Owner)
            .LoadAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = housing.Id },
            ToDto(housing));
    }

    /// <summary>
    /// Оновити житло.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<HousingDto>> Update(
        int id,
        UpdateHousingDto dto,
        CancellationToken cancellationToken = default)
    {
        var housing = await _context.Housings
            .Include(h => h.Owner)
            .Include(h => h.Photos)
            .FirstOrDefaultAsync(
                h => h.Id == id,
                cancellationToken);

        if (housing is null)
            return NotFound();

        if (dto.Title is not null)
            housing.Title = dto.Title;

        if (dto.Description is not null)
            housing.Description = dto.Description;

        if (dto.Type.HasValue)
            housing.Type = dto.Type.Value;

        if (dto.Address is not null)
            housing.Address = dto.Address;

        if (dto.City is not null)
            housing.City = dto.City;

        if (dto.Rooms.HasValue)
            housing.Rooms = dto.Rooms.Value;

        if (dto.MaxGuests.HasValue)
            housing.MaxGuests = dto.MaxGuests.Value;

        if (dto.PricePerNight.HasValue)
            housing.PricePerNight = dto.PricePerNight.Value;

        if (dto.IsAvailable.HasValue)
            housing.IsAvailable = dto.IsAvailable.Value;

        await _context.SaveChangesAsync(
            cancellationToken);

        var stats = await GetReviewStatsAsync(
            housing.Id,
            cancellationToken);

        return Ok(
            ToDto(
                housing,
                stats.AverageRating,
                stats.ReviewCount));
    }

    /// <summary>
    /// Деактивувати житло.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken = default)
    {
        var housing = await _context.Housings
            .FindAsync([id], cancellationToken);

        if (housing is null)
            return NotFound();

        housing.IsAvailable = false;

        await _context.SaveChangesAsync(
            cancellationToken);

        return NoContent();
    }

    // ──────────────────────────────────────────
    // BOOKINGS
    // ──────────────────────────────────────────

    [HttpPost("{id:int}/book")]
    [Authorize]
    public async Task<ActionResult<HousingBookingDto>> Book(
        int id,
        CreateHousingBookingDto dto,
        CancellationToken cancellationToken = default)
    {
        if (dto.CheckIn >= dto.CheckOut)
        {
            return BadRequest(
                "Дата заїзду має бути раніше дати виїзду.");
        }

        if (dto.CheckIn < DateTime.UtcNow.Date)
        {
            return BadRequest(
                "Неможливо забронювати на минулу дату.");
        }

        var housing = await _context.Housings
            .FindAsync([id], cancellationToken);

        if (housing is null || !housing.IsAvailable)
        {
            return NotFound(
                "Житло не знайдено або недоступне.");
        }

        if (dto.GuestsCount > housing.MaxGuests)
        {
            return BadRequest(
                $"Максимальна кількість гостей: {housing.MaxGuests}.");
        }

        var hasConflict =
            await _context.HousingBookings.AnyAsync(
                b =>
                    b.HousingId == id &&
                    b.Status != BookingStatus.Cancelled &&
                    dto.CheckIn < b.CheckOut &&
                    dto.CheckOut > b.CheckIn,
                cancellationToken);

        if (hasConflict)
        {
            return Conflict(
                "Житло вже заброньоване на ці дати.");
        }

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

        await _context.SaveChangesAsync(
            cancellationToken);

        await _context.Entry(booking)
            .Reference(b => b.Housing)
            .LoadAsync(cancellationToken);

        await _context.Entry(booking)
            .Reference(b => b.User)
            .LoadAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetMyBookings),
            null,
            ToBookingDto(booking));
    }

    [HttpGet("bookings/my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<HousingBookingDto>>>
        GetMyBookings(
            CancellationToken cancellationToken = default)
    {
        var bookings = await _context.HousingBookings
            .AsNoTracking()
            .Include(b => b.Housing)
            .Include(b => b.User)
            .Where(b => b.UserId == CurrentUserId)
            .ToListAsync(cancellationToken);

        return Ok(
            bookings.Select(ToBookingDto));
    }

    [HttpGet("bookings")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<IEnumerable<HousingBookingDto>>>
        GetAllBookings(
            CancellationToken cancellationToken = default)
    {
        var bookings = await _context.HousingBookings
            .AsNoTracking()
            .Include(b => b.Housing)
            .Include(b => b.User)
            .ToListAsync(cancellationToken);

        return Ok(
            bookings.Select(ToBookingDto));
    }

    [HttpPatch("bookings/{id:int}/status")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> UpdateBookingStatus(
        int id,
        [FromBody] BookingStatus status,
        CancellationToken cancellationToken = default)
    {
        var booking = await _context.HousingBookings
            .FindAsync([id], cancellationToken);

        if (booking is null)
            return NotFound();

        booking.Status = status;

        await _context.SaveChangesAsync(
            cancellationToken);

        return NoContent();
    }

    // ──────────────────────────────────────────
    // HELPERS / MAPPERS
    // ──────────────────────────────────────────

    private async Task<(double AverageRating, int ReviewCount)>
        GetReviewStatsAsync(
            int housingId,
            CancellationToken cancellationToken)
    {
        var stats = await _context.Reviews
            .AsNoTracking()
            .Where(r =>
                r.HousingId == housingId &&
                r.IsVisible)
            .GroupBy(r => r.HousingId)
            .Select(group => new
            {
                ReviewCount = group.Count(),
                AverageRating = group.Average(
                    r => (double)r.Rating)
            })
            .FirstOrDefaultAsync(cancellationToken);

        return stats is null
            ? (0, 0)
            : (
                Math.Round(stats.AverageRating, 1),
                stats.ReviewCount);
    }

    private static HousingDto ToDto(
        Housing h,
        double averageRating = 0,
        int reviewCount = 0) => new()
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
            PricePerHour = h.PricePerHour,

            IsAvailable = h.IsAvailable,
            OwnerName = h.Owner?.FullName ?? h.Owner?.Email ?? "—",
            CreatedAt = h.CreatedAt,

            MainPhotoPath =
            h.Photos
                .FirstOrDefault(p => p.IsMain)
                ?.FilePath
            ?? h.Photos
                .FirstOrDefault()
                ?.FilePath,

            AverageRating = Math.Round(averageRating, 1),
            ReviewCount = reviewCount,

            Category = h.Category ?? "",
            PropertyType = h.PropertyType ?? "",
            RentalFormat = h.RentalFormat ?? "",
            AccommodationType = h.AccommodationType ?? "",

            Bedrooms = h.Bedrooms,
            Beds = h.Beds,
            Bathrooms = h.Bathrooms,

            PrivateBathroomInside = h.PrivateBathroomInside,
            PrivateBathroomOutside = h.PrivateBathroomOutside,
            SharedBathroom = h.SharedBathroom,

            BedroomLock = h.BedroomLock,

            LivesWithHost = h.LivesWithHost,
            LivesWithFamily = h.LivesWithFamily,
            OtherGuestsPresent = h.OtherGuestsPresent,
            PetsPresent = h.PetsPresent,

            Amenities = h.Amenities ?? [],
            Highlights = h.Highlights ?? [],

            BookingMode = h.BookingMode ?? "manual",

            WeeklyDiscountPercent = h.WeeklyDiscountPercent,
            MonthlyDiscountPercent = h.MonthlyDiscountPercent,
            ShortStayDiscountPercent = h.ShortStayDiscountPercent,

            SecurityCameras = h.SecurityCameras,
            NoiseMonitor = h.NoiseMonitor,
            PropertySafetyFeatures = h.PropertySafetyFeatures,

            SecurityCamerasDescription =
            h.SecurityCamerasDescription ?? "",

            NoiseMonitorDescription =
            h.NoiseMonitorDescription ?? "",

            PropertySafetyFeaturesDescription =
            h.PropertySafetyFeaturesDescription ?? "",

            CheckInTime = h.CheckInTime ?? "14:00",
            CheckOutTime = h.CheckOutTime ?? "11:00",

            HourlyStartTime = h.HourlyStartTime ?? "09:00",
            HourlyEndTime = h.HourlyEndTime ?? "21:00",

            EarlyCheckIn = h.EarlyCheckIn ?? "none",

            SmokingRule = h.SmokingRule ?? "forbidden",
            PetsRule = h.PetsRule ?? "forbidden",
            PartiesRule = h.PartiesRule ?? "forbidden",

            QuietHoursMode = h.QuietHoursMode ?? "disabled",
            QuietHoursFrom = h.QuietHoursFrom ?? "22:00",
            QuietHoursTo = h.QuietHoursTo ?? "08:00",

            AdditionalRules = h.AdditionalRules ?? "",

            MinimumStay = h.MinimumStay,
            BookingWindowMonths = h.BookingWindowMonths,
            PreparationTime = h.PreparationTime ?? "none"
        };

    private static HousingBookingDto ToBookingDto(
        HousingBooking b) => new()
        {
            Id = b.Id,
            HousingId = b.HousingId,
            HousingTitle =
            b.Housing?.Title
            ?? string.Empty,

            UserId = b.UserId,
            UserFullName = b.User?.FullName,
            CheckIn = b.CheckIn,
            CheckOut = b.CheckOut,
            GuestsCount = b.GuestsCount,
            Status = b.Status,

            TotalPrice =
            b.Housing is not null
                ? b.Housing.PricePerNight *
                  (decimal)
                  (b.CheckOut - b.CheckIn).TotalDays
                : 0
        };
}
