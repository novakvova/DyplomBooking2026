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
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<UserDestinationView> UserDestinationViews { get; set; } = null!;
        public DbSet<AppSetting> AppSettings { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<Review> Reviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Один користувач може додати конкретне житло
            // до списку бажань лише один раз.
            builder.Entity<WishlistItem>()
                .HasIndex(x => new { x.UserId, x.HousingId })
                .IsUnique();

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

            // Налаштовуємо зв'язок WishlistItem -> User.
            builder.Entity<WishlistItem>()
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налаштовуємо зв'язок WishlistItem -> Housing.
            builder.Entity<WishlistItem>()
                .HasOne(x => x.Housing)
                .WithMany()
                .HasForeignKey(x => x.HousingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Review → User
            // При видаленні користувача видаляємо його відгуки.
            builder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Review → Housing
            // При видаленні житла видаляємо пов'язані відгуки.
            builder.Entity<Review>()
                .HasOne(r => r.Housing)
                .WithMany()
                .HasForeignKey(r => r.HousingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Destination → UserDestinationView
            builder.Entity<UserDestinationView>()
                .HasOne(x => x.Destination)
                .WithMany(x => x.UserViews)
                .HasForeignKey(x => x.DestinationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Destination → перегляди напрямку.
            builder.Entity<UserDestinationView>()
                .HasOne(x => x.Destination)
                .WithMany(x => x.UserViews)
                .HasForeignKey(x => x.DestinationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ключ налаштування має бути унікальним.
            builder.Entity<AppSetting>()
                .HasIndex(x => x.Key)
                .IsUnique();
        }
    }
}
