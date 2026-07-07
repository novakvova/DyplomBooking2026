using System.Security.Claims;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using DyplomBooking2026.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DyplomBooking2026.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        // ──────────────────────────────────────────
        // Звичайна реєстрація / логін
        // ──────────────────────────────────────────

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return BadRequest("Користувач з таким email вже існує.");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            await _userManager.AddToRoleAsync(user, "Client");

            return Ok(await BuildAuthResponse(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Невірний email або пароль.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Невірний email або пароль.");

            return Ok(await BuildAuthResponse(user));
        }

        // ──────────────────────────────────────────
        // Google OAuth
        // ──────────────────────────────────────────

        /// <summary>
        /// Крок 1: Перенаправляє браузер на сторінку входу Google
        /// Відкрий цей URL у браузері: GET /api/auth/google/login
        /// </summary>
        [HttpGet("google/login")]
        public IActionResult GoogleLogin([FromQuery] string? returnUrl = null)
        {
            var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth",
                new { returnUrl }, Request.Scheme);

            var properties = _signInManager.ConfigureExternalAuthenticationProperties(
                GoogleDefaults.AuthenticationScheme, redirectUrl);

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// Крок 2: Google перенаправляє сюди після успішного входу.
        /// Повертає JWT токен — такий самий, як при звичайному логіні.
        /// </summary>
        [HttpGet("google/callback")]
        public async Task<ActionResult<AuthResponseDto>> GoogleCallback()
        {
            // Отримуємо дані від Google
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
                return BadRequest("Не вдалося отримати дані від Google. Спробуй ще раз.");

            // Витягуємо email та ім'я з Google claims
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var name = info.Principal.FindFirstValue(ClaimTypes.Name);

            if (string.IsNullOrEmpty(email))
                return BadRequest("Google не надав email. Перевір налаштування OAuth.");

            // Шукаємо існуючого юзера за email
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                // Новий користувач — реєструємо автоматично
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = name,
                    EmailConfirmed = true // Google вже підтвердив email
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                    return BadRequest(createResult.Errors.Select(e => e.Description));

                await _userManager.AddToRoleAsync(user, "Client");
            }

            // Прив'язуємо Google логін до акаунту (якщо ще не прив'язано)
            var logins = await _userManager.GetLoginsAsync(user);
            var alreadyLinked = logins.Any(l =>
                l.LoginProvider == info.LoginProvider &&
                l.ProviderKey == info.ProviderKey);

            if (!alreadyLinked)
            {
                await _userManager.AddLoginAsync(user, info);
            }

            return Ok(await BuildAuthResponse(user));
        }

        // ──────────────────────────────────────────
        // Хелпер
        // ──────────────────────────────────────────

        private async Task<AuthResponseDto> BuildAuthResponse(ApplicationUser user)
        {
            var token = await _tokenService.CreateTokenAsync(user, _userManager);
            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                FullName = user.FullName,
                Roles = roles
            };
        }
    }
}
