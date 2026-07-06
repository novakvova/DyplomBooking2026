using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using DyplomBooking2026.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers
{
    [ApiController]
    [Route("api/housing/{housingId}/photos")]
    [Authorize(Roles = "Admin,Manager")]
    public class PhotoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PhotoService _photoService;

        public PhotoController(ApplicationDbContext context, PhotoService photoService)
        {
            _context = context;
            _photoService = photoService;
        }

        /// <summary>
        /// Отримати всі фото конкретного житла (публічно)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetPhotos(int housingId)
        {
            var photos = await _context.HousingPhotos
                .Where(p => p.HousingId == housingId)
                .OrderByDescending(p => p.IsMain)
                .ThenBy(p => p.UploadedAt)
                .Select(p => ToDto(p))
                .ToListAsync();

            return Ok(photos);
        }

        /// <summary>
        /// Завантажити одне фото для житла
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PhotoDto>> UploadPhoto(int housingId, IFormFile file)
        {
            var housing = await _context.Housings.FindAsync(housingId);
            if (housing == null) return NotFound("Житло не знайдено.");

            string filePath;
            try
            {
                filePath = await _photoService.SavePhotoAsync(file, "housing");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            // Перша фотографія автоматично стає головною
            var isFirst = !await _context.HousingPhotos.AnyAsync(p => p.HousingId == housingId);

            var photo = new HousingPhoto
            {
                HousingId = housingId,
                FilePath = filePath,
                OriginalName = file.FileName,
                IsMain = isFirst
            };

            _context.HousingPhotos.Add(photo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPhotos), new { housingId }, ToDto(photo));
        }

        /// <summary>
        /// Завантажити декілька фото одразу
        /// </summary>
        [HttpPost("bulk")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> UploadMultiple(
            int housingId, [FromForm] List<IFormFile> files)
        {
            var housing = await _context.Housings.FindAsync(housingId);
            if (housing == null) return NotFound("Житло не знайдено.");

            if (files.Count == 0) return BadRequest("Не надано жодного файлу.");
            if (files.Count > 10) return BadRequest("Максимум 10 фото за раз.");

            var alreadyHasPhotos = await _context.HousingPhotos.AnyAsync(p => p.HousingId == housingId);
            var added = new List<HousingPhoto>();
            var errors = new List<string>();

            for (int i = 0; i < files.Count; i++)
            {
                try
                {
                    var filePath = await _photoService.SavePhotoAsync(files[i], "housing");
                    var photo = new HousingPhoto
                    {
                        HousingId = housingId,
                        FilePath = filePath,
                        OriginalName = files[i].FileName,
                        IsMain = !alreadyHasPhotos && i == 0 // перша з нових — головна, якщо ще не було фото
                    };
                    added.Add(photo);
                    _context.HousingPhotos.Add(photo);
                }
                catch (Exception ex)
                {
                    errors.Add($"{files[i].FileName}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();

            if (errors.Count > 0 && added.Count == 0)
                return BadRequest(new { message = "Жодне фото не збережено.", errors });

            return Ok(new
            {
                uploaded = added.Select(ToDto),
                errors
            });
        }

        /// <summary>
        /// Встановити фото як головне (обкладинка)
        /// </summary>
        [HttpPatch("{photoId}/set-main")]
        public async Task<IActionResult> SetMain(int housingId, int photoId)
        {
            var photos = await _context.HousingPhotos
                .Where(p => p.HousingId == housingId)
                .ToListAsync();

            var target = photos.FirstOrDefault(p => p.Id == photoId);
            if (target == null) return NotFound("Фото не знайдено.");

            foreach (var p in photos) p.IsMain = false;
            target.IsMain = true;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Видалити фото
        /// </summary>
        [HttpDelete("{photoId}")]
        public async Task<IActionResult> Delete(int housingId, int photoId)
        {
            var photo = await _context.HousingPhotos
                .FirstOrDefaultAsync(p => p.Id == photoId && p.HousingId == housingId);

            if (photo == null) return NotFound("Фото не знайдено.");

            _photoService.DeletePhoto(photo.FilePath);
            _context.HousingPhotos.Remove(photo);
            await _context.SaveChangesAsync();

            // Якщо видалили головне фото — перше з решти стає головним
            if (photo.IsMain)
            {
                var next = await _context.HousingPhotos
                    .Where(p => p.HousingId == housingId)
                    .OrderBy(p => p.UploadedAt)
                    .FirstOrDefaultAsync();

                if (next != null)
                {
                    next.IsMain = true;
                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }

        private static PhotoDto ToDto(HousingPhoto p) => new()
        {
            Id = p.Id,
            HousingId = p.HousingId,
            FilePath = p.FilePath,
            OriginalName = p.OriginalName,
            IsMain = p.IsMain,
            UploadedAt = p.UploadedAt
        };
    }
}
