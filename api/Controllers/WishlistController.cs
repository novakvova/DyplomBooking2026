using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers
{
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


        // ──────────────────────────────────────────
        // Поточний авторизований користувач
        // ──────────────────────────────────────────

        private string? CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");


        // ──────────────────────────────────────────
        // GET: api/wishlist
        // Отримати список бажань поточного користувача
        // ──────────────────────────────────────────

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HousingDto>>> GetWishlist()
        {
            var userId = CurrentUserId;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }


            var wishlist = await _context.WishlistItems
                .Where(x => x.UserId == userId)

                // Нові додані оголошення показуємо першими
                .OrderByDescending(x => x.CreatedAt)

                // Повертаємо HousingDto,
                // а не Housing entity напряму
                .Select(x => new HousingDto
                {
                    Id = x.Housing.Id,

                    Title = x.Housing.Title,

                    Description = x.Housing.Description,

                    Type = x.Housing.Type.ToString(),

                    Address = x.Housing.Address,

                    City = x.Housing.City,

                    Rooms = x.Housing.Rooms,

                    MaxGuests = x.Housing.MaxGuests,

                    PricePerNight = x.Housing.PricePerNight,

                    IsAvailable = x.Housing.IsAvailable,

                    OwnerName =
                        x.Housing.Owner != null
                            ? (
                                x.Housing.Owner.FullName
                                ?? x.Housing.Owner.Email
                                ?? "—"
                              )
                            : "—",

                    CreatedAt = x.Housing.CreatedAt,


                    // Спочатку шукаємо головне фото.
                    // Якщо головного немає — беремо перше доступне.
                    MainPhotoPath =
                        x.Housing.Photos
                            .Where(p => p.IsMain)
                            .Select(p => p.FilePath)
                            .FirstOrDefault()

                        ?? x.Housing.Photos
                            .Select(p => p.FilePath)
                            .FirstOrDefault()
                })
                .ToListAsync();


            return Ok(wishlist);
        }


        // ──────────────────────────────────────────
        // POST: api/wishlist/5
        // Додати житло у список бажань
        // ──────────────────────────────────────────

        [HttpPost("{housingId:int}")]
        public async Task<IActionResult> Add(int housingId)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }


            // Перевіряємо, чи існує таке житло
            var housingExists = await _context.Housings
                .AnyAsync(x => x.Id == housingId);

            if (!housingExists)
            {
                return NotFound("Житло не знайдено.");
            }


            // Перевіряємо, чи користувач уже додав це житло
            var alreadyExists = await _context.WishlistItems
                .AnyAsync(x =>
                    x.UserId == userId &&
                    x.HousingId == housingId
                );


            // Якщо вже є у wishlist —
            // просто повертаємо 200 OK
            if (alreadyExists)
            {
                return Ok();
            }


            var item = new WishlistItem
            {
                UserId = userId,
                HousingId = housingId,
                CreatedAt = DateTime.UtcNow
            };


            _context.WishlistItems.Add(item);

            await _context.SaveChangesAsync();


            return Ok();
        }


        // ──────────────────────────────────────────
        // DELETE: api/wishlist/5
        // Видалити житло зі списку бажань
        // ──────────────────────────────────────────

        [HttpDelete("{housingId:int}")]
        public async Task<IActionResult> Remove(int housingId)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }


            var item = await _context.WishlistItems
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.HousingId == housingId
                );


            if (item == null)
            {
                return NotFound();
            }


            _context.WishlistItems.Remove(item);

            await _context.SaveChangesAsync();


            return NoContent();
        }


        // ──────────────────────────────────────────
        // GET: api/wishlist/5/check
        // Перевірити, чи житло є у wishlist
        // ──────────────────────────────────────────

        [HttpGet("{housingId:int}/check")]
        public async Task<IActionResult> Check(int housingId)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }


            var isFavorite = await _context.WishlistItems
                .AnyAsync(x =>
                    x.UserId == userId &&
                    x.HousingId == housingId
                );


            return Ok(new
            {
                isFavorite
            });
        }
    }
}