using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs.Admin;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers.Admin;

[ApiController]
[Route("api/admin/destinations")]
[Authorize(Roles = "Admin")]
public class AdminDestinationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminDestinationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/destinations
    // Список + пошук + фільтр popular + pagination.
    // ─────────────────────────────────────────────

    [HttpGet]
    public async Task<ActionResult<AdminDestinationsResponseDto>> GetAll(
        [FromQuery] string? search,
        [FromQuery] bool? isPopular,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Destinations
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalized = search.Trim().ToLower();

            query = query.Where(x =>
                x.City.ToLower().Contains(normalized) ||
                x.Country.ToLower().Contains(normalized) ||
                x.Slug.ToLower().Contains(normalized)
            );
        }

        if (isPopular.HasValue)
            query = query.Where(x => x.IsPopular == isPopular.Value);

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.IsPopular)
            .ThenByDescending(x => x.ViewCount)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AdminDestinationDto
            {
                Id = x.Id,
                Slug = x.Slug,
                CountryCode = x.CountryCode,
                City = x.City,
                Country = x.Country,
                ImagePath = x.ImagePath,
                Description = x.Description,
                ViewCount = x.ViewCount,
                IsPopular = x.IsPopular
            })
            .ToListAsync();

        return Ok(new AdminDestinationsResponseDto
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
    // GET: api/admin/destinations/{id}
    // ─────────────────────────────────────────────

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminDestinationDto>> GetById(int id)
    {
        var destination = await _context.Destinations
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AdminDestinationDto
            {
                Id = x.Id,
                Slug = x.Slug,
                CountryCode = x.CountryCode,
                City = x.City,
                Country = x.Country,
                ImagePath = x.ImagePath,
                Description = x.Description,
                ViewCount = x.ViewCount,
                IsPopular = x.IsPopular
            })
            .FirstOrDefaultAsync();

        if (destination == null)
            return NotFound("Напрямок не знайдено.");

        return Ok(destination);
    }

    // ─────────────────────────────────────────────
    // POST: api/admin/destinations
    // Створення напрямку.
    // ─────────────────────────────────────────────

    [HttpPost]
    public async Task<ActionResult<AdminDestinationDto>> Create(
        [FromBody] AdminDestinationRequestDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.City))
            return BadRequest("Місто не вказано.");

        if (string.IsNullOrWhiteSpace(dto.Country))
            return BadRequest("Країну не вказано.");

        if (string.IsNullOrWhiteSpace(dto.Slug))
            return BadRequest("Slug не вказано.");

        var slug = dto.Slug.Trim().ToLower();

        var slugExists = await _context.Destinations
            .AnyAsync(x => x.Slug == slug);

        if (slugExists)
            return BadRequest("Напрямок з таким slug вже існує.");

        var destination = new Destination
        {
            Slug = slug,
            CountryCode = dto.CountryCode.Trim().ToUpper(),
            City = dto.City.Trim(),
            Country = dto.Country.Trim(),
            ImagePath = dto.ImagePath.Trim(),
            Description = dto.Description.Trim(),
            IsPopular = dto.IsPopular,
            ViewCount = 0
        };

        _context.Destinations.Add(destination);
        await _context.SaveChangesAsync();

        return Ok(new AdminDestinationDto
        {
            Id = destination.Id,
            Slug = destination.Slug,
            CountryCode = destination.CountryCode,
            City = destination.City,
            Country = destination.Country,
            ImagePath = destination.ImagePath,
            Description = destination.Description,
            ViewCount = destination.ViewCount,
            IsPopular = destination.IsPopular
        });
    }

    // ─────────────────────────────────────────────
    // PUT: api/admin/destinations/{id}
    // Редагування напрямку.
    // ─────────────────────────────────────────────

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] AdminDestinationRequestDto dto
    )
    {
        var destination = await _context.Destinations
            .FirstOrDefaultAsync(x => x.Id == id);

        if (destination == null)
            return NotFound("Напрямок не знайдено.");

        if (string.IsNullOrWhiteSpace(dto.City))
            return BadRequest("Місто не вказано.");

        if (string.IsNullOrWhiteSpace(dto.Country))
            return BadRequest("Країну не вказано.");

        if (string.IsNullOrWhiteSpace(dto.Slug))
            return BadRequest("Slug не вказано.");

        var slug = dto.Slug.Trim().ToLower();

        var slugExists = await _context.Destinations
            .AnyAsync(x =>
                x.Id != id &&
                x.Slug == slug
            );

        if (slugExists)
            return BadRequest("Напрямок з таким slug вже існує.");

        destination.Slug = slug;
        destination.CountryCode = dto.CountryCode.Trim().ToUpper();
        destination.City = dto.City.Trim();
        destination.Country = dto.Country.Trim();
        destination.ImagePath = dto.ImagePath.Trim();
        destination.Description = dto.Description.Trim();
        destination.IsPopular = dto.IsPopular;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // PATCH: api/admin/destinations/{id}/popular
    // Додати / прибрати з популярних.
    // ─────────────────────────────────────────────

    [HttpPatch("{id:int}/popular")]
    public async Task<IActionResult> SetPopular(
        int id,
        [FromBody] bool isPopular
    )
    {
        var destination = await _context.Destinations
            .FirstOrDefaultAsync(x => x.Id == id);

        if (destination == null)
            return NotFound("Напрямок не знайдено.");

        destination.IsPopular = isPopular;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // DELETE: api/admin/destinations/{id}
    // ─────────────────────────────────────────────

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var destination = await _context.Destinations
            .Include(x => x.UserViews)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (destination == null)
            return NotFound("Напрямок не знайдено.");

        _context.Destinations.Remove(destination);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/destinations/tracking
    // Поточний стан підрахунку переглядів.
    // ─────────────────────────────────────────────

    [HttpGet("tracking")]
    public async Task<IActionResult> GetTracking()
    {
        var setting = await _context.AppSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.Key == "DestinationViewTrackingEnabled"
            );

        var enabled =
            setting == null ||
            !bool.TryParse(setting.Value, out var parsed)
            || parsed;

        return Ok(new { enabled });
    }


    // ─────────────────────────────────────────────
    // PATCH: api/admin/destinations/tracking
    // Увімкнути / вимкнути підрахунок переглядів.
    // ─────────────────────────────────────────────

    [HttpPatch("tracking")]
    public async Task<IActionResult> SetTracking(
        [FromBody] UpdateDestinationTrackingDto dto
    )
    {
        const string key = "DestinationViewTrackingEnabled";

        var setting = await _context.AppSettings
            .FirstOrDefaultAsync(x => x.Key == key);

        if (setting == null)
        {
            setting = new AppSetting
            {
                Key = key,
                Value = dto.Enabled.ToString()
            };

            _context.AppSettings.Add(setting);
        }
        else
        {
            setting.Value = dto.Enabled.ToString();
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/destinations/view-limit
    // Стан обмеження 1 перегляд / 24 години.
    // ─────────────────────────────────────────────

    [HttpGet("view-limit")]
    public async Task<IActionResult> GetViewLimit()
    {
        const string key = "DestinationViewLimitEnabled";

        var setting = await _context.AppSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Key == key);

        // За замовчуванням обмеження увімкнене.
        var enabled =
            setting == null ||
            !bool.TryParse(setting.Value, out var parsed) ||
            parsed;

        return Ok(new { enabled });
    }

    // ─────────────────────────────────────────────
    // PATCH: api/admin/destinations/view-limit
    // Увімкнути / вимкнути обмеження.
    // ─────────────────────────────────────────────

    [HttpPatch("view-limit")]
    public async Task<IActionResult> SetViewLimit(
        [FromBody] UpdateDestinationTrackingDto dto
    )
    {
        const string key = "DestinationViewLimitEnabled";

        var setting = await _context.AppSettings
            .FirstOrDefaultAsync(x => x.Key == key);

        if (setting == null)
        {
            setting = new AppSetting
            {
                Key = key,
                Value = dto.Enabled.ToString()
            };

            _context.AppSettings.Add(setting);
        }
        else
        {
            setting.Value = dto.Enabled.ToString();
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // POST: api/admin/destinations/upload-image
    // Завантаження зображення напрямку.
    // ─────────────────────────────────────────────

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(
        IFormFile file,
        [FromForm] string? slug
    )
    {
        if (file == null || file.Length == 0)
            return BadRequest("Файл не вибрано.");

        var allowedExtensions = new[]
        {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

        var extension = Path
            .GetExtension(file.FileName)
            .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(
                "Дозволені формати: JPG, JPEG, PNG, WEBP."
            );
        }

        const long maxFileSize = 5 * 1024 * 1024;

        if (file.Length > maxFileSize)
            return BadRequest("Максимальний розмір файлу — 5 MB.");

        // Папка backend/wwwroot/images/cities.
        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "images",
            "cities"
        );

        Directory.CreateDirectory(uploadsFolder);

        // Безпечний slug для назви файла.
        var safeSlug = string.IsNullOrWhiteSpace(slug)
            ? "destination"
            : new string(
                slug
                    .Trim()
                    .ToLowerInvariant()
                    .Where(c =>
                        char.IsLetterOrDigit(c) ||
                        c == '-'
                    )
                    .ToArray()
            );

        if (string.IsNullOrWhiteSpace(safeSlug))
            safeSlug = "destination";

        var shortId = Guid.NewGuid()
            .ToString("N")[..8];

        var fileName =
            $"{safeSlug}-{shortId}{extension}";

        var fullPath = Path.Combine(
            uploadsFolder,
            fileName
        );

        await using var stream = new FileStream(
            fullPath,
            FileMode.Create
        );

        await file.CopyToAsync(stream);

        // Саме цей шлях зберігаємо в БД.
        var imagePath = $"/images/cities/{fileName}";

        return Ok(new
        {
            imagePath
        });
    }






}