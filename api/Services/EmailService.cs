using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace DyplomBooking2026.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var from = _config["Email:From"]!;
            var password = _config["Email:Password"]!;
            var displayName = _config["Email:DisplayName"] ?? "DyplomBooking2026";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(displayName, from));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html") { Text = htmlBody };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(from, password);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
        {
            var subject = "Відновлення паролю — DyplomBooking2026";
            var body = $"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Відновлення паролю</h2>
                    <p>Ми отримали запит на відновлення паролю для вашого акаунту.</p>
                    <p>Натисніть кнопку нижче, щоб встановити новий пароль:</p>
                    <a href="{resetLink}"
                       style="display: inline-block; padding: 12px 24px; background-color: #4CAF50;
                              color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                        Відновити пароль
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        Посилання дійсне протягом <strong>1 години</strong>.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Якщо ви не надсилали цей запит — просто проігноруйте цей лист.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <p style="color: #999; font-size: 12px;">DyplomBooking2026</p>
                </div>
                """;

            await SendEmailAsync(toEmail, subject, body);
        }
    }
}
