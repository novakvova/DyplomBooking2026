using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers
{
    [ApiController]
    [Route("api/rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/rooms — доступно всім (для перегляду перед бронюванням)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAll()
        {
            var rooms = await _context.Rooms
                .Where(r => r.IsActive)
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description,
                    Capacity = r.Capacity,
                    PricePerHour = r.PricePerHour,
                    Location = r.Location,
                    IsActive = r.IsActive
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // GET /api/rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetById(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            return Ok(new RoomDto
            {
                Id = room.Id,
                Name = room.Name,
                Description = room.Description,
                Capacity = room.Capacity,
                PricePerHour = room.PricePerHour,
                Location = room.Location,
                IsActive = room.IsActive
            });
        }

        // POST /api/rooms — лише Admin/Manager
        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<RoomDto>> Create(CreateRoomDto dto)
        {
            var room = new Room
            {
                Name = dto.Name,
                Description = dto.Description,
                Capacity = dto.Capacity,
                PricePerHour = dto.PricePerHour,
                Location = dto.Location
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = room.Id }, room);
        }

        // DELETE /api/rooms/5 — лише Admin
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.IsActive = false; // м'яке видалення
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
