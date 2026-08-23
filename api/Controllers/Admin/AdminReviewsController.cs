using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers.Admin;

[ApiController]
[Route("api/admin/reviews")]
[Authorize(Roles = "Admin")]
public class AdminReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminReviewsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/reviews
    // Список + пошук + фільтри + pagination.
    // ─────────────────────────────────────────────

    [HttpGet]
    public async Task<ActionResult<AdminReviewsResponseDto>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int? rating,
        [FromQuery] bool? isVisible,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Reviews
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalized = search.Trim().ToLower();

            query = query.Where(r =>
                r.Comment.ToLower().Contains(normalized) ||
                r.Housing.Title.ToLower().Contains(normalized) ||
                (r.User.Email != null &&
                 r.User.Email.ToLower().Contains(normalized)) ||
                (r.User.FullName != null &&
                 r.User.FullName.ToLower().Contains(normalized))
            );
        }

        if (rating.HasValue)
            query = query.Where(r => r.Rating == rating.Value);

        if (isVisible.HasValue)
            query = query.Where(r => r.IsVisible == isVisible.Value);

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new AdminReviewDto
            {
                Id = r.Id,

                UserId = r.UserId,
                UserName = r.User.FullName ?? r.User.Email ?? "—",
                UserEmail = r.User.Email ?? "",

                HousingId = r.HousingId,
                HousingTitle = r.Housing.Title,

                Rating = r.Rating,
                Comment = r.Comment,

                IsVisible = r.IsVisible,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(new AdminReviewsResponseDto
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
    // PATCH: api/admin/reviews/{id}/visibility
    // Приховати / показати.
    // ─────────────────────────────────────────────

    [HttpPatch("{id:int}/visibility")]
    public async Task<IActionResult> SetVisibility(
        int id,
        [FromBody] bool isVisible
    )
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return NotFound("Відгук не знайдено.");

        review.IsVisible = isVisible;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // DELETE: api/admin/reviews/{id}
    // ─────────────────────────────────────────────

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return NotFound("Відгук не знайдено.");

        _context.Reviews.Remove(review);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}