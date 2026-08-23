using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WishlistController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ──────────────────────────────────────────
    // CURRENT USER
    // Беремо UserId з JWT.
    // NameIdentifier — основний claim,
    // sub — fallback для OAuth/JWT provider.
    // ──────────────────────────────────────────

    private string? CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub");

    // Перевіряємо, що користувач із JWT
    // реально існує в поточній базі даних.
    // Це захищає від старих JWT після reset/drop БД.
    private async Task<bool> CurrentUserExistsAsync(string userId)
    {
        return await _context.Users
            .AsNoTracking()
            .AnyAsync(x => x.Id == userId);
    }

    // ──────────────────────────────────────────
    // GET: api/wishlist
    // Список бажань поточного користувача
    // ──────────────────────────────────────────

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HousingDto>>> GetWishlist()
    {
        var userId = CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        if (!await CurrentUserExistsAsync(userId))
            return Unauthorized();

        var wishlist = await _context.WishlistItems
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new HousingDto
            {
                Id = x.Housing.Id,
                Title = x.Housing.Title,
                Description = x.Housing.Description,
                Type = x.Housing.Type.ToString(),
                Address = x.Housing.Address,
                City = x.Housing.City,
                Rooms = x.Housing.Rooms,
                MaxGuests = x.Housing.MaxGuests,
                PricePerNight = x.Housing.PricePerNight,
                IsAvailable = x.Housing.IsAvailable,

                OwnerName = x.Housing.Owner != null
                    ? x.Housing.Owner.FullName
                        ?? x.Housing.Owner.Email
                        ?? "—"
                    : "—",

                CreatedAt = x.Housing.CreatedAt,

                // Спочатку головне фото,
                // якщо його немає — перше доступне.
                MainPhotoPath = x.Housing.Photos
                    .Where(p => p.IsMain)
                    .Select(p => p.FilePath)
                    .FirstOrDefault()
                    ?? x.Housing.Photos
                        .Select(p => p.FilePath)
                        .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(wishlist);
    }

    // ──────────────────────────────────────────
    // POST: api/wishlist/5
    // Додати житло до списку бажань
    // ──────────────────────────────────────────

    [HttpPost("{housingId:int}")]
    public async Task<IActionResult> Add(int housingId)
    {
        var userId = CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        // Захист від старого JWT.
        if (!await CurrentUserExistsAsync(userId))
            return Unauthorized();

        var housingExists = await _context.Housings
            .AsNoTracking()
            .AnyAsync(x => x.Id == housingId);

        if (!housingExists)
            return NotFound("Житло не знайдено.");

        // POST робимо ідемпотентним:
        // якщо житло вже є — нічого не змінюємо.
        var alreadyExists = await _context.WishlistItems
            .AsNoTracking()
            .AnyAsync(x =>
                x.UserId == userId &&
                x.HousingId == housingId
            );

        if (alreadyExists)
            return NoContent();

        var item = new WishlistItem
        {
            UserId = userId,
            HousingId = housingId,
            CreatedAt = DateTime.UtcNow
        };

        _context.WishlistItems.Add(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ──────────────────────────────────────────
    // DELETE: api/wishlist/5
    // Видалити житло зі списку бажань
    // ──────────────────────────────────────────

    [HttpDelete("{housingId:int}")]
    public async Task<IActionResult> Remove(int housingId)
    {
        var userId = CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        if (!await CurrentUserExistsAsync(userId))
            return Unauthorized();

        var item = await _context.WishlistItems
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.HousingId == housingId
            );

        // DELETE теж робимо ідемпотентним:
        // якщо запису вже немає — результат все одно успішний.
        if (item == null)
            return NoContent();

        _context.WishlistItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ──────────────────────────────────────────
    // GET: api/wishlist/5/check
    // Чи знаходиться житло у wishlist
    // ──────────────────────────────────────────

    [HttpGet("{housingId:int}/check")]
    public async Task<IActionResult> Check(int housingId)
    {
        var userId = CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        if (!await CurrentUserExistsAsync(userId))
            return Unauthorized();

        var isFavorite = await _context.WishlistItems
            .AsNoTracking()
            .AnyAsync(x =>
                x.UserId == userId &&
                x.HousingId == housingId
            );

        return Ok(new { isFavorite });
    }
}