using DyplomBooking2026.Models;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Data;

public static class DbExcursionSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Excursions.AnyAsync())
            return;

        var excursions = new List<Excursion>
        {
            new()
            {
                Title = "Концерт Фридерика",
                City = "Львів",
                ImagePath = "/images/items/excursions/концерт_фридерика.jpg",
                Price = 800,
                Category = "Культура",
                Duration = "1-2 години",
                Rating = 9.8,
                Description = "Музична подія у атмосферній залі Львова"
            },

            new()
            {
                Title = "Музей світу ілюзій",
                City = "Львів",
                ImagePath = "/images/items/excursions/музей_світ_ілюзій.png",
                Price = 280,
                Category = "Розваги",
                Duration = "1-2 години",
                Rating = 9.9,
                Description = "Інтерактивний музей для дітей та дорослих"
            },

            new()
            {
                Title = "Східні Горгани",
                City = "Карпати",
                ImagePath = "/images/items/excursions/східні_горгани.png",
                Price = 2000,
                Category = "Природа",
                Duration = "Повний день",
                Rating = 9.9,
                Description = "Гірський маршрут з неймовірними краєвидами"
            },

            new()
            {
                Title = "Родельбан",
                City = "Львівська область",
                ImagePath = "/images/items/excursions/родельбан.png",
                Price = 600,
                Category = "Розваги",
                Duration = "1-2 години",
                Rating = 9.1,
                Description = "Активний відпочинок для всієї родини"
            },

            new()
            {
                Title = "Палац Потоцьких",
                City = "Львів",
                ImagePath = "/images/items/excursions/палац_потоцьких.jpg",
                Price = 400,
                Category = "Культура",
                Duration = "1-2 години",
                Rating = 9.5,
                Description = "Екскурсія одним із найвідоміших палаців Львова"
            },

            new()
            {
                Title = "Екскурсія замком",
                City = "Львівщина",
                ImagePath = "/images/items/excursions/екскурсія_замком.png",
                Price = 800,
                Category = "Історія",
                Duration = "3-5 годин",
                Rating = 9.6,
                Description = "Подорож старовинними замками Львівщини"
            },

            new()
            {
                Title = "Високий замок",
                City = "Львів",
                ImagePath = "/images/items/excursions/високий_замок.png",
                Price = 300,
                Category = "Історія",
                Duration = "1-2 години",
                Rating = 9.7,
                Description = "Панорамний вид на Львів та його історію"
            },

            new()
            {
                Title = "Водоспад Шипіт",
                City = "Карпати",
                ImagePath = "/images/items/excursions/водоспад_шипіт.png",
                Price = 850,
                Category = "Природа",
                Duration = "Повний день",
                Rating = 10,
                Description = "Подорож до одного з найкрасивіших водоспадів України"
            },

            new()
            {
                Title = "Чани в Карпатах",
                City = "Карпати",
                ImagePath = "/images/items/excursions/чани.jpg",
                Price = 1250,
                Category = "Розваги",
                Duration = "3-5 годин",
                Rating = 9.7,
                Description = "Відпочинок у гарячих чанах серед гір"
            },

            new()
            {
                Title = "Подорож на джипах",
                City = "Карпати",
                ImagePath = "/images/items/excursions/поїздка_на_джипах.png",
                Price = 2500,
                Category = "Розваги",
                Duration = "Повний день",
                Rating = 9.5,
                Description = "Екстремальна подорож гірськими маршрутами"
            },

            new()
            {
                Title = "Майстер-клас від Юрашки",
                City = "Львів",
                ImagePath = "/images/items/excursions/майстерклас_від_юрашки.jpg",
                Price = 800,
                Category = "Культура",
                Duration = "1-2 години",
                Rating = 9.7,
                Description = "Творчий майстер-клас для дітей та дорослих"
            },

            new()
            {
                Title = "Піднімімося на Ратушу",
                City = "Львів",
                ImagePath = "/images/items/excursions/піднімися_на_ратушу.jpg",
                Price = 450,
                Category = "Історія",
                Duration = "1-2 години",
                Rating = 9.7,
                Description = "Панорамний вид на старе місто"
            },

            new()
            {
                Title = "Італійський дворик",
                City = "Львів",
                ImagePath = "/images/items/excursions/італійський_замок.jpg",
                Price = 300,
                Category = "Історія",
                Duration = "1-2 години",
                Rating = 9.4,
                Description = "Атмосферне місце у центрі Львова"
            },

            new()
            {
                Title = "Вистава в Оперному театрі",
                City = "Львів",
                ImagePath = "/images/items/excursions/вистава_в_оперному_театрі.jpg",
                Price = 500,
                Category = "Культура",
                Duration = "3-5 годин",
                Rating = 9.8,
                Description = "Незабутній вечір у Львівській опері"
            },

            new()
            {
                Title = "Екскурсія старим Львовом",
                City = "Львів",
                ImagePath = "/images/items/excursions/екскурсія_площею_ринок.jpg",
                Price = 500,
                Category = "Історія",
                Duration = "3-5 годин",
                Rating = 9.8,
                Description = "Прогулянка історичним центром міста"
            }
        };

        await context.Excursions.AddRangeAsync(excursions);
        await context.SaveChangesAsync();
    }
}