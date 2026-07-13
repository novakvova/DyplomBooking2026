using DyplomBooking2026.Models;

namespace DyplomBooking2026.DTOs
{
    /// <summary>
    /// Запит на оплату бронювання кімнати
    /// </summary>
    public class PayBookingDto
    {
        public int BookingId { get; set; }
        public PaymentMethod Method { get; set; }

        // Лише для CreditCard/DebitCard — останні 4 цифри (імітація)
        public string? CardLastFour { get; set; }
    }

    /// <summary>
    /// Запит на оплату бронювання житла
    /// </summary>
    public class PayHousingBookingDto
    {
        public int HousingBookingId { get; set; }
        public PaymentMethod Method { get; set; }
        public string? CardLastFour { get; set; }
    }

    /// <summary>
    /// Відповідь після оплати
    /// </summary>
    public class PaymentDto
    {
        public int Id { get; set; }
        public string TransactionId { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = null!;
        public PaymentStatus Status { get; set; }
        public string Method { get; set; } = null!;
        public string? MaskedCard { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public string? FailureReason { get; set; }

        // Інформація про бронювання
        public int? BookingId { get; set; }
        public int? HousingBookingId { get; set; }
    }

    /// <summary>
    /// Запит на повернення коштів
    /// </summary>
    public class RefundDto
    {
        public int PaymentId { get; set; }
        public string? Reason { get; set; }
    }
}
