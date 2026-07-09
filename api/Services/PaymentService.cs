using DyplomBooking2026.Data;
using DyplomBooking2026.Models;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Services
{
    public class PaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Імітує обробку оплати.
        /// 90% випадків — успішна оплата, 10% — відмова (для реалізму).
        /// </summary>
        public async Task<Payment> ProcessPaymentAsync(
            string userId,
            decimal amount,
            PaymentMethod method,
            string? cardLastFour = null,
            int? bookingId = null,
            int? housingBookingId = null)
        {
            var transactionId = GenerateTransactionId();
            var maskedCard = cardLastFour != null
                ? $"**** **** **** {cardLastFour}"
                : null;

            var payment = new Payment
            {
                TransactionId = transactionId,
                UserId = userId,
                Amount = amount,
                Method = method,
                MaskedCard = maskedCard,
                Status = PaymentStatus.Processing,
                BookingId = bookingId,
                HousingBookingId = housingBookingId
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // Імітуємо затримку обробки платежу (як у реальній платіжній системі)
            await Task.Delay(500);

            // Імітація: 90% успіх, 10% відмова
            var isSuccess = new Random().Next(1, 11) <= 9;

            if (isSuccess)
            {
                payment.Status = PaymentStatus.Paid;
                payment.PaidAt = DateTime.UtcNow;

                // Автоматично підтверджуємо бронювання після оплати
                if (bookingId.HasValue)
                {
                    var booking = await _context.Bookings.FindAsync(bookingId.Value);
                    if (booking != null)
                        booking.Status = BookingStatus.Confirmed;
                }

                if (housingBookingId.HasValue)
                {
                    var hBooking = await _context.HousingBookings.FindAsync(housingBookingId.Value);
                    if (hBooking != null)
                        hBooking.Status = BookingStatus.Confirmed;
                }
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
                payment.FailureReason = "Недостатньо коштів або відмова банку. Спробуйте ще раз.";
            }

            await _context.SaveChangesAsync();
            return payment;
        }

        /// <summary>
        /// Імітує повернення коштів (refund).
        /// </summary>
        public async Task<Payment> ProcessRefundAsync(int paymentId, string userId)
        {
            var payment = await _context.Payments
                .Include(p => p.Booking)
                .Include(p => p.HousingBooking)
                .FirstOrDefaultAsync(p => p.Id == paymentId && p.UserId == userId);

            if (payment == null)
                throw new KeyNotFoundException("Платіж не знайдено.");

            if (payment.Status != PaymentStatus.Paid)
                throw new InvalidOperationException("Повернення можливе лише для оплачених платежів.");

            payment.Status = PaymentStatus.Refunded;

            // Скасовуємо бронювання
            if (payment.Booking != null)
                payment.Booking.Status = BookingStatus.Cancelled;

            if (payment.HousingBooking != null)
                payment.HousingBooking.Status = BookingStatus.Cancelled;

            await _context.SaveChangesAsync();
            return payment;
        }

        /// <summary>
        /// Генерує унікальний номер транзакції формату TXN-YYYYMMDD-XXXXXXXX
        /// </summary>
        private static string GenerateTransactionId()
        {
            var date = DateTime.UtcNow.ToString("yyyyMMdd");
            var random = Guid.NewGuid().ToString("N")[..8].ToUpper();
            return $"TXN-{date}-{random}";
        }
    }
}
