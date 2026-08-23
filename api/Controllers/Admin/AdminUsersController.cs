using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs.Admin;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AdminUsersController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager
    )
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/users
    // Список користувачів + пошук + фільтри + pagination.
    // ─────────────────────────────────────────────

    [HttpGet]
    public async Task<ActionResult<AdminUsersResponseDto>> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] bool? isBlocked,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Users
            .AsNoTracking()
            .AsQueryable();

        // Пошук по email та імені.
        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLower();

            query = query.Where(user =>
                (user.Email != null &&
                 user.Email.ToLower().Contains(normalizedSearch)) ||
                (user.FullName != null &&
                 user.FullName.ToLower().Contains(normalizedSearch))
            );
        }

        // Active / blocked.
        if (isBlocked.HasValue)
        {
            query = query.Where(user =>
                user.IsBlocked == isBlocked.Value
            );
        }

        // Фільтр за Identity role.
        if (!string.IsNullOrWhiteSpace(role))
        {
            var normalizedRole = role.Trim().ToUpper();

            query =
                from user in query
                join userRole in _context.UserRoles
                    on user.Id equals userRole.UserId
                join identityRole in _context.Roles
                    on userRole.RoleId equals identityRole.Id
                where identityRole.NormalizedName == normalizedRole
                select user;
        }

        query = query.Distinct();

        var totalItems = await query.CountAsync();

        var users = await query
            .OrderByDescending(user => user.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(user => new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.AvatarPath,
                user.IsBlocked,
                user.CreatedAt,

                HousingsCount = _context.Housings
                    .Count(h => h.OwnerId == user.Id),

                BookingsCount = _context.HousingBookings
                    .Count(b => b.UserId == user.Id),

                WishlistCount = _context.WishlistItems
                    .Count(w => w.UserId == user.Id)
            })
            .ToListAsync();

        var result = new List<AdminUserDto>();

        foreach (var userData in users)
        {
            var user = await _userManager.FindByIdAsync(userData.Id);

            if (user == null)
                continue;

            var roles = await _userManager.GetRolesAsync(user);

            result.Add(new AdminUserDto
            {
                Id = userData.Id,
                Email = userData.Email ?? "",
                FullName = userData.FullName,
                AvatarPath = userData.AvatarPath,
                IsBlocked = userData.IsBlocked,
                CreatedAt = userData.CreatedAt,

                Roles = roles.ToList(),

                HousingsCount = userData.HousingsCount,
                BookingsCount = userData.BookingsCount,
                WishlistCount = userData.WishlistCount
            });
        }

        return Ok(new AdminUsersResponseDto
        {
            Items = result,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(
                totalItems / (double)pageSize
            )
        });
    }

    // ─────────────────────────────────────────────
    // GET: api/admin/users/{id}
    // Детальна інформація про користувача.
    // ─────────────────────────────────────────────

    [HttpGet("{id}")]
    public async Task<ActionResult<AdminUserDetailsDto>> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("Користувача не знайдено.");

        var roles = await _userManager.GetRolesAsync(user);

        var housings = await _context.Housings
            .AsNoTracking()
            .Where(h => h.OwnerId == user.Id)
            .OrderByDescending(h => h.CreatedAt)
            .Select(h => new AdminUserHousingDto
            {
                Id = h.Id,
                Title = h.Title,
                City = h.City,
                PricePerNight = h.PricePerNight,
                IsAvailable = h.IsAvailable,

                MainPhotoPath = h.Photos
                    .Where(p => p.IsMain)
                    .Select(p => p.FilePath)
                    .FirstOrDefault()
                    ?? h.Photos
                        .Select(p => p.FilePath)
                        .FirstOrDefault()
            })
            .ToListAsync();

        var bookings = await _context.HousingBookings
            .AsNoTracking()
            .Where(b => b.UserId == user.Id)
            .OrderByDescending(b => b.CheckIn)
            .Select(b => new AdminUserBookingDto
            {
                Id = b.Id,
                HousingId = b.HousingId,
                HousingTitle = b.Housing.Title,
                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,
                GuestsCount = b.GuestsCount,
                TotalPrice = b.TotalPrice,
                Status = b.Status.ToString()
            })
            .ToListAsync();

        var wishlist = await _context.WishlistItems
            .AsNoTracking()
            .Where(w => w.UserId == user.Id)
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => new AdminUserWishlistDto
            {
                HousingId = w.HousingId,
                Title = w.Housing.Title,
                City = w.Housing.City,
                PricePerNight = w.Housing.PricePerNight,

                MainPhotoPath = w.Housing.Photos
                    .Where(p => p.IsMain)
                    .Select(p => p.FilePath)
                    .FirstOrDefault()
                    ?? w.Housing.Photos
                        .Select(p => p.FilePath)
                        .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(new AdminUserDetailsDto
        {
            Id = user.Id,
            Email = user.Email ?? "",
            FullName = user.FullName,
            AvatarPath = user.AvatarPath,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt,
            Roles = roles.ToList(),

            HousingsCount = housings.Count,
            BookingsCount = bookings.Count,
            WishlistCount = wishlist.Count,

            Housings = housings,
            Bookings = bookings,
            Wishlist = wishlist
        });
    }

    // ─────────────────────────────────────────────
    // PATCH: api/admin/users/{id}/role
    // Зміна основної ролі користувача.
    // ─────────────────────────────────────────────

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> UpdateRole(
        string id,
        [FromBody] UpdateUserRoleDto dto
    )
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("Користувача не знайдено.");

        var role = dto.Role?.Trim();

        if (string.IsNullOrWhiteSpace(role))
            return BadRequest("Роль не вказана.");

        // Поки дозволяємо тільки ці ролі.
        var allowedRoles = new[] { "Client", "Admin" };

        var newRole = allowedRoles.FirstOrDefault(x =>
            x.Equals(role, StringComparison.OrdinalIgnoreCase)
        );

        if (newRole == null)
            return BadRequest("Недопустима роль.");

        // Перевіряємо, що роль існує в Identity.
        if (!await _roleManager.RoleExistsAsync(newRole))
            return BadRequest($"Роль {newRole} не існує.");

        var currentRoles = await _userManager.GetRolesAsync(user);
        var currentUserId = _userManager.GetUserId(User);

        // ─────────────────────────────────────────────
        // SELF PROTECTION
        // Адмін не може зняти Admin із самого себе.
        // ─────────────────────────────────────────────

        if (
            user.Id == currentUserId &&
            currentRoles.Contains("Admin") &&
            newRole != "Admin"
        )
        {
            return BadRequest(
                "Ви не можете зняти роль Admin із власного акаунта."
            );
        }

        // ─────────────────────────────────────────────
        // LAST ADMIN PROTECTION
        // У системі завжди має залишатися хоча б один Admin.
        // ─────────────────────────────────────────────

        if (
            currentRoles.Contains("Admin") &&
            newRole != "Admin"
        )
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");

            if (admins.Count <= 1)
            {
                return BadRequest(
                    "Неможливо змінити роль. У системі має залишатися хоча б один Admin."
                );
            }
        }

        // Роль уже встановлена — нічого не робимо.
        if (
            currentRoles.Count == 1 &&
            currentRoles.Contains(newRole)
        )
        {
            return NoContent();
        }

        // ─────────────────────────────────────────────
        // REMOVE OLD ROLES
        // ─────────────────────────────────────────────

        if (currentRoles.Count > 0)
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(
                user,
                currentRoles
            );

            if (!removeResult.Succeeded)
            {
                return BadRequest(
                    removeResult.Errors.Select(x => x.Description)
                );
            }
        }

        // ─────────────────────────────────────────────
        // ADD NEW ROLE
        // ─────────────────────────────────────────────

        var addResult = await _userManager.AddToRoleAsync(
            user,
            newRole
        );

        if (!addResult.Succeeded)
        {
            // Якщо нову роль не вдалося додати,
            // намагаємося повернути старі ролі.
            if (currentRoles.Count > 0)
            {
                await _userManager.AddToRolesAsync(
                    user,
                    currentRoles
                );
            }

            return BadRequest(
                addResult.Errors.Select(x => x.Description)
            );
        }

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // PATCH: api/admin/users/{id}/block
    // Блокування користувача.
    // ─────────────────────────────────────────────

    [HttpPatch("{id}/block")]
    public async Task<IActionResult> Block(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("Користувача не знайдено.");

        var currentUserId = _userManager.GetUserId(User);

        // Адмін не може заблокувати самого себе.
        if (user.Id == currentUserId)
        {
            return BadRequest(
                "Ви не можете заблокувати власний акаунт."
            );
        }

        if (user.IsBlocked)
            return NoContent();

        user.IsBlocked = true;

        // Identity lockout.
        user.LockoutEnabled = true;
        user.LockoutEnd = DateTimeOffset.MaxValue;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(
                result.Errors.Select(error => error.Description)
            );
        }

        return NoContent();
    }

    // ─────────────────────────────────────────────
    // PATCH: api/admin/users/{id}/unblock
    // Розблокування користувача.
    // ─────────────────────────────────────────────

    [HttpPatch("{id}/unblock")]
    public async Task<IActionResult> Unblock(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("Користувача не знайдено.");

        if (!user.IsBlocked)
            return NoContent();

        user.IsBlocked = false;
        user.LockoutEnd = null;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(
                result.Errors.Select(error => error.Description)
            );
        }

        return NoContent();
    }
}