using DyplomBooking2026.Data;
using DyplomBooking2026.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers;


[ApiController]
[Route("api/[controller]")]
public class DestinationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;


    public DestinationsController(ApplicationDbContext context)
    {
        _context = context;
    }



    // GET: api/destinations
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var destinations = await _context.Destinations
            .ToListAsync();

        return Ok(destinations);
    }



    // GET: api/destinations/popular
    [HttpGet("popular")]
    public async Task<IActionResult> GetPopular()
    {
        var destinations = await _context.Destinations
            .Where(x => x.IsPopular)
            .OrderByDescending(x => x.ViewCount)
            .Take(10)
            .ToListAsync();


        return Ok(destinations);
    }



    // GET: api/destinations/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var destination = await _context.Destinations
            .FirstOrDefaultAsync(x => x.Id == id);


        if (destination == null)
        {
            return NotFound();
        }


        return Ok(destination);
    }

    // GET: api/Destinations/search?query=par
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Ok(new List<Destination>());
        }


        var destinations = await _context.Destinations
            .Where(x =>
                x.City.ToLower().Contains(query.ToLower()) ||
                x.Country.ToLower().Contains(query.ToLower())
            )
            .Take(10)
            .ToListAsync();


        return Ok(destinations);
    }

    // POST: api/destinations/{id}/view
    // Реєструє перегляд напрямку.
    [HttpPost("{id:int}/view")]
    public async Task<IActionResult> RegisterView(
        int id,
        [FromHeader(Name = "X-Visitor-Id")] string? visitorId
    )
    {
        var destination = await _context.Destinations
            .FirstOrDefaultAsync(x => x.Id == id);

        if (destination == null)
            return NotFound("Напрямок не знайдено.");

        // ─────────────────────────────────────────
        // 1. Чи увімкнений підрахунок переглядів.
        // ─────────────────────────────────────────

        var trackingSetting = await _context.AppSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.Key == "DestinationViewTrackingEnabled"
            );

        var trackingEnabled =
            trackingSetting == null ||
            !bool.TryParse(trackingSetting.Value, out var trackingValue) ||
            trackingValue;

        if (!trackingEnabled)
        {
            return Ok(new
            {
                destination.Id,
                destination.ViewCount,
                counted = false
            });
        }

        // ─────────────────────────────────────────
        // 2. Чи увімкнене обмеження 1 раз / 24 год.
        // ─────────────────────────────────────────

        var limitSetting = await _context.AppSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.Key == "DestinationViewLimitEnabled"
            );

        // За замовчуванням обмеження увімкнене.
        var limitEnabled =
            limitSetting == null ||
            !bool.TryParse(limitSetting.Value, out var limitValue) ||
            limitValue;

        var userId =
            User.FindFirst(
                System.Security.Claims.ClaimTypes.NameIdentifier
            )?.Value
            ?? User.FindFirst("sub")?.Value;

        // ─────────────────────────────────────────
        // 3. Перевіряємо 24 години тільки тоді,
        // коли обмеження увімкнене.
        // ─────────────────────────────────────────

        if (limitEnabled)
        {
            if (
                string.IsNullOrWhiteSpace(userId) &&
                string.IsNullOrWhiteSpace(visitorId)
            )
            {
                return BadRequest("Visitor ID відсутній.");
            }

            var since = DateTime.UtcNow.AddHours(-24);

            var alreadyViewed =
                !string.IsNullOrWhiteSpace(userId)
                    ? await _context.UserDestinationViews.AnyAsync(x =>
                        x.DestinationId == id &&
                        x.UserId == userId &&
                        x.ViewedAt >= since
                    )
                    : await _context.UserDestinationViews.AnyAsync(x =>
                        x.DestinationId == id &&
                        x.VisitorId == visitorId &&
                        x.ViewedAt >= since
                    );

            if (alreadyViewed)
            {
                return Ok(new
                {
                    destination.Id,
                    destination.ViewCount,
                    counted = false
                });
            }
        }

        // ─────────────────────────────────────────
        // 4. Збільшуємо лічильник.
        // ─────────────────────────────────────────

        destination.ViewCount++;

        // Історію переглядів зберігаємо незалежно
        // від того, чи увімкнене обмеження.
        _context.UserDestinationViews.Add(
            new UserDestinationView
            {
                UserId = userId,

                VisitorId =
                    string.IsNullOrWhiteSpace(userId)
                        ? visitorId
                        : null,

                DestinationId = destination.Id,
                ViewedAt = DateTime.UtcNow
            }
        );

        await _context.SaveChangesAsync();

        return Ok(new
        {
            destination.Id,
            destination.ViewCount,
            counted = true
        });
    }

}