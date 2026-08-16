using DyplomBooking2026.Data;
using DyplomBooking2026.Models;
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
}