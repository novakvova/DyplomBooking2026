namespace DyplomBooking2026.Models;

/// <summary>
/// Теги категорій подорожі для секції "Подорожі будь-якого типу"
/// на головній сторінці (Пляж/Гори/Лижі/Сім'я/Культура/Релаксація
/// з дизайну Figma). Це окрема концепція від Housing.Type (тип
/// нерухомості: Studio/Apartment/House) — тут йдеться про характер
/// подорожі, а не про форму житла.
///
/// Значення навмисно зберігаються як прості рядки (а не enum) в
/// Housing.TravelCategory, щоб адміни могли додавати нові категорії
/// через дані, не чіпаючи код. Цей клас — лише "канонічний" список
/// за замовчуванням, який використовує DbSeeder і який віддається
/// фронтенду через GET /api/housing/travel-categories, щоб теги на
/// сторінці не розходились з тим, що реально є в даних.
/// </summary>
public static class TravelCategories
{
    public const string Beach = "Пляж";
    public const string Mountains = "Гори";
    public const string Ski = "Лижі";
    public const string Family = "Сім'я";
    public const string Culture = "Культура";
    public const string Relax = "Релаксація";

    public static readonly string[] All =
    [
        Beach,
        Mountains,
        Ski,
        Family,
        Culture,
        Relax
    ];
}
