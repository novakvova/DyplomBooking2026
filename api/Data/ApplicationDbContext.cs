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
        public DbSet<Payment> Payments { get; set; } = null!;

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

            // HousingBooking
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

            // HousingPhoto
            builder.Entity<HousingPhoto>()
                .HasOne(p => p.Housing)
                .WithMany(h => h.Photos)
                .HasForeignKey(p => p.HousingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Payment → User
            builder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(10,2)");

            // Payment → Booking (optional)
            builder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithMany()
                .HasForeignKey(p => p.BookingId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            // Payment → HousingBooking (optional)
            builder.Entity<Payment>()
                .HasOne(p => p.HousingBooking)
                .WithMany()
                .HasForeignKey(p => p.HousingBookingId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            // Унікальний індекс на TransactionId
            builder.Entity<Payment>()
                .HasIndex(p => p.TransactionId)
                .IsUnique();
        }
    }
}
