namespace DyplomBooking2026.Models
{
    public enum PaymentStatus
    {
        Pending,    // Очікує оплати
        Processing, // Обробляється
        Paid,       // Оплачено
        Failed,     // Помилка оплати
        Refunded    // Повернено кошти
    }

    public enum PaymentMethod
    {
        CreditCard,   // Кредитна картка
        DebitCard,    // Дебетова картка
        PayPal,       // PayPal (імітація)
        BankTransfer  // Банківський переказ
    }

    public class Payment
    {
        public int Id { get; set; }

        // Унікальний номер транзакції (генерується автоматично)
        public string TransactionId { get; set; } = null!;

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        // Бронювання — або кімната, або житло (одне з двох)
        public int? BookingId { get; set; }
        public Booking? Booking { get; set; }

        public int? HousingBookingId { get; set; }
        public HousingBooking? HousingBooking { get; set; }

        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public PaymentMethod Method { get; set; }

        // Імітація — маскована картка типу "**** **** **** 1234"
        public string? MaskedCard { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }

        // Причина відмови (якщо Failed)
        public string? FailureReason { get; set; }
    }
}
