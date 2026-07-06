using SkiaSharp;

namespace DyplomBooking2026.Services
{
    public class PhotoService
    {
        private readonly IWebHostEnvironment _env;

        // Максимальні розміри зображення після обробки
        private const int MaxWidth = 1200;
        private const int MaxHeight = 900;
        // Якість JPEG/WebP (0-100)
        private const int Quality = 85;

        public PhotoService(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Зберігає зображення, стискає і змінює розмір через SkiaSharp.
        /// Повертає відносний шлях до файлу (наприклад /images/housing/abc123.webp).
        /// </summary>
        public async Task<string> SavePhotoAsync(IFormFile file, string folder = "housing")
        {
            ValidateFile(file);

            // Папка: wwwroot/images/housing/
            var uploadFolder = Path.Combine(_env.WebRootPath, "images", folder);
            Directory.CreateDirectory(uploadFolder);

            var fileName = $"{Guid.NewGuid()}.webp";
            var fullPath = Path.Combine(uploadFolder, fileName);

            // Читаємо байти з потоку
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            // Обробка через SkiaSharp
            using var inputStream = new SKManagedStream(memoryStream);
            using var original = SKBitmap.Decode(inputStream);

            if (original == null)
                throw new InvalidOperationException("Не вдалося декодувати зображення. Перевір формат файлу.");

            using var resized = ResizeBitmap(original);
            using var image = SKImage.FromBitmap(resized);
            using var encoded = image.Encode(SKEncodedImageFormat.Webp, Quality);
            using var fileStream = File.OpenWrite(fullPath);

            encoded.SaveTo(fileStream);

            return $"/images/{folder}/{fileName}";
        }

        /// <summary>
        /// Видаляє файл зображення з диска.
        /// </summary>
        public void DeletePhoto(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath)) return;

            var fullPath = Path.Combine(_env.WebRootPath, filePath.TrimStart('/'));
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }

        /// <summary>
        /// Змінює розмір зображення, зберігаючи пропорції.
        /// Якщо зображення менше максимальних розмірів — залишає без змін.
        /// </summary>
        private static SKBitmap ResizeBitmap(SKBitmap original)
        {
            int width = original.Width;
            int height = original.Height;

            if (width <= MaxWidth && height <= MaxHeight)
                return original;

            float ratioX = (float)MaxWidth / width;
            float ratioY = (float)MaxHeight / height;
            float ratio = Math.Min(ratioX, ratioY);

            int newWidth = (int)(width * ratio);
            int newHeight = (int)(height * ratio);

            var resized = new SKBitmap(newWidth, newHeight);
            original.ScalePixels(resized, SKSamplingOptions.Default);
            return resized;
        }

        /// <summary>
        /// Перевіряє файл на допустимий тип і розмір.
        /// </summary>
        private static void ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Файл порожній.");

            // Максимум 10 МБ
            const long maxSize = 10 * 1024 * 1024;
            if (file.Length > maxSize)
                throw new ArgumentException("Розмір файлу не повинен перевищувати 10 МБ.");

            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                throw new ArgumentException("Допустимі формати: JPEG, PNG, WebP, GIF.");
        }
    }
}
