using DyplomBooking2026.Data;
using DyplomBooking2026.Models;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Data;

public static class DbCarSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context)
    {
        if (await context.Cars.AnyAsync())
            return;


        var cars = new List<Car>
        {
            new()
            {
                Brand = "Dacia",
                Model = "Sandero",
                City = "Львів",
                ImagePath = "/images/cars/sandero_lrg.jpg",
                PricePerDay = 230,
                Transmission = "Automatic",
                FuelType = "Petrol",
                Seats = 5,
                Rating = 9.7,
                Available = true
            },

            new()
            {
                Brand = "Renault",
                Model = "Clio",
                City = "Львів",
                ImagePath = "/images/cars/clio_lrg.jpg",
                PricePerDay = 430,
                Transmission = "Automatic",
                FuelType = "Petrol",
                Seats = 5,
                Rating = 9.8,
                Available = true
            },

            new()
            {
                Brand = "Opel",
                Model = "Corsa",
                City = "Львів",
                ImagePath = "/images/cars/corsa_lrg.jpg",
                PricePerDay = 280,
                Transmission = "Automatic",
                FuelType = "Petrol",
                Seats = 5,
                Rating = 9.5,
                Available = true
            },

            new()
            {
                Brand = "Toyota",
                Model = "Yaris Cross",
                City = "Львів",
                ImagePath = "/images/cars/yaris_cross_hybrid_lrg.jpg",
                PricePerDay = 300,
                Transmission = "Automatic",
                FuelType = "Hybrid",
                Seats = 5,
                Rating = 9.4,
                Available = true
            },

            new()
            {
                Brand = "Hyundai",
                Model = "i30",
                City = "Львів",
                ImagePath = "/images/cars/i30_lrg.jpg",
                PricePerDay = 180,
                Transmission = "Manual",
                FuelType = "Petrol",
                Seats = 5,
                Rating = 9.6,
                Available = true
            },

            new()
            {
                Brand = "Volkswagen",
                Model = "Polo",
                City = "Львів",
                ImagePath = "/images/cars/polo_lrg.jpg",
                PricePerDay = 170,
                Transmission = "Automatic",
                FuelType = "Petrol",
                Seats = 5,
                Rating = 9.7,
                Available = true
            },

            new()
                {
                    Brand = "Peugeot",
                    Model = "2008",
                    City = "Львів",
                    ImagePath = "/images/cars/2008_lrg.jpg",
                    PricePerDay = 320,
                    Transmission = "Automatic",
                    FuelType = "Petrol",
                    Seats = 5,
                    Rating = 9.3,
                    Available = true
                },

                new()
                {
                    Brand = "Toyota",
                    Model = "C-HR",
                    City = "Львів",
                    ImagePath = "/images/cars/c-hr_lrg.jpg",
                    PricePerDay = 450,
                    Transmission = "Automatic",
                    FuelType = "Hybrid",
                    Seats = 5,
                    Rating = 9.8,
                    Available = true
                },

                new()
                {
                    Brand = "Jeep",
                    Model = "Compass",
                    City = "Львів",
                    ImagePath = "/images/cars/compass_ltd_lrg.jpg",
                    PricePerDay = 650,
                    Transmission = "Automatic",
                    FuelType = "Petrol",
                    Seats = 5,
                    Rating = 9.5,
                    Available = true
                },

                new()
                {
                    Brand = "Fiat",
                    Model = "Egea",
                    City = "Львів",
                    ImagePath = "/images/cars/egea_lrg.jpg",
                    PricePerDay = 260,
                    Transmission = "Manual",
                    FuelType = "Diesel",
                    Seats = 5,
                    Rating = 9.2,
                    Available = true
                },

                new()
                {
                    Brand = "Nissan",
                    Model = "Qashqai",
                    City = "Львів",
                    ImagePath = "/images/cars/qashqai_lrg.jpg",
                    PricePerDay = 520,
                    Transmission = "Automatic",
                    FuelType = "Petrol",
                    Seats = 5,
                    Rating = 9.6,
                    Available = true
                },

                new()
                {
                    Brand = "Kia",
                    Model = "Sportage",
                    City = "Львів",
                    ImagePath = "/images/cars/sportage_lrg.jpg",
                    PricePerDay = 600,
                    Transmission = "Automatic",
                    FuelType = "Diesel",
                    Seats = 5,
                    Rating = 9.7,
                    Available = true
                },

                new()
                {
                    Brand = "Skoda",
                    Model = "Superb Estate",
                    City = "Львів",
                    ImagePath = "/images/cars/superb_estate_lrg.jpg",
                    PricePerDay = 550,
                    Transmission = "Automatic",
                    FuelType = "Diesel",
                    Seats = 5,
                    Rating = 9.4,
                    Available = true
                },

                new()
                {
                    Brand = "Renault",
                    Model = "Trafic",
                    City = "Львів",
                    ImagePath = "/images/cars/trafic_lrg.jpg",
                    PricePerDay = 750,
                    Transmission = "Manual",
                    FuelType = "Diesel",
                    Seats = 9,
                    Rating = 9.1,
                    Available = true
                }
        };


        await context.Cars.AddRangeAsync(cars);

        await context.SaveChangesAsync();
    }
}