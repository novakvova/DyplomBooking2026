using DyplomBooking2026.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WayGo.Api.DTO;


namespace WayGo.Api.Controllers;


[ApiController]
[Route("api/cars")]
public class CarsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CarsController(
        ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll(
    [FromQuery] string? search,
    [FromQuery] decimal? minPrice,
    [FromQuery] decimal? maxPrice,
    [FromQuery] string[]? brands,
    [FromQuery] string[]? transmissions,
    [FromQuery] string[]? fuelTypes,
    [FromQuery] int[]? seats,
    [FromQuery] string? sort,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 12)
    {
        var query = _context.Cars
            .Where(x => x.Available)
            .AsQueryable();


        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();

            query = query.Where(x =>
                x.Brand.ToLower().Contains(search) ||
                x.Model.ToLower().Contains(search) ||
                x.City.ToLower().Contains(search));
        }


        if (minPrice.HasValue)
            query = query.Where(x =>
                x.PricePerDay >= minPrice);


        if (maxPrice.HasValue)
            query = query.Where(x =>
                x.PricePerDay <= maxPrice);


        if (brands?.Length > 0)
            query = query.Where(x =>
                brands.Contains(x.Brand));


        if (transmissions?.Length > 0)
            query = query.Where(x =>
                transmissions.Contains(x.Transmission));


        if (fuelTypes?.Length > 0)
            query = query.Where(x =>
                fuelTypes.Contains(x.FuelType));


        if (seats?.Length > 0)
            query = query.Where(x =>
                seats.Contains(x.Seats));


        query = sort switch
        {
            "priceAsc" =>
                query.OrderBy(x => x.PricePerDay),

            "priceDesc" =>
                query.OrderByDescending(x => x.PricePerDay),

            "rating" =>
                query.OrderByDescending(x => x.Rating),

            _ =>
                query.OrderByDescending(x => x.Rating)
        };


        var totalItems =
            await query.CountAsync();


        var items =
            await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new CarDto
            {
                Id = x.Id,
                Brand = x.Brand,
                Model = x.Model,
                City = x.City,
                ImagePath = x.ImagePath,
                PricePerDay = x.PricePerDay,
                Transmission = x.Transmission,
                FuelType = x.FuelType,
                Seats = x.Seats,
                Rating = x.Rating
            })
            .ToListAsync();


        var prices =
            await _context.Cars
            .Where(x => x.Available)
            .Select(x => x.PricePerDay)
            .ToListAsync();


        var maxPriceValue =
            prices.Count > 0
                ? prices.Max()
                : 1000;


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
                histogram = new int[18]
            }
        });
    }


    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var result = new
        {
            brands = await _context.Cars
                .Where(x => x.Available)
                .Select(x => x.Brand)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync(),

            transmissions = await _context.Cars
                .Where(x => x.Available)
                .Select(x => x.Transmission)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync(),

            fuelTypes = await _context.Cars
                .Where(x => x.Available)
                .Select(x => x.FuelType)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync(),

            seats = await _context.Cars
                .Where(x => x.Available)
                .Select(x => x.Seats)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync()
        };

        return Ok(result);
    }
}