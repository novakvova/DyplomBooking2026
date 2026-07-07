using System.Security.Claims;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using DyplomBooking2026.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DyplomBooking2026.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly PhotoService _photoService;

        public ProfileController(
            UserManager<ApplicationUser> userManager,
            PhotoService photoService)
        {
            _userManager = userManager;
            _photoService = photoService;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

        // ──────────────────────────────────────────
        // GET /api/profile — отримати свій профіль
        // ──────────────────────────────────────────

        [HttpGet]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            var user = await _userManager.FindByIdAsync(CurrentUserId);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new ProfileDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                AvatarPath = user.AvatarPath,
                Roles = roles
            });
        }

        // ──────────────────────────────────────────
        // PUT /api/profile — оновити ім'я
        // ──────────────────────────────────────────

        [HttpPut]
        public async Task<ActionResult<ProfileDto>> UpdateProfile(UpdateProfileDto dto)
        {
            var user = await _userManager.FindByIdAsync(CurrentUserId);
            if (user == null) return NotFound();

            if (dto.FullName is not null)
                user.FullName = dto.FullName;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new ProfileDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                AvatarPath = user.AvatarPath,
                Roles = roles
            });
        }

        // ──────────────────────────────────────────
        // POST /api/profile/avatar — завантажити аватар
        // ──────────────────────────────────────────

        [HttpPost("avatar")]
        public async Task<ActionResult<ProfileDto>> UploadAvatar(IFormFile file)
        {
            var user = await _userManager.FindByIdAsync(CurrentUserId);
            if (user == null) return NotFound();

            // Видалити старий аватар якщо є
            if (!string.IsNullOrEmpty(user.AvatarPath))
                _photoService.DeletePhoto(user.AvatarPath);

            string filePath;
            try
            {
                filePath = await _photoService.SavePhotoAsync(file, "avatars");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            user.AvatarPath = filePath;
            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new ProfileDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                AvatarPath = user.AvatarPath,
                Roles = roles
            });
        }

        // ──────────────────────────────────────────
        // DELETE /api/profile/avatar — видалити аватар
        // ──────────────────────────────────────────

        [HttpDelete("avatar")]
        public async Task<IActionResult> DeleteAvatar()
        {
            var user = await _userManager.FindByIdAsync(CurrentUserId);
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(user.AvatarPath))
            {
                _photoService.DeletePhoto(user.AvatarPath);
                user.AvatarPath = null;
                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }

        // ──────────────────────────────────────────
        // POST /api/profile/change-password — змінити пароль
        // ──────────────────────────────────────────

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(CurrentUserId);
            if (user == null) return NotFound();

            var result = await _userManager.ChangePasswordAsync(
                user, dto.CurrentPassword, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            return Ok("Пароль успішно змінено.");
        }
    }
}
