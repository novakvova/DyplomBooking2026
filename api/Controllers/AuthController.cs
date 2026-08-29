using System.Security.Claims;
using System.Web;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using DyplomBooking2026.Services;
using Microsoft.AspNetCore.Authentication.Facebook;
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
        private readonly EmailService _emailService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            TokenService tokenService,
            EmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        // ──────────────────────────────────────────
        // Звичайна реєстрація / логін
        // ──────────────────────────────────────────

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            // Перевіряємо, чи користувач уже існує.
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
                return BadRequest("Користувач з таким email вже існує.");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                IsBlocked = false
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(
                    result.Errors.Select(e => e.Description)
                );
            }

            // Новий користувач отримує роль Client.
            var roleResult = await _userManager.AddToRoleAsync(user, "Client");

            if (!roleResult.Succeeded)
            {
                return BadRequest(
                    roleResult.Errors.Select(e => e.Description)
                );
            }

            return Ok(await BuildAuthResponse(user));
        }

        // ──────────────────────────────────────────
        // LOGIN
        // ──────────────────────────────────────────

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
                return Unauthorized("Невірний email або пароль.");

            // Ручне блокування адміністратором.
            if (user.IsBlocked)
                return Unauthorized("Ваш акаунт заблоковано.");

            // Перевіряємо пароль через Identity.
            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                dto.Password,
                lockoutOnFailure: false
            );

            // Додаткова перевірка Identity Lockout.
            if (result.IsLockedOut)
                return Unauthorized("Ваш акаунт заблоковано.");

            if (!result.Succeeded)
                return Unauthorized("Невірний email або пароль.");

            return Ok(await BuildAuthResponse(user));
        }

        // ──────────────────────────────────────────
        // Google OAuth
        // ──────────────────────────────────────────

        [HttpGet("google/login")]
        public IActionResult GoogleLogin([FromQuery] string? returnUrl = null)
        {
            var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth",
                new { returnUrl }, Request.Scheme);

            var properties = _signInManager.ConfigureExternalAuthenticationProperties(
                GoogleDefaults.AuthenticationScheme, redirectUrl);

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google/callback")]
        public async Task<ActionResult<AuthResponseDto>> GoogleCallback()
        {
            return await CompleteExternalLogin("Google");
        }

        [HttpGet("facebook/login")]
        public IActionResult FacebookLogin([FromQuery] string? returnUrl = null)
        {
            var redirectUrl = Url.Action(nameof(FacebookCallback), "Auth", new { returnUrl }, Request.Scheme);
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(FacebookDefaults.AuthenticationScheme, redirectUrl);
            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet("facebook/callback")]
        public async Task<ActionResult<AuthResponseDto>> FacebookCallback() => await CompleteExternalLogin("Facebook");

        private async Task<ActionResult<AuthResponseDto>> CompleteExternalLogin(string providerName)
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
                return BadRequest($"Не вдалося отримати дані від {providerName}.");

            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var name = info.Principal.FindFirstValue(ClaimTypes.Name);

            if (string.IsNullOrEmpty(email))
                return BadRequest($"{providerName} не надав email.");

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                FullName = name ?? email,
                    EmailConfirmed = true
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                    return BadRequest(createResult.Errors.Select(e => e.Description));

                await _userManager.AddToRoleAsync(user, "Client");
            }

            var logins = await _userManager.GetLoginsAsync(user);
            var alreadyLinked = logins.Any(l =>
                l.LoginProvider == info.LoginProvider &&
                l.ProviderKey == info.ProviderKey);

            if (!alreadyLinked)
                await _userManager.AddLoginAsync(user, info);

            var response = await BuildAuthResponse(user);
            var frontendUrl = $"http://localhost:5173/oauth-callback" +
                $"?provider={Uri.EscapeDataString(providerName)}" +
                $"&token={Uri.EscapeDataString(response.Token)}" +
                $"&email={Uri.EscapeDataString(response.Email)}" +
                $"&fullName={Uri.EscapeDataString(response.FullName ?? "")}" +
                $"&roles={string.Join(",", response.Roles)}";

            return Redirect(frontendUrl);
        }

        // ──────────────────────────────────────────
        // Відновлення паролю
        // ──────────────────────────────────────────

        /// <summary>
        /// Крок 1: Надіслати лист з посиланням для відновлення паролю
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            // Завжди повертаємо 200 — щоб не розкривати, чи існує email у системі
            if (user == null)
                return Ok("Якщо такий email зареєстрований — лист надіслано.");

            // Генеруємо токен скидання паролю (Identity вбудований механізм)
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Кодуємо токен для URL (бо він містить спецсимволи)
            var encodedToken = HttpUtility.UrlEncode(token);
            var encodedEmail = HttpUtility.UrlEncode(dto.Email);

            // Посилання для фронтенду (зміни BaseUrl під свій фронтенд або поки що Swagger)
            // Приклад для React-фронту: http://localhost:5173/reset-password?email=...&token=...
            // Для тестування в Swagger — використовуй /api/auth/reset-password напряму
            var baseUrl = "http://localhost:5173";
            var resetLink = $"{baseUrl}/reset-password?email={encodedEmail}&token={encodedToken}";

            try
            {
                await _emailService.SendPasswordResetEmailAsync(dto.Email, resetLink);
            }
            catch (Exception ex)
            {
                // Логуємо помилку, але не розкриваємо деталі клієнту
                Console.WriteLine($"Email send error: {ex.Message}");
                return StatusCode(500, "Помилка при відправці листа. Перевір налаштування Email у user-secrets.");
            }

            return Ok("Якщо такий email зареєстрований — лист надіслано.");
        }

        /// <summary>
        /// Крок 2: Встановити новий пароль за допомогою токену з листа
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("Невірний email або токен.");

            // Декодуємо токен (якщо він прийшов з URL)
            var decodedToken = HttpUtility.UrlDecode(dto.Token);

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { message = "Не вдалося змінити пароль.", errors });
            }

            return Ok("Пароль успішно змінено. Тепер можеш увійти з новим паролем.");
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
