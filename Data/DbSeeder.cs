using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Identity;

namespace DyplomBooking2026.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            string[] roles = { "Admin", "Manager", "Client" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            if (await userManager.FindByEmailAsync("admin@booking.com") == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = "admin@booking.com",
                    Email = "admin@booking.com",
                    FullName = "Admin User",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }

            if (await userManager.FindByEmailAsync("manager@booking.com") == null)
            {
                var manager = new ApplicationUser
                {
                    UserName = "manager@booking.com",
                    Email = "manager@booking.com",
                    FullName = "Manager User",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(manager, "Manager123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(manager, "Manager");
                }
            }

            ApplicationUser? client = await userManager.FindByEmailAsync("client@booking.com");
            if (client == null)
            {
                client = new ApplicationUser
                {
                    UserName = "client@booking.com",
                    Email = "client@booking.com",
                    FullName = "Client User",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(client, "Client123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(client, "Client");
                }
            }

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
        }
    }
}
