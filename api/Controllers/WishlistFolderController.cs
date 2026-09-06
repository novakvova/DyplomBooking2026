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
public class WishlistFolderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WishlistFolderController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ID поточного користувача з JWT.
    private string? CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        User.FindFirstValue("sub");

    // Перевірка авторизації та отримання ID користувача.
    private bool TryGetUserId(out string userId)
    {
        userId = CurrentUserId ?? string.Empty;
        return !string.IsNullOrWhiteSpace(userId);
    }

    // GET: api/wishlistfolder
    // Отримати всі списки бажань поточного користувача.
    [HttpGet]
    public async Task<IActionResult> GetFolders()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var folders = await _context.WishlistFolders
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Name,

                Count = x.Items.Count,

                PreviewImages = x.Items
                    .OrderByDescending(i => i.CreatedAt)
                    .Take(4)
                    .Select(i =>
                        i.Housing.Photos
                            .Where(p => p.IsMain)
                            .Select(p => p.FilePath)
                            .FirstOrDefault()
                        ?? i.Housing.Photos
                            .Select(p => p.FilePath)
                            .FirstOrDefault()
                    )
                    .ToList()
            })
            .ToListAsync();

        return Ok(folders);
    }

    // GET: api/wishlistfolder/{id}
    // Отримати конкретний список разом із житлом та рейтингами.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetFolder(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        // Перевіряємо, що папка належить поточному користувачу,
        // та отримуємо житло з папки.
        var folder = await _context.WishlistFolders
            .AsNoTracking()
            .Where(x =>
                x.Id == id &&
                x.UserId == userId)
            .Select(x => new
            {
                x.Id,
                x.Name,

                Items = x.Items
                    .OrderByDescending(i => i.CreatedAt)
                    .Select(i => new HousingDto
                    {
                        Id = i.Housing.Id,

                        Title = i.Housing.Title,
                        Description = i.Housing.Description,

                        Type = i.Housing.Type.ToString(),

                        Address = i.Housing.Address,
                        City = i.Housing.City,

                        Rooms = i.Housing.Rooms,
                        MaxGuests = i.Housing.MaxGuests,

                        PricePerNight = i.Housing.PricePerNight,
                        PricePerHour = i.Housing.PricePerHour,

                        IsAvailable = i.Housing.IsAvailable,
                        CreatedAt = i.Housing.CreatedAt,

                        OwnerName = i.Housing.Owner != null
                            ? i.Housing.Owner.FullName ??
                              i.Housing.Owner.Email ??
                              "—"
                            : "—",

                        MainPhotoPath = i.Housing.Photos
                            .Where(p => p.IsMain)
                            .Select(p => p.FilePath)
                            .FirstOrDefault()
                        ?? i.Housing.Photos
                            .Select(p => p.FilePath)
                            .FirstOrDefault(),

                        // Рейтинг буде отриманий окремим запитом нижче.
                        AverageRating = 0,
                        ReviewCount = 0
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (folder == null)
            return NotFound("Папку не знайдено.");

        // ID житла, яке знаходиться в папці.
        var housingIds = folder.Items
            .Select(x => x.Id)
            .ToList();

        // Якщо папка порожня — повертаємо її одразу.
        if (housingIds.Count == 0)
        {
            return Ok(new
            {
                folder.Id,
                folder.Name,
                folder.Items
            });
        }

        // Отримуємо середній рейтинг та кількість відгуків.
        // Використовуємо _context.Reviews, тому Housing.Reviews
        // у моделі Housing не потрібен.
        var reviewStats = await _context.Reviews
            .AsNoTracking()
            .Where(r =>
                housingIds.Contains(r.HousingId) &&
                r.IsVisible)
            .GroupBy(r => r.HousingId)
            .Select(group => new
            {
                HousingId = group.Key,

                AverageRating = group.Average(
                    r => (double)r.Rating
                ),

                ReviewCount = group.Count()
            })
            .ToDictionaryAsync(
                x => x.HousingId
            );

        // Заповнюємо рейтинг кожного житла.
        foreach (var housing in folder.Items)
        {
            if (reviewStats.TryGetValue(
                    housing.Id,
                    out var stats))
            {
                housing.AverageRating = stats.AverageRating;
                housing.ReviewCount = stats.ReviewCount;
            }
        }

        return Ok(new
        {
            folder.Id,
            folder.Name,
            folder.Items
        });
    }

    // DELETE: api/wishlistfolder/{folderId}/items/{housingId}
    // Видалити помешкання тільки з конкретного списку.
    [HttpDelete("{folderId:int}/items/{housingId:int}")]
    public async Task<IActionResult> RemoveItem(
        int folderId,
        int housingId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var item = await _context.WishlistItems
            .FirstOrDefaultAsync(x =>
                x.FolderId == folderId &&
                x.HousingId == housingId &&
                x.UserId == userId);

        if (item == null)
        {
            return NotFound(
                "Помешкання не знайдено в цьому списку."
            );
        }

        _context.WishlistItems.Remove(item);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/wishlistfolder
    // Створити новий список бажань.
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] WishlistFolderDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var name = dto.Name?.Trim();

        if (string.IsNullOrWhiteSpace(name))
            return BadRequest("Назва не може бути пустою.");

        var folder = new WishlistFolder
        {
            UserId = userId,
            Name = name,
            CreatedAt = DateTime.UtcNow
        };

        _context.WishlistFolders.Add(folder);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            folder.Id,
            folder.Name,
            Count = 0,
            PreviewImages = Array.Empty<string>()
        });
    }

    // PUT: api/wishlistfolder/{id}
    // Перейменувати список бажань.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Rename(
        int id,
        [FromBody] WishlistFolderDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var name = dto.Name?.Trim();

        if (string.IsNullOrWhiteSpace(name))
            return BadRequest("Назва не може бути пустою.");

        var folder = await _context.WishlistFolders
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.UserId == userId);

        if (folder == null)
            return NotFound("Папку не знайдено.");

        folder.Name = name;

        await _context.SaveChangesAsync();

        return Ok(folder);
    }

    // DELETE: api/wishlistfolder/{id}
    // Видалити список бажань.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var folder = await _context.WishlistFolders
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.UserId == userId);

        if (folder == null)
            return NotFound("Папку не знайдено.");

        _context.WishlistFolders.Remove(folder);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTO для створення та перейменування списку.
public class WishlistFolderDto
{
    public string Name { get; set; } = "";
}