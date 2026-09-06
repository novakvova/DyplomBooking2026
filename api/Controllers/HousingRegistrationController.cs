using System.Security.Claims;
using System.Text.Json;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs.Housing;
using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers;

[ApiController]
[Route("api/housing")]
public class HousingRegistrationController : ControllerBase
{
    private const int MinPhotos = 5;
    private const int MaxPhotos = 15;
    private const long MaxPhotoSize = 10 * 1024 * 1024; // 10 MB

    private static readonly HashSet<string> AllowedExtensions =
    [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public HousingRegistrationController(
        ApplicationDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // POST: api/housing/register
    // multipart/form-data:
    // data   -> JSON HousingRegistrationData
    // photos -> 5-15 image files
    [Authorize]
    [HttpPost("register")]
    [RequestSizeLimit(170_000_000)]
    public async Task<IActionResult> Register(
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        if (!Request.HasFormContentType)
            return BadRequest("Очікується multipart/form-data.");

        var form = await Request.ReadFormAsync(cancellationToken);

        var rawData = form["data"].FirstOrDefault();

        var photos = form.Files
            .Where(file => file.Name == "photos")
            .ToList();

        if (string.IsNullOrWhiteSpace(rawData))
            return BadRequest("Дані оголошення не передано.");

        if (photos.Count == 0)
            return BadRequest("Фотографії не передано.");

        CreateHousingRequestDto? dto;

        try
        {
            dto = JsonSerializer.Deserialize<CreateHousingRequestDto>(
                rawData,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
        }
        catch (JsonException)
        {
            return BadRequest("Некоректні дані оголошення.");
        }

        if (dto is null)
            return BadRequest("Не вдалося прочитати дані оголошення.");

        var validationError = ValidateRequest(dto, photos);

        if (validationError is not null)
            return BadRequest(validationError);

        var address = ReadAddress(dto.Address);

        var housingTypeValue =
            dto.AccommodationType ??
            dto.Category;

        if (!TryParseHousingType(
                housingTypeValue,
                out var housingType))
        {
            return BadRequest(
                $"Невідомий тип житла: {housingTypeValue}");
        }

        var housing = new Housing
        {
            OwnerId = userId,

            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Type = housingType,

            Address = address.FullAddress,
            City = address.City,

            Rooms = dto.Bedrooms,
            MaxGuests = dto.Guests,

            PricePerNight = dto.PricePerNight,
            PricePerHour = dto.PricePerHour,

            IsAvailable = true,
            CreatedAt = DateTime.UtcNow,

            Category = dto.Category ?? "",
            PropertyType = dto.PropertyType ?? "",
            RentalFormat = dto.RentalFormat ?? "",
            AccommodationType = dto.AccommodationType ?? "",

            Bedrooms = dto.Bedrooms,
            Beds = dto.Beds,
            Bathrooms = dto.Bathrooms,

            PrivateBathroomInside = dto.PrivateBathroomInside,
            PrivateBathroomOutside = dto.PrivateBathroomOutside,
            SharedBathroom = dto.SharedBathroom,

            BedroomLock = dto.BedroomLock,

            LivesWithHost = dto.LivesWithHost,
            LivesWithFamily = dto.LivesWithFamily,
            OtherGuestsPresent = dto.OtherGuestsPresent,
            PetsPresent = dto.PetsPresent,

            Amenities = dto.Amenities,
            Highlights = dto.Highlights,

            BookingMode = dto.BookingMode ?? "manual",

            WeeklyDiscountPercent = dto.WeeklyDiscountPercent,
            MonthlyDiscountPercent = dto.MonthlyDiscountPercent,
            ShortStayDiscountPercent = dto.ShortStayDiscountPercent,

            SecurityCameras = dto.SecurityCameras,
            NoiseMonitor = dto.NoiseMonitor,
            PropertySafetyFeatures = dto.PropertySafetyFeatures,

            SecurityCamerasDescription =
                dto.SecurityCamerasDescription.Trim(),

            NoiseMonitorDescription =
                dto.NoiseMonitorDescription.Trim(),

            PropertySafetyFeaturesDescription =
                dto.PropertySafetyFeaturesDescription.Trim(),

            CheckInTime = dto.CheckInTime,
            CheckOutTime = dto.CheckOutTime,

            HourlyStartTime = dto.HourlyStartTime,
            HourlyEndTime = dto.HourlyEndTime,

            EarlyCheckIn = dto.EarlyCheckIn,

            SmokingRule = dto.SmokingRule,
            PetsRule = dto.PetsRule,
            PartiesRule = dto.PartiesRule,

            QuietHoursMode = dto.QuietHoursMode,
            QuietHoursFrom = dto.QuietHoursFrom,
            QuietHoursTo = dto.QuietHoursTo,

            AdditionalRules = dto.AdditionalRules.Trim(),

            MinimumStay = dto.MinimumStay,
            BookingWindowMonths = dto.BookingWindowMonths,
            PreparationTime = dto.PreparationTime
        };

        var webRootPath =
            _environment.WebRootPath ??
            Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot");

        var uploadsFolder = Path.Combine(
            webRootPath,
            "images",
            "apartments");

        Directory.CreateDirectory(uploadsFolder);

        var savedFiles = new List<string>();

        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                cancellationToken);

        try
        {
            _context.Housings.Add(housing);

            await _context.SaveChangesAsync(
                cancellationToken);

            for (var i = 0; i < photos.Count; i++)
            {
                var photo = photos[i];

                var extension =
                    Path.GetExtension(photo.FileName)
                        .ToLowerInvariant();

                var fileName =
                    $"housing-{housing.Id}-{Guid.NewGuid():N}{extension}";

                var physicalPath =
                    Path.Combine(
                        uploadsFolder,
                        fileName);

                await using (var stream =
                    System.IO.File.Create(physicalPath))
                {
                    await photo.CopyToAsync(
                        stream,
                        cancellationToken);
                }

                savedFiles.Add(physicalPath);

                _context.HousingPhotos.Add(
                    new HousingPhoto
                    {
                        HousingId = housing.Id,

                        FilePath =
                            $"/images/apartments/{fileName}",

                        OriginalName =
                            Path.GetFileName(photo.FileName),

                        IsMain = i == 0
                    });
            }

            await _context.SaveChangesAsync(
                cancellationToken);

            await transaction.CommitAsync(
                cancellationToken);

            // GET /api/housing/{id} має обслуговувати
            // звичайний public HousingController.
            return Created(
                $"/api/housing/{housing.Id}",
                new
                {
                    housing.Id,
                    housing.Title,
                    housing.IsAvailable
                });
        }
        catch
        {
            await transaction.RollbackAsync(
                cancellationToken);

            foreach (var file in savedFiles)
            {
                if (System.IO.File.Exists(file))
                {
                    System.IO.File.Delete(file);
                }
            }

            throw;
        }
    }

    private static string? ValidateRequest(
        CreateHousingRequestDto dto,
        List<IFormFile> photos)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return "Вкажіть назву житла.";

        if (dto.Title.Trim().Length > 50)
            return "Назва житла не може перевищувати 50 символів.";

        if (string.IsNullOrWhiteSpace(dto.Description))
            return "Вкажіть опис житла.";

        if (dto.Description.Trim().Length > 500)
            return "Опис житла не може перевищувати 500 символів.";

        if (dto.Guests < 1 ||
            dto.Bedrooms < 1 ||
            dto.Beds < 1)
        {
            return "Некоректна місткість житла.";
        }

        if (dto.Bathrooms < 1)
            return "У житлі має бути хоча б одна ванна кімната.";

        var bathroomTotal =
            dto.PrivateBathroomInside +
            dto.PrivateBathroomOutside +
            dto.SharedBathroom;

        if (bathroomTotal != dto.Bathrooms)
        {
            return
                "Кількість типів ванних кімнат не відповідає загальній кількості.";
        }

        if (dto.RentalFormat is not
            ("daily" or "hourly" or "flexible"))
        {
            return "Некоректний формат оренди.";
        }

        if ((dto.RentalFormat is "daily" or "flexible") &&
            dto.PricePerNight <= 0)
        {
            return "Ціна за ніч має бути більшою за 0.";
        }

        if ((dto.RentalFormat is "hourly" or "flexible") &&
            dto.PricePerHour <= 0)
        {
            return "Ціна за годину має бути більшою за 0.";
        }

        if (dto.WeeklyDiscountPercent is < 0 or > 90 ||
            dto.MonthlyDiscountPercent is < 0 or > 90 ||
            dto.ShortStayDiscountPercent is < 0 or > 90)
        {
            return "Знижка має бути від 0% до 90%.";
        }

        if (dto.MinimumStay < 1)
        {
            return
                "Мінімальна тривалість проживання має бути не менше 1.";
        }

        if (dto.BookingWindowMonths < 1)
        {
            return
                "Вікно бронювання має бути не менше 1 місяця.";
        }

        if (photos.Count < MinPhotos)
        {
            return
                $"Додайте щонайменше {MinPhotos} фотографій.";
        }

        if (photos.Count > MaxPhotos)
        {
            return
                $"Можна завантажити не більше {MaxPhotos} фотографій.";
        }

        foreach (var photo in photos)
        {
            if (photo.Length == 0)
                return "Один із файлів порожній.";

            if (photo.Length > MaxPhotoSize)
            {
                return
                    "Розмір одного фото не може перевищувати 10 MB.";
            }

            var extension =
                Path.GetExtension(photo.FileName)
                    .ToLowerInvariant();

            if (!AllowedExtensions.Contains(extension))
            {
                return
                    "Дозволені формати фото: JPG, JPEG, PNG, WEBP.";
            }
        }

        return null;
    }

    private static bool TryParseHousingType(
        string? value,
        out HousingType housingType)
    {
        housingType = default;

        if (string.IsNullOrWhiteSpace(value))
            return false;

        var normalized = string.Concat(
            value
                .Split(
                    '_',
                    StringSplitOptions.RemoveEmptyEntries)
                .Select(part =>
                    char.ToUpperInvariant(part[0]) +
                    part[1..])
        );

        return Enum.TryParse(
            normalized,
            ignoreCase: true,
            out housingType);
    }

    private static (
        string FullAddress,
        string City
    ) ReadAddress(
        JsonElement? address)
    {
        if (address is null ||
            address.Value.ValueKind !=
            JsonValueKind.Object)
        {
            return ("", "");
        }

        var value = address.Value;

        var formattedAddress =
            ReadString(
                value,
                "formattedAddress") ??
            ReadString(
                value,
                "fullAddress");

        var street =
            ReadString(
                value,
                "street") ??
            ReadString(
                value,
                "address");

        var city =
            ReadString(value, "city") ?? "";

        var country =
            ReadString(value, "country") ?? "";

        var fullAddress =
            formattedAddress ??
            string.Join(
                ", ",
                new[]
                {
                    street,
                    city,
                    country
                }
                .Where(x =>
                    !string.IsNullOrWhiteSpace(x)));

        return (
            fullAddress ?? "",
            city
        );
    }

    private static string? ReadString(
        JsonElement element,
        string property)
    {
        if (!element.TryGetProperty(
                property,
                out var value))
        {
            return null;
        }

        return value.ValueKind ==
            JsonValueKind.String
                ? value.GetString()
                : null;
    }
}
