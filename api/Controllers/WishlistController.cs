using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.DTOs.Wishlist;
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

    // ID поточного користувача з JWT.
    private string? CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

    // Перевіряємо авторизацію та повертаємо UserId.
    private bool TryGetUserId(out string userId)
    {
        userId = CurrentUserId ?? string.Empty;
        return !string.IsNullOrWhiteSpace(userId);
    }

    // GET: api/wishlist
    // Усі унікальні збережені житла користувача.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HousingDto>>> GetWishlist()
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var wishlist = await _context.WishlistItems
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .GroupBy(x => x.HousingId)
            .Select(g => g.First().Housing)
            .Select(h => new HousingDto
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
                OwnerName = h.Owner != null
                    ? h.Owner.FullName ?? h.Owner.Email ?? "—"
                    : "—",
                CreatedAt = h.CreatedAt,
                MainPhotoPath = h.Photos
                    .Where(p => p.IsMain)
                    .Select(p => p.FilePath)
                    .FirstOrDefault()
                    ?? h.Photos.Select(p => p.FilePath).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(wishlist);
    }

    // POST: api/wishlist/add
    // Додаємо житло в одну або декілька існуючих папок.
    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddWishlistDto dto)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        if (!await _context.Housings.AnyAsync(x => x.Id == dto.HousingId))
            return NotFound("Житло не знайдено.");

        // Папки обов'язково передаються з frontend.
        // Це не створює автоматично "Мої бажання".
        var folderIds = dto.FolderIds.Distinct().ToArray();

        if (folderIds.Length == 0)
            return BadRequest("Оберіть хоча б один список.");

        var validFolderIds = await _context.WishlistFolders
            .Where(x => x.UserId == userId && folderIds.Contains(x.Id))
            .Select(x => x.Id)
            .ToListAsync();

        if (validFolderIds.Count == 0)
            return BadRequest("Не знайдено жодного доступного списку.");

        var existingFolderIds = await _context.WishlistItems
            .Where(x =>
                x.UserId == userId &&
                x.HousingId == dto.HousingId &&
                validFolderIds.Contains(x.FolderId))
            .Select(x => x.FolderId)
            .ToListAsync();

        foreach (var folderId in validFolderIds.Except(existingFolderIds))
        {
            _context.WishlistItems.Add(new WishlistItem
            {
                UserId = userId,
                HousingId = dto.HousingId,
                FolderId = folderId,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/wishlist/{housingId}
    // Повністю прибрати житло з wishlist користувача.
    [HttpDelete("{housingId:int}")]
    public async Task<IActionResult> Remove(int housingId)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var items = await _context.WishlistItems
            .Where(x => x.UserId == userId && x.HousingId == housingId)
            .ToListAsync();

        if (items.Count > 0)
        {
            _context.WishlistItems.RemoveRange(items);
            await _context.SaveChangesAsync();
        }

        return NoContent();
    }

    // GET: api/wishlist/{housingId}/check
    // Перевірка, чи є житло хоча б в одному списку.
    [HttpGet("{housingId:int}/check")]
    public async Task<IActionResult> Check(int housingId)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var exists = await _context.WishlistItems.AnyAsync(x =>
            x.UserId == userId && x.HousingId == housingId);

        return Ok(new { isFavorite = exists });
    }
}
