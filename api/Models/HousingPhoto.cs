namespace DyplomBooking2026.Models
{
    public class HousingPhoto
    {
        public int Id { get; set; }

        public int HousingId { get; set; }
        public Housing Housing { get; set; } = null!;

        // Шлях до файлу відносно wwwroot, наприклад: /images/housing/abc123.webp
        public string FilePath { get; set; } = null!;

        // Оригінальна назва файлу (для інформації)
        public string OriginalName { get; set; } = null!;

        public bool IsMain { get; set; } = false;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
