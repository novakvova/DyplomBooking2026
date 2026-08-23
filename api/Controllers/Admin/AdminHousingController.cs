using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs.Admin;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/housing")]
    [Authorize(Roles = "Admin")]
    public class AdminHousingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminHousingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─────────────────────────────────────────────
        // GET: api/admin/housing
        // Список житла + пошук + фільтри + pagination.
        // ─────────────────────────────────────────────

        [HttpGet]
        public async Task<ActionResult<AdminHousingsResponseDto>> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? type,
            [FromQuery] bool? isAvailable,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20
        )
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var query = _context.Housings
                .AsNoTracking()
                .AsQueryable();

            // Пошук по назві, місту, власнику.
            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();

                query = query.Where(h =>
                    h.Title.ToLower().Contains(normalizedSearch) ||
                    h.City.ToLower().Contains(normalizedSearch) ||
                    (h.Owner != null &&
                     h.Owner.Email != null &&
                     h.Owner.Email.ToLower().Contains(normalizedSearch)) ||
                    (h.Owner != null &&
                     h.Owner.FullName != null &&
                     h.Owner.FullName.ToLower().Contains(normalizedSearch))
                );
            }

            // Фільтр доступності.
            if (isAvailable.HasValue)
            {
                query = query.Where(h =>
                    h.IsAvailable == isAvailable.Value
                );
            }

            // Фільтр типу.
            if (!string.IsNullOrWhiteSpace(type))
            {
                if (!Enum.TryParse<HousingType>(
                    type,
                    true,
                    out var housingType
                ))
                {
                    return BadRequest("Недопустимий тип житла.");
                }

                query = query.Where(h =>
                    h.Type == housingType
                );
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(h => h.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(h => new AdminHousingListDto
                {
                    Id = h.Id,
                    Title = h.Title,
                    City = h.City,
                    Type = h.Type.ToString(),

                    PricePerNight = h.PricePerNight,
                    IsAvailable = h.IsAvailable,
                    CreatedAt = h.CreatedAt,

                    OwnerId = h.OwnerId,

                    OwnerName = h.Owner != null
                        ? h.Owner.FullName ?? h.Owner.Email ?? "—"
                        : "—",

                    OwnerEmail = h.Owner != null
                        ? h.Owner.Email ?? ""
                        : "",

                    BookingsCount = h.Bookings.Count,

                    MainPhotoPath = h.Photos
                        .Where(p => p.IsMain)
                        .Select(p => p.FilePath)
                        .FirstOrDefault()
                        ?? h.Photos
                            .Select(p => p.FilePath)
                            .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(new AdminHousingsResponseDto
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
        // GET: api/admin/housing/{id}
        // Детальна інформація про житло.
        // ─────────────────────────────────────────────

        [HttpGet("{id:int}")]
        public async Task<ActionResult<AdminHousingDetailsDto>> GetById(int id)
        {
            var housing = await _context.Housings
                .AsNoTracking()
                .Where(h => h.Id == id)
                .Select(h => new AdminHousingDetailsDto
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
                    CreatedAt = h.CreatedAt,

                    OwnerId = h.OwnerId,

                    OwnerName = h.Owner != null
                        ? h.Owner.FullName ?? h.Owner.Email ?? "—"
                        : "—",

                    OwnerEmail = h.Owner != null
                        ? h.Owner.Email ?? ""
                        : "",

                    BookingsCount = h.Bookings.Count,

                    Photos = h.Photos
                        .OrderByDescending(p => p.IsMain)
                        .Select(p => new AdminHousingPhotoDto
                        {
                            Id = p.Id,
                            FilePath = p.FilePath,
                            IsMain = p.IsMain
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (housing == null)
                return NotFound("Житло не знайдено.");

            return Ok(housing);
        }


        // ─────────────────────────────────────────────
        // PATCH: api/admin/housing/{id}/availability
        // Активувати / деактивувати оголошення.
        // ─────────────────────────────────────────────

        [HttpPatch("{id:int}/availability")]
        public async Task<IActionResult> SetAvailability(
            int id,
            [FromBody] UpdateHousingAvailabilityDto dto
        )
        {
            var housing = await _context.Housings.FindAsync(id);

            if (housing == null)
                return NotFound("Житло не знайдено.");

            housing.IsAvailable = dto.IsAvailable;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ─────────────────────────────────────────────
        // DELETE: api/admin/housing/{id}
        // Видалення оголошення.
        // ─────────────────────────────────────────────

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var housing = await _context.Housings
                .Include(h => h.Bookings)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (housing == null)
                return NotFound("Житло не знайдено.");

            // Не видаляємо житло, якщо з ним уже є бронювання.
            if (housing.Bookings.Count > 0)
            {
                return BadRequest(
                    "Неможливо видалити житло, оскільки воно має бронювання. " +
                    "Ви можете деактивувати оголошення."
                );
            }

            _context.Housings.Remove(housing);

            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}