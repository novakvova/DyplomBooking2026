using DyplomBooking2026.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Housing> Housings { get; set; } = null!;
        public DbSet<HousingBooking> HousingBookings { get; set; } = null!;
        public DbSet<HousingPhoto> HousingPhotos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Room → Booking
            builder.Entity<Booking>()
                .HasOne(b => b.Room)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Room>()
                .Property(r => r.PricePerHour)
                .HasColumnType("decimal(10,2)");

            // Housing → Owner
            builder.Entity<Housing>()
                .HasOne(h => h.Owner)
                .WithMany()
                .HasForeignKey(h => h.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Housing>()
                .Property(h => h.PricePerNight)
                .HasColumnType("decimal(10,2)");

            // HousingBooking → Housing
            builder.Entity<HousingBooking>()
                .HasOne(b => b.Housing)
                .WithMany(h => h.Bookings)
                .HasForeignKey(b => b.HousingId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<HousingBooking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // HousingPhoto → Housing
            builder.Entity<HousingPhoto>()
                .HasOne(p => p.Housing)
                .WithMany(h => h.Photos)
                .HasForeignKey(p => p.HousingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
