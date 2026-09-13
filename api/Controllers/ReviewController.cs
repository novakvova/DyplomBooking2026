using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Review/housing/5
    [HttpGet("housing/{housingId:int}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetHousingReviews(
        int housingId,
        CancellationToken cancellationToken = default)
    {
        var reviews = await _context.Reviews
            .AsNoTracking()
            .Where(r => r.HousingId == housingId && r.IsVisible)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User.FullName ?? "Користувач",
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(reviews);
    }

    // POST: api/Review
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview(
        [FromBody] CreateReviewDto dto,
        CancellationToken cancellationToken = default)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Оцінка має бути від 1 до 5.");

        if (string.IsNullOrWhiteSpace(dto.Comment))
            return BadRequest("Коментар не може бути порожнім.");

        var housingExists = await _context.Housings
            .AnyAsync(h => h.Id == dto.HousingId, cancellationToken);

        if (!housingExists)
            return NotFound("Житло не знайдено.");

        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var review = new Review
        {
            UserId = userId,
            HousingId = dto.HousingId,
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
            IsVisible = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync(cancellationToken);

        await _context.Entry(review)
            .Reference(r => r.User)
            .LoadAsync(cancellationToken);

        var result = new ReviewDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = review.User.FullName ?? "Користувач",
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };

        return Ok(result);
    }
}

public class ReviewDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    public int HousingId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
}