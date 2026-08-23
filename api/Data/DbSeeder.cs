using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            // ── 1. Ролі ───────────────────────────────────────────────────────
            string[] roles = { "Admin", "Manager", "Client" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // ── 2–4. Системні користувачі ───────────────────────────────────
            // Створюємо користувачів, якщо їх ще немає,
            // і гарантуємо, що кожен має потрібну роль.
            var admin = await EnsureUserAsync(
                userManager,
                email: "admin@booking.com",
                fullName: "Admin User",
                password: "Admin123!",
                role: "Admin"
            );

            var manager = await EnsureUserAsync(
                userManager,
                email: "manager@booking.com",
                fullName: "Manager User",
                password: "Manager123!",
                role: "Manager"
            );

            var client = await EnsureUserAsync(
                userManager,
                email: "client@booking.com",
                fullName: "Client User",
                password: "Client123!",
                role: "Client"
            );

            // ── 5. Кімнати ───────────────────────────────────────────────────
            if (!context.Rooms.Any())
            {
                context.Rooms.AddRange(
                    new Room
                    {
                        Name = "Конференц-зал A",
                        Description = "Великий зал для конференцій та зустрічей",
                        Capacity = 20,
                        PricePerHour = 500,
                        Location = "1 поверх"
                    },
                    new Room
                    {
                        Name = "Переговорна B",
                        Description = "Невелика переговорна кімната",
                        Capacity = 6,
                        PricePerHour = 200,
                        Location = "2 поверх"
                    },
                    new Room
                    {
                        Name = "Коворкінг C",
                        Description = "Відкритий простір для роботи в групах",
                        Capacity = 12,
                        PricePerHour = 350,
                        Location = "3 поверх"
                    }
                );
                await context.SaveChangesAsync();
            }

            // ── 6. Житло (Housing) ────────────────────────────────────────────
            if (!context.Housings.Any())
            {
                var housings = new List<Housing>
                {
                    new Housing
                    {
                        Title = "Затишна студія в центрі Києва",
                        Description = "Сучасна студія з усіма зручностями. Поруч метро, ресторани та магазини. Ідеально для ділових поїздок або романтичного відпочинку.",
                        Type = HousingType.Studio,
                        Address = "вул. Хрещатик, 15",
                        City = "Київ",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 1200,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Простора 2-кімнатна квартира на Подолі",
                        Description = "Квартира в самому серці Подолу. Є все необхідне: кухня, Wi-Fi, пральна машина. Чудовий вид на Дніпро.",
                        Type = HousingType.Apartment,
                        Address = "вул. Сагайдачного, 7",
                        City = "Київ",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 1800,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Будинок з басейном у Львові",
                        Description = "Приватний будинок з басейном та садом. Ідеально для сімейного відпочинку. До центру Львова 10 хвилин на авто.",
                        Type = HousingType.House,
                        Address = "вул. Личаківська, 45",
                        City = "Львів",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 3500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти біля моря в Одесі",
                        Description = "Сучасні апартаменти за 5 хвилин від пляжу. Панорамний вид на море. Є парковка та кондиціонер.",
                        Type = HousingType.Apartment,
                        Address = "Французький бульвар, 23",
                        City = "Одеса",
                        Rooms = 2,
                        MaxGuests = 5,
                        PricePerNight = 2200,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Вілла з терасою в Карпатах",
                        Description = "Розкішна вілла в горах з каміном та панорамною терасою. Ідеально для зимового відпочинку та лижного сезону.",
                        Type = HousingType.Villa,
                        Address = "с. Буковель, вул. Гірська, 1",
                        City = "Буковель",
                        Rooms = 5,
                        MaxGuests = 10,
                        PricePerNight = 6000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Кімната в гостьовому будинку — Харків",
                        Description = "Затишна кімната зі спільною кухнею та ванною. Бюджетний варіант у хорошому районі. Включений сніданок.",
                        Type = HousingType.Room,
                        Address = "вул. Сумська, 30",
                        City = "Харків",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 600,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Лофт-апартаменти в Дніпрі",
                        Description = "Стильний лофт у відремонтованому промисловому просторі. Висока стеля, цегляні стіни, сучасний дизайн.",
                        Type = HousingType.Apartment,
                        Address = "вул. Артема, 12",
                        City = "Дніпро",
                        Rooms = 2,
                        MaxGuests = 3,
                        PricePerNight = 1500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Котедж на березі озера — Закарпаття",
                        Description = "Дерев'яний котедж прямо на березі гірського озера. Рибалка, сауна, мангал. Тиша і природа.",
                        Type = HousingType.House,
                        Address = "с. Синевир",
                        City = "Закарпаття",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 2800,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти з видом на Ейфелеву вежу",
                        Description = "Стильні апартаменти у центрі Парижа. Поруч музеї, кафе та головні визначні місця міста.",
                        Type = HousingType.Apartment,
                        Address = "Rue de Rivoli, 25",
                        City = "Париж, Франція",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 4500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Затишна квартира біля Колізею",
                        Description = "Комфортне житло в історичному центрі Риму. Ідеально для туристів.",
                        Type = HousingType.Apartment,
                        Address = "Via Cavour, 40",
                        City = "Рим, Італія",
                        Rooms = 2,
                        MaxGuests = 3,
                        PricePerNight = 3200,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Лофт у центрі Берліна",
                        Description = "Сучасний лофт поруч із кафе, галереями та метро.",
                        Type = HousingType.Studio,
                        Address = "Friedrichstraße, 88",
                        City = "Берлін, Німеччина",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 2800,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля Сагради Фамілії",
                        Description = "Світлі апартаменти у центрі Барселони з балконом.",
                        Type = HousingType.Apartment,
                        Address = "Carrer Mallorca, 300",
                        City = "Барселона, Іспанія",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 3000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Будинок біля океану",
                        Description = "Просторий будинок для сімейного відпочинку біля пляжу.",
                        Type = HousingType.House,
                        Address = "Rua do Sol, 12",
                        City = "Лісабон, Португалія",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 4200,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Студія біля Альп",
                        Description = "Невелика квартира з чудовим видом на гори.",
                        Type = HousingType.Studio,
                        Address = "Bahnhofstrasse, 15",
                        City = "Цюрих, Швейцарія",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 5000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти біля Старого міста",
                        Description = "Комфортна квартира поруч з історичними пам'ятками.",
                        Type = HousingType.Apartment,
                        Address = "Gamla Stan, 10",
                        City = "Стокгольм, Швеція",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 3800,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Скандинавський будинок біля моря",
                        Description = "Затишний будинок з терасою та сауною.",
                        Type = HousingType.House,
                        Address = "Havnevej, 22",
                        City = "Копенгаген, Данія",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 4500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Пентхаус у центрі Лондона",
                        Description = "Розкішні апартаменти з панорамним видом на місто.",
                        Type = HousingType.Villa,
                        Address = "Baker Street, 55",
                        City = "Лондон, Велика Британія",
                        Rooms = 3,
                        MaxGuests = 5,
                        PricePerNight = 7500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля Центрального парку",
                        Description = "Комфортне житло для туристів і бізнес-поїздок.",
                        Type = HousingType.Apartment,
                        Address = "5th Avenue, 100",
                        City = "Нью-Йорк, США",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 9000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Студія в Токіо",
                        Description = "Компактна сучасна студія поруч із метро.",
                        Type = HousingType.Studio,
                        Address = "Shinjuku Street, 20",
                        City = "Токіо, Японія",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 3500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти біля моря",
                        Description = "Сучасні апартаменти з видом на океан.",
                        Type = HousingType.Apartment,
                        Address = "Bondi Road, 15",
                        City = "Сідней, Австралія",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 6500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Вілла у тропічному стилі",
                        Description = "Приватна вілла з басейном та садом.",
                        Type = HousingType.Villa,
                        Address = "Beach Road, 8",
                        City = "Балі, Індонезія",
                        Rooms = 5,
                        MaxGuests = 10,
                        PricePerNight = 5500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти в центрі Праги",
                        Description = "Затишне житло поруч із Карловим мостом.",
                        Type = HousingType.Apartment,
                        Address = "Karlova, 18",
                        City = "Прага, Чехія",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 2300,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Сучасні апартаменти біля моря",
                        Description = "Світла квартира з терасою та видом на Середземне море.",
                        Type = HousingType.Apartment,
                        Address = "Kaleici Street, 14",
                        City = "Анталія, Туреччина",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 1800,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Вілла з басейном на острові",
                        Description = "Розкішна вілла для відпочинку біля пляжу.",
                        Type = HousingType.Villa,
                        Address = "Oia Road, 5",
                        City = "Санторіні, Греція",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 7000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля каналів",
                        Description = "Затишні апартаменти у центрі міста.",
                        Type = HousingType.Apartment,
                        Address = "Prinsengracht, 40",
                        City = "Амстердам, Нідерланди",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 5000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Гірський будинок у Тіролі",
                        Description = "Дерев'яний будинок біля лижних трас.",
                        Type = HousingType.House,
                        Address = "Alpenstrasse, 20",
                        City = "Інсбрук, Австрія",
                        Rooms = 5,
                        MaxGuests = 10,
                        PricePerNight = 5500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля Вавельського замку",
                        Description = "Комфортне житло в історичному районі.",
                        Type = HousingType.Apartment,
                        Address = "Grodzka, 15",
                        City = "Краків, Польща",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 1600,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Скандинавський котедж у фіордах",
                        Description = "Будинок серед природи з видом на гори та воду.",
                        Type = HousingType.House,
                        Address = "Fjordvegen, 12",
                        City = "Берген, Норвегія",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 6000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Мінімалістична квартира біля озера",
                        Description = "Світлі апартаменти у фінському стилі.",
                        Type = HousingType.Apartment,
                        Address = "Esplanadi, 8",
                        City = "Гельсінкі, Фінляндія",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 3500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Розкішний пентхаус у Дубаї",
                        Description = "Апартаменти з видом на хмарочоси та море.",
                        Type = HousingType.Villa,
                        Address = "Marina Walk, 30",
                        City = "Дубай, ОАЕ",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 12000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти біля затоки",
                        Description = "Сучасна квартира у престижному районі.",
                        Type = HousingType.Apartment,
                        Address = "Marina Boulevard, 12",
                        City = "Сінгапур",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 8000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Будинок у виноградниках",
                        Description = "Затишний будинок для спокійного відпочинку.",
                        Type = HousingType.House,
                        Address = "Wine Road, 25",
                        City = "Кейптаун, ПАР",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 3000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Стильна квартира в центрі Відня",
                        Description = "Апартаменти поруч з оперою та музеями.",
                        Type = HousingType.Apartment,
                        Address = "Ringstrasse, 50",
                        City = "Відень, Австрія",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 3300,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Будинок біля озера Луїза",
                        Description = "Комфортний будинок у канадських горах.",
                        Type = HousingType.House,
                        Address = "Lake Louise Road, 7",
                        City = "Калгарі, Канада",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 5000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти в Сан-Франциско",
                        Description = "Модерна квартира поруч із центром міста.",
                        Type = HousingType.Apartment,
                        Address = "Market Street, 200",
                        City = "Сан-Франциско, США",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 8500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Студія в Лос-Анджелесі",
                        Description = "Компактна студія біля пляжу.",
                        Type = HousingType.Studio,
                        Address = "Santa Monica Blvd, 45",
                        City = "Лос-Анджелес, США",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 6500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля озера Мічиган",
                        Description = "Зручне житло для роботи та відпочинку.",
                        Type = HousingType.Apartment,
                        Address = "Michigan Avenue, 120",
                        City = "Чикаго, США",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 6000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Вілла біля океану",
                        Description = "Простора вілла з басейном.",
                        Type = HousingType.Villa,
                        Address = "Ocean Drive, 90",
                        City = "Маямі, США",
                        Rooms = 5,
                        MaxGuests = 10,
                        PricePerNight = 9000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля храмів",
                        Description = "Затишні апартаменти для туристів.",
                        Type = HousingType.Apartment,
                        Address = "Old Town Road, 18",
                        City = "Бангкок, Таїланд",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 1400,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Тропічний будинок біля пляжу",
                        Description = "Будинок серед пальм із приватним двориком.",
                        Type = HousingType.House,
                        Address = "Beach Road, 55",
                        City = "Пхукет, Таїланд",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 2500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти у центрі Сеула",
                        Description = "Сучасне житло поруч із метро.",
                        Type = HousingType.Apartment,
                        Address = "Gangnam Street, 33",
                        City = "Сеул, Південна Корея",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 4000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Будинок біля вулканів",
                        Description = "Незвичайний будинок серед природи.",
                        Type = HousingType.House,
                        Address = "Volcano Road, 9",
                        City = "Окленд, Нова Зеландія",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 4500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти біля Гранд-Базару",
                        Description = "Затишна квартира у старому місті. Поруч ресторани, магазини та історичні пам'ятки.",
                        Type = HousingType.Apartment,
                        Address = "Divan Yolu Street, 25",
                        City = "Стамбул, Туреччина",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 1700,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Квартира біля гірського озера",
                        Description = "Сучасні апартаменти з панорамним видом на природу.",
                        Type = HousingType.Apartment,
                        Address = "Lake Road, 14",
                        City = "Женева, Швейцарія",
                        Rooms = 2,
                        MaxGuests = 3,
                        PricePerNight = 5200,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Затишний будинок у передмісті",
                        Description = "Просторий будинок із садом. Підходить для сімейного проживання.",
                        Type = HousingType.House,
                        Address = "Maple Avenue, 44",
                        City = "Торонто, Канада",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 5500,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Лофт у центрі Мадрида",
                        Description = "Стильний лофт поруч із площами, музеями та ресторанами.",
                        Type = HousingType.Studio,
                        Address = "Gran Via, 70",
                        City = "Мадрид, Іспанія",
                        Rooms = 1,
                        MaxGuests = 2,
                        PricePerNight = 2600,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Будиночок біля моря",
                        Description = "Невеликий приватний будинок для відпочинку біля узбережжя.",
                        Type = HousingType.House,
                        Address = "Coastal Road, 18",
                        City = "Спліт, Хорватія",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 3000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Апартаменти біля замку",
                        Description = "Комфортна квартира у центрі старого міста.",
                        Type = HousingType.Apartment,
                        Address = "Old Town Square, 6",
                        City = "Братислава, Словаччина",
                        Rooms = 2,
                        MaxGuests = 4,
                        PricePerNight = 1800,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Гірський котедж у Шотландії",
                        Description = "Тихий котедж серед гір та озер. Ідеально для відпочинку.",
                        Type = HousingType.House,
                        Address = "Highland Road, 11",
                        City = "Единбург, Велика Британія",
                        Rooms = 3,
                        MaxGuests = 6,
                        PricePerNight = 4200,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    },
                    new Housing
                    {
                        Title = "Пляжна вілла на Мальдівах",
                        Description = "Ексклюзивна вілла з виходом до океану та приватною терасою.",
                        Type = HousingType.Villa,
                        Address = "Island Resort Road, 1",
                        City = "Мале, Мальдіви",
                        Rooms = 4,
                        MaxGuests = 8,
                        PricePerNight = 15000,
                        IsAvailable = true,
                        OwnerId = admin.Id
                    }
                };

                context.Housings.AddRange(housings);
                await context.SaveChangesAsync();

                // Папка з фотографіями
                var imagesFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/images/apartments"
                );

                // Отримуємо всі фото з папки
                var imageFiles = Directory
                    .GetFiles(imagesFolder)
                    .Where(x =>
                        x.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                        x.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                        x.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
                    .Select(Path.GetFileName)
                    .ToList();


                if (!imageFiles.Any())
                {
                    throw new Exception("Фото не знайдені в папці: " + imagesFolder);
                }


                var savedHousings = await context.Housings.ToListAsync();

                var photos = new List<HousingPhoto>();

                var random = new Random();


                foreach (var housing in savedHousings)
                {
                    // перемішуємо список фото
                    var randomPhotos = imageFiles
                        .OrderBy(x => random.Next())
                        .Take(3)
                        .ToList();


                    // Головне фото
                    photos.Add(new HousingPhoto
                    {
                        HousingId = housing.Id,
                        FilePath = $"/images/apartments/{randomPhotos[0]}",
                        OriginalName = randomPhotos[0],
                        IsMain = true,
                        UploadedAt = DateTime.UtcNow
                    });


                    // 2 додаткові фото
                    foreach (var photo in randomPhotos.Skip(1))
                    {
                        photos.Add(new HousingPhoto
                        {
                            HousingId = housing.Id,
                            FilePath = $"/images/apartments/{photo}",
                            OriginalName = photo,
                            IsMain = false,
                            UploadedAt = DateTime.UtcNow
                        });
                    }
                }

                // додаємо в БД
                await context.HousingPhotos.AddRangeAsync(photos);
                await context.SaveChangesAsync();
            }

            // ── 7. Destinations ───────────────────────────────────────────────
            if (!context.Destinations.Any())
            {
                var destinations = new List<Destination>
            {
                // =========================
                // Європа / світ
                // =========================

                new Destination
                {
                    Slug = "paris",
                    City = "paris",
                    Country = "france",
                    CountryCode = "FR",
                    Description = "The city of love, art and iconic architecture.",
                    ImagePath = "/images/cities/paris.jpg",
                    IsPopular = true,
                    ViewCount = 52000
                },

                new Destination
                {
                    Slug = "london",
                    City = "london",
                    Country = "united kingdom",
                    CountryCode = "GB",
                    Description = "A historic city with famous landmarks and modern culture.",
                    ImagePath = "/images/cities/london.jpg",
                    IsPopular = true,
                    ViewCount = 50000
                },

                new Destination
                {
                    Slug = "rome",
                    City = "rome",
                    Country = "italy",
                    CountryCode = "IT",
                    Description = "Ancient history, amazing cuisine and unforgettable places.",
                    ImagePath = "/images/cities/rome.jpg",
                    IsPopular = true,
                    ViewCount = 48000
                },

                new Destination
                {
                    Slug = "barcelona",
                    City = "barcelona",
                    Country = "spain",
                    CountryCode = "ES",
                    Description = "Beautiful architecture, beaches and Mediterranean atmosphere.",
                    ImagePath = "/images/cities/barcelona.jpg",
                    IsPopular = true,
                    ViewCount = 47000
                },

                new Destination
                {
                    Slug = "berlin",
                    City = "berlin",
                    Country = "germany",
                    CountryCode = "DE",
                    Description = "A modern European capital full of history and creativity.",
                    ImagePath = "/images/cities/berlin.jpg",
                    IsPopular = true,
                    ViewCount = 45000
                },

                new Destination
                {
                    Slug = "vienna",
                    City = "vienna",
                    Country = "austria",
                    CountryCode = "AT",
                    Description = "Elegant architecture, music and imperial heritage.",
                    ImagePath = "/images/cities/vienna.jpg",
                    IsPopular = true,
                    ViewCount = 43000
                },

                new Destination
                {
                    Slug = "budapest",
                    City = "budapest",
                    Country = "hungary",
                    CountryCode = "HU",
                    Description = "Beautiful city with thermal baths and stunning views.",
                    ImagePath = "/images/cities/budapest.jpg",
                    IsPopular = true,
                    ViewCount = 42000
                },

                new Destination
                {
                    Slug = "prague",
                    City = "prague",
                    Country = "czech republic",
                    CountryCode = "CZ",
                    Description = "A magical city with castles and historic streets.",
                    ImagePath = "/images/cities/prague.jpg",
                    IsPopular = true,
                    ViewCount = 41000
                },

                new Destination
                {
                    Slug = "amsterdam",
                    City = "amsterdam",
                    Country = "netherlands",
                    CountryCode = "NL",
                    Description = "Canals, museums and unique European atmosphere.",
                    ImagePath = "/images/cities/amsterdam.jpg",
                    IsPopular = true,
                    ViewCount = 40000
                },

                new Destination
                {
                    Slug = "lisbon",
                    City = "lisbon",
                    Country = "portugal",
                    CountryCode = "PT",
                    Description = "Sunny streets, ocean views and colorful neighborhoods.",
                    ImagePath = "/images/cities/lisbon.jpg",
                    IsPopular = true,
                    ViewCount = 39000
                },

                new Destination
                {
                    Slug = "madrid",
                    City = "madrid",
                    Country = "spain",
                    CountryCode = "ES",
                    Description = "A vibrant capital with culture, food and nightlife.",
                    ImagePath = "/images/cities/madrid.jpg",
                    IsPopular = true,
                    ViewCount = 38000
                },

                new Destination
                {
                    Slug = "athens",
                    City = "athens",
                    Country = "greece",
                    CountryCode = "GR",
                    Description = "Ancient monuments combined with modern city life.",
                    ImagePath = "/images/cities/athens.jpg",
                    IsPopular = true,
                    ViewCount = 37000
                },

                new Destination
                {
                    Slug = "zurich",
                    City = "zurich",
                    Country = "switzerland",
                    CountryCode = "CH",
                    Description = "A clean and beautiful city surrounded by nature.",
                    ImagePath = "/images/cities/zurich.jpg",
                    IsPopular = true,
                    ViewCount = 36000
                },

                new Destination
                {
                    Slug = "oslo",
                    City = "oslo",
                    Country = "norway",
                    CountryCode = "NO",
                    Description = "Modern city surrounded by mountains and fjords.",
                    ImagePath = "/images/cities/oslo.jpg",
                    IsPopular = true,
                    ViewCount = 34000
                },

                new Destination
                {
                    Slug = "copenhagen",
                    City = "copenhagen",
                    Country = "denmark",
                    CountryCode = "DK",
                    Description = "A stylish Nordic city with cozy atmosphere.",
                    ImagePath = "/images/cities/copenhagen.jpg",
                    IsPopular = true,
                    ViewCount = 33000
                },

                new Destination
                {
                    Slug = "helsinki",
                    City = "helsinki",
                    Country = "finland",
                    CountryCode = "FI",
                    Description = "A peaceful Nordic capital with unique design.",
                    ImagePath = "/images/cities/helsinki.jpg",
                    IsPopular = true,
                    ViewCount = 32000
                },

                new Destination
                {
                    Slug = "warsaw",
                    City = "warsaw",
                    Country = "poland",
                    CountryCode = "PL",
                    Description = "A dynamic city combining history and modern life.",
                    ImagePath = "/images/cities/warsaw.jpg",
                    IsPopular = true,
                    ViewCount = 31000
                },

                new Destination
                {
                    Slug = "krakow",
                    City = "krakow",
                    Country = "poland",
                    CountryCode = "PL",
                    Description = "Historic streets, castles and traditional culture.",
                    ImagePath = "/images/cities/krakow.jpg",
                    IsPopular = true,
                    ViewCount = 30000
                },

                new Destination
                {
                    Slug = "munich",
                    City = "munich",
                    Country = "germany",
                    CountryCode = "DE",
                    Description = "Bavarian traditions, architecture and festivals.",
                    ImagePath = "/images/cities/munich.jpg",
                    IsPopular = true,
                    ViewCount = 29000
                },

                new Destination
                {
                    Slug = "venice",
                    City = "venice",
                    Country = "italy",
                    CountryCode = "IT",
                    Description = "A unique city of canals and romantic views.",
                    ImagePath = "/images/cities/venice.jpg",
                    IsPopular = true,
                    ViewCount = 28000
                },

                new Destination
                {
                    Slug = "florence",
                    City = "florence",
                    Country = "italy",
                    CountryCode = "IT",
                    Description = "The birthplace of Renaissance art and culture.",
                    ImagePath = "/images/cities/florence.jpg",
                    IsPopular = true,
                    ViewCount = 27000
                },

                new Destination
                {
                    Slug = "dubrovnik",
                    City = "dubrovnik",
                    Country = "croatia",
                    CountryCode = "HR",
                    Description = "A beautiful coastal city with historic walls.",
                    ImagePath = "/images/cities/dubrovnik.jpg",
                    IsPopular = true,
                    ViewCount = 26000
                },

                new Destination
                {
                    Slug = "istanbul",
                    City = "istanbul",
                    Country = "turkey",
                    CountryCode = "TR",
                    Description = "A city connecting Europe and Asia.",
                    ImagePath = "/images/cities/istanbul.jpg",
                    IsPopular = true,
                    ViewCount = 25000
                },

                new Destination
                {
                    Slug = "new-york",
                    City = "new york",
                    Country = "usa",
                    CountryCode = "US",
                    Description = "A global city famous for culture and entertainment.",
                    ImagePath = "/images/cities/new-york.jpg",
                    IsPopular = true,
                    ViewCount = 60000
                },


                // =========================
                // Україна
                // =========================

                new Destination
                {
                    Slug = "kyiv",
                    City = "kyiv",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "The capital of Ukraine with historic landmarks, vibrant culture and modern city life.",
                    ImagePath = "/images/cities/kyiv.jpg",
                    IsPopular = true,
                    ViewCount = 60000
                },

                new Destination
                {
                    Slug = "lviv",
                    City = "lviv",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A historic city famous for its architecture, coffee culture and charming old town.",
                    ImagePath = "/images/cities/lviv.jpg",
                    IsPopular = true,
                    ViewCount = 55000
                },

                new Destination
                {
                    Slug = "odesa",
                    City = "odesa",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A Black Sea city known for its architecture, seaside atmosphere and lively streets.",
                    ImagePath = "/images/cities/odesa.jpg",
                    IsPopular = true,
                    ViewCount = 48000
                },

                new Destination
                {
                    Slug = "kharkiv",
                    City = "kharkiv",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "One of Ukraine's largest cities, known for its architecture, parks and cultural life.",
                    ImagePath = "/images/cities/kharkiv.jpg",
                    IsPopular = false,
                    ViewCount = 30000
                },

                new Destination
                {
                    Slug = "dnipro",
                    City = "dnipro",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A major Ukrainian city located along the Dnipro River with a modern waterfront.",
                    ImagePath = "/images/cities/dnipro.jpg",
                    IsPopular = false,
                    ViewCount = 28000
                },

                new Destination
                {
                    Slug = "ternopil",
                    City = "ternopil",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A cozy western Ukrainian city known for its large lake, parks and relaxed atmosphere.",
                    ImagePath = "/images/cities/ternopil.jpg",
                    IsPopular = false,
                    ViewCount = 20000
                },

                new Destination
                {
                    Slug = "lutsk",
                    City = "lutsk",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A historic city in western Ukraine known for Lubart's Castle and its charming old town.",
                    ImagePath = "/images/cities/lutsk.jpg",
                    IsPopular = false,
                    ViewCount = 19000
                },

                new Destination
                {
                    Slug = "rivne",
                    City = "rivne",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A welcoming western Ukrainian city with green parks, cultural attractions and a relaxed atmosphere.",
                    ImagePath = "/images/cities/rivne.jpg",
                    IsPopular = false,
                    ViewCount = 18000
                },

                new Destination
                {
                    Slug = "ivano-frankivsk",
                    City = "ivano-frankivsk",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A cozy western Ukrainian city and a popular gateway to the Carpathian Mountains.",
                    ImagePath = "/images/cities/ivano-frankivsk.jpg",
                    IsPopular = true,
                    ViewCount = 24000
                },

                new Destination
                {
                    Slug = "vinnytsia",
                    City = "vinnytsia",
                    Country = "ukraine",
                    CountryCode = "UA",
                    Description = "A comfortable central Ukrainian city known for its parks, riverfront and historic architecture.",
                    ImagePath = "/images/cities/vinnytsia.jpg",
                    IsPopular = false,
                    ViewCount = 22000
                },


                // =========================
                // Швеція
                // =========================

                new Destination
                {
                    Slug = "stockholm",
                    City = "stockholm",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "The capital of Sweden, spread across islands and known for its historic old town and waterfront.",
                    ImagePath = "/images/cities/stockholm.jpg",
                    IsPopular = true,
                    ViewCount = 60000
                },

                new Destination
                {
                    Slug = "gothenburg",
                    City = "gothenburg",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A lively west coast city known for its canals, seafood, culture and nearby archipelago.",
                    ImagePath = "/images/cities/gothenburg.jpg",
                    IsPopular = true,
                    ViewCount = 45000
                },

                new Destination
                {
                    Slug = "malmo",
                    City = "malmo",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A modern southern Swedish city known for its parks, architecture and proximity to Copenhagen.",
                    ImagePath = "/images/cities/malmo.jpg",
                    IsPopular = true,
                    ViewCount = 42000
                },

                new Destination
                {
                    Slug = "uppsala",
                    City = "uppsala",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A historic university city known for Uppsala Cathedral, museums and academic atmosphere.",
                    ImagePath = "/images/cities/uppsala.jpg",
                    IsPopular = false,
                    ViewCount = 25000
                },

                new Destination
                {
                    Slug = "lund",
                    City = "lund",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A charming university city with medieval history, cobbled streets and a famous cathedral.",
                    ImagePath = "/images/cities/lund.jpg",
                    IsPopular = false,
                    ViewCount = 22000
                },

                new Destination
                {
                    Slug = "kiruna",
                    City = "kiruna",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A northern Arctic city popular for winter adventures, northern lights and Lapland landscapes.",
                    ImagePath = "/images/cities/kiruna.jpg",
                    IsPopular = true,
                    ViewCount = 30000
                },

                new Destination
                {
                    Slug = "linkoping",
                    City = "linkoping",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A modern Swedish city known for its university, technology industry and aviation heritage.",
                    ImagePath = "/images/cities/linkoping.jpg",
                    IsPopular = false,
                    ViewCount = 18000
                },

                new Destination
                {
                    Slug = "norrkoping",
                    City = "norrkoping",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A historic Swedish city known for its industrial heritage, riverside architecture and cultural scene.",
                    ImagePath = "/images/cities/norrkoping.jpg",
                    IsPopular = false,
                    ViewCount = 17000
                },

                new Destination
                {
                    Slug = "jonkoping",
                    City = "jonkoping",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A scenic city located on the southern shore of Lake Vattern with beautiful waterfront views.",
                    ImagePath = "/images/cities/jonkoping.jpg",
                    IsPopular = true,
                    ViewCount = 21000
                },

                new Destination
                {
                    Slug = "valdemarsvik",
                    City = "valdemarsvik",
                    Country = "sweden",
                    CountryCode = "SE",
                    Description = "A charming coastal town in southeastern Sweden known for its archipelago, peaceful nature and scenic waterfront.",
                    ImagePath = "/images/cities/valdemarsvik.jpg",
                    IsPopular = false,
                    ViewCount = 10000
                }

            };

                await context.Destinations.AddRangeAsync(destinations);
                await context.SaveChangesAsync();
            }


            // ── 8. Тестове бронювання кімнати ────────────────────────────────
            if (!context.Bookings.Any() && client != null)
            {
                var firstRoom = context.Rooms.First();
                context.Bookings.Add(new Booking
                {
                    UserId = client.Id,
                    RoomId = firstRoom.Id,
                    StartTime = DateTime.UtcNow.AddDays(1).Date.AddHours(10),
                    EndTime = DateTime.UtcNow.AddDays(1).Date.AddHours(12),
                    Status = BookingStatus.Confirmed
                });
                await context.SaveChangesAsync();
            }

            // ── 9. Тестове бронювання житла ──────────────────────────────────
            if (!context.HousingBookings.Any() && client != null)
            {
                var firstHousing = await context.Housings.FirstOrDefaultAsync();
                if (firstHousing != null)
                {
                    context.HousingBookings.Add(new HousingBooking
                    {
                        UserId = client.Id,
                        HousingId = firstHousing.Id,
                        CheckIn = DateTime.UtcNow.AddDays(3).Date,
                        CheckOut = DateTime.UtcNow.AddDays(6).Date,
                        GuestsCount = 2,
                        Status = BookingStatus.Confirmed
                    });
                    await context.SaveChangesAsync();
                }
            }
        }
        // ─────────────────────────────────────────────────────────────────────
        // Допоміжний метод для створення тестових користувачів
        // ─────────────────────────────────────────────────────────────────────
        private static async Task<ApplicationUser> EnsureUserAsync(
            UserManager<ApplicationUser> userManager,
            string email,
            string fullName,
            string password,
            string role)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = fullName,
                    EmailConfirmed = true
                };

                var createResult = await userManager.CreateAsync(user, password);

                if (!createResult.Succeeded)
                {
                    var errors = string.Join(
                        "; ",
                        createResult.Errors.Select(error => error.Description)
                    );

                    throw new Exception(
                        $"Не вдалося створити користувача {email}: {errors}"
                    );
                }
            }

            if (!await userManager.IsInRoleAsync(user, role))
            {
                var roleResult = await userManager.AddToRoleAsync(user, role);

                if (!roleResult.Succeeded)
                {
                    var errors = string.Join(
                        "; ",
                        roleResult.Errors.Select(error => error.Description)
                    );

                    throw new Exception(
                        $"Не вдалося додати роль {role} користувачу {email}: {errors}"
                    );
                }
            }

            return user;
        }

    }
}
