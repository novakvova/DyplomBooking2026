namespace DyplomBooking2026.DTOs
{
    public class PhotoDto
    {
        public int Id { get; set; }
        public int HousingId { get; set; }
        public string FilePath { get; set; } = null!;
        public string OriginalName { get; set; } = null!;
        public bool IsMain { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
