using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Data;

public static class ReviewSeeder
{
    private const string SeedUserPassword = "WayGo.Test123!";

    private static readonly string[] Comments =
    [
        "Чудове помешкання, усе відповідало опису. Було чисто та комфортно.",
        "Дуже сподобалось розташування. Заселення пройшло швидко і без проблем.",
        "Гарне місце для відпочинку. Фото відповідають реальності.",
        "Комфортне житло, є все необхідне для кількох днів.",
        "Приємне помешкання та зручне розташування. Залишились задоволені.",
        "Все було добре: чисто, тихо та зручно.",
        "Помешкання сподобалось. Із задоволенням зупинились би тут ще раз.",
        "Хороший варіант за свою ціну. Умови відповідають опису.",
        "Дуже затишно. Особливо сподобалась атмосфера та район.",
        "Зручне заселення, охайне житло та приємні враження від поїздки.",
        "Загалом усе сподобалось. Невеликі нюанси були, але вони не зіпсували відпочинок.",
        "Гарне помешкання для короткої подорожі. Все необхідне було на місці.",
        "Чисто, комфортно і без зайвих проблем. Рекомендую.",
        "Розташування дуже зручне, поруч є все необхідне.",
        "Враження позитивні. Помешкання виглядає так само, як на фотографіях."
    ];

    private static readonly (string Email, string UserName)[] SeedUsers =
    [
        ("reviewer01@waygo.local", "waygo_reviewer_01"),
        ("reviewer02@waygo.local", "waygo_reviewer_02"),
        ("reviewer03@waygo.local", "waygo_reviewer_03"),
        ("reviewer04@waygo.local", "waygo_reviewer_04"),
        ("reviewer05@waygo.local", "waygo_reviewer_05"),
        ("reviewer06@waygo.local", "waygo_reviewer_06"),
        ("reviewer07@waygo.local", "waygo_reviewer_07"),
        ("reviewer08@waygo.local", "waygo_reviewer_08"),
        ("reviewer09@waygo.local", "waygo_reviewer_09"),
        ("reviewer10@waygo.local", "waygo_reviewer_10"),
        ("reviewer11@waygo.local", "waygo_reviewer_11"),
        ("reviewer12@waygo.local", "waygo_reviewer_12")
    ];

    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

        var users = await EnsureSeedUsersAsync(userManager);

        if (users.Count == 0)
            return;

        var housings = await context.Housings
            .AsNoTracking()
            .Select(h => new
            {
                h.Id,
                h.OwnerId
            })
            .ToListAsync();

        if (housings.Count == 0)
            return;

        var existingPairs = await context.Reviews
            .AsNoTracking()
            .Select(r => new
            {
                r.HousingId,
                r.UserId
            })
            .ToListAsync();

        var existingSet = existingPairs
            .Select(x => $"{x.HousingId}:{x.UserId}")
            .ToHashSet();

        var random = new Random(20260901);
        var now = DateTime.UtcNow;

        foreach (var housing in housings)
        {
            var existingCount = existingPairs.Count(
                x => x.HousingId == housing.Id);

            // Для кожного житла буде приблизно 5–10 відгуків.
            // Якщо частина вже існує — додаємо тільки відсутні.
            var targetCount = 5 + Math.Abs(housing.Id % 6);
            var reviewsToAdd = Math.Max(0, targetCount - existingCount);

            if (reviewsToAdd == 0)
                continue;

            var availableUsers = users
                .Where(user =>
                    user.Id != housing.OwnerId &&
                    !existingSet.Contains(
                        $"{housing.Id}:{user.Id}"))
                .OrderBy(_ => random.Next())
                .Take(reviewsToAdd)
                .ToList();

            foreach (var user in availableUsers)
            {
                var rating = GetWeightedRating(random);

                var review = new Review
                {
                    HousingId = housing.Id,
                    UserId = user.Id,
                    Rating = rating,
                    Comment = Comments[random.Next(Comments.Length)],
                    IsVisible = true,
                    CreatedAt = now
                        .AddDays(-random.Next(1, 181))
                        .AddHours(-random.Next(0, 24))
                        .AddMinutes(-random.Next(0, 60))
                };

                context.Reviews.Add(review);

                existingSet.Add(
                    $"{housing.Id}:{user.Id}");
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task<List<ApplicationUser>> EnsureSeedUsersAsync(
        UserManager<ApplicationUser> userManager)
    {
        var result = new List<ApplicationUser>();

        foreach (var seedUser in SeedUsers)
        {
            var user = await userManager.FindByEmailAsync(
                seedUser.Email);

            if (user is null)
            {
                user = new ApplicationUser
                {
                    UserName = seedUser.UserName,
                    Email = seedUser.Email,
                    EmailConfirmed = true
                };

                var createResult =
                    await userManager.CreateAsync(
                        user,
                        SeedUserPassword);

                if (!createResult.Succeeded)
                {
                    var errors = string.Join(
                        "; ",
                        createResult.Errors.Select(
                            error => error.Description));

                    Console.WriteLine(
                        $"ReviewSeeder: не вдалося створити {seedUser.Email}: {errors}");

                    continue;
                }
            }

            result.Add(user);
        }

        return result;
    }

    private static int GetWeightedRating(Random random)
    {
        var value = random.Next(100);

        // Більш реалістичний розподіл:
        // 5★ — 50%, 4★ — 32%, 3★ — 13%, 2★ — 4%, 1★ — 1%.
        if (value < 50) return 5;
        if (value < 82) return 4;
        if (value < 95) return 3;
        if (value < 99) return 2;

        return 1;
    }
}
