namespace DyplomBooking2026.DTOs
{
    public class ProfileDto
    {
        public string Id { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? FullName { get; set; }
        public string? AvatarPath { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
    }

    public class UpdateProfileDto
    {
        public string? FullName { get; set; }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
