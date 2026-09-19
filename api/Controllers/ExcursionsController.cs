using DyplomBooking2026.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WayGo.Api.DTO;


namespace WayGo.Api.Controllers;

[ApiController]
[Route("api/excursions")]
public class ExcursionsController : ControllerBase
{

    private readonly ApplicationDbContext _context;


    public ExcursionsController(
        ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll(
    [FromQuery] string? search,
    [FromQuery] decimal? minPrice,
    [FromQuery] decimal? maxPrice,
    [FromQuery] string[]? categories,
    [FromQuery] string[]? durations,
    [FromQuery] string? sort,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
    {
        var query =
            _context.Excursions
            .AsQueryable();


        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();

            query = query.Where(x =>
                x.Title.ToLower().Contains(search) ||
                x.City.ToLower().Contains(search));
        }


        if (minPrice.HasValue)
            query = query.Where(x =>
                x.Price >= minPrice);


        if (maxPrice.HasValue)
            query = query.Where(x =>
                x.Price <= maxPrice);


        if (categories?.Length > 0)
            query = query.Where(x =>
                categories.Contains(x.Category));


        if (durations?.Length > 0)
            query = query.Where(x =>
                durations.Contains(x.Duration));


        query = sort switch
        {
            "priceAsc" =>
                query.OrderBy(x => x.Price),

            "priceDesc" =>
                query.OrderByDescending(x => x.Price),

            "rating" =>
                query.OrderByDescending(x => x.Rating),

            _ =>
                query.OrderByDescending(x => x.Rating)
        };


        var totalItems =
            await query.CountAsync();

        var prices =
           await query
           .Select(x => x.Price)
           .ToListAsync();


        var maxPriceValue =
            prices.Count > 0
                ? prices.Max()
                : 1000;


        var histogram = new int[18];

        foreach (var price in prices)
        {
            var index = (int)(
                price /
                maxPriceValue *
                histogram.Length
            );

            if (index >= histogram.Length)
                index = histogram.Length - 1;

            histogram[index]++;
        }

        var items =
            await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ExcursionDto
            {
                Id = x.Id,
                Title = x.Title,
                City = x.City,
                ImagePath = x.ImagePath,
                Price = x.Price,
                Category = x.Category,
                Duration = x.Duration,
                Rating = x.Rating,
                Description = x.Description
            })
            .ToListAsync();


        return Ok(new
        {
            items,
            totalItems,
            totalPages = Math.Ceiling(
                (double)totalItems / pageSize
            ),
            priceRange = new
            {
                max = maxPriceValue,
                step = 50,
                histogram
            }
        });
    }


    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var result = new
        {
            categories = await _context.Excursions
                .Select(x => x.Category)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync(),

            durations = await _context.Excursions
                .Select(x => x.Duration)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync()
        };

        return Ok(result);
    }
}