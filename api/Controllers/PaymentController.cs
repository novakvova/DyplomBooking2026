using System.Security.Claims;
using DyplomBooking2026.Data;
using DyplomBooking2026.DTOs;
using DyplomBooking2026.Models;
using DyplomBooking2026.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DyplomBooking2026.Controllers
{
    [ApiController]
    [Route("api/payments")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PaymentService _paymentService;

        public PaymentController(ApplicationDbContext context, PaymentService paymentService)
        {
            _context = context;
            _paymentService = paymentService;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

        // ──────────────────────────────────────────
        // Оплата бронювання кімнати
        // ──────────────────────────────────────────

        /// <summary>
        /// Оплатити бронювання кімнати
        /// </summary>
        [HttpPost("pay-booking")]
        public async Task<ActionResult<PaymentDto>> PayBooking(PayBookingDto dto)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == dto.BookingId);

            if (booking == null)
                return NotFound("Бронювання не знайдено.");

            if (booking.UserId != CurrentUserId)
                return Forbid();

            if (booking.Status == BookingStatus.Cancelled)
                return BadRequest("Неможливо оплатити скасоване бронювання.");

            // Перевіряємо чи вже є оплачений платіж
            var existingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.BookingId == dto.BookingId
                    && p.Status == PaymentStatus.Paid);

            if (existingPayment != null)
                return BadRequest("Це бронювання вже оплачено.");

            // Розраховуємо суму (ціна/год * кількість годин)
            var hours = (decimal)(booking.EndTime - booking.StartTime).TotalHours;
            var amount = booking.Room.PricePerHour * hours;

            var payment = await _paymentService.ProcessPaymentAsync(
                userId: CurrentUserId,
                amount: amount,
                method: dto.Method,
                cardLastFour: dto.CardLastFour,
                bookingId: dto.BookingId
            );

            return Ok(ToDto(payment));
        }

        /// <summary>
        /// Оплатити бронювання житла
        /// </summary>
        [HttpPost("pay-housing-booking")]
        public async Task<ActionResult<PaymentDto>> PayHousingBooking(PayHousingBookingDto dto)
        {
            var booking = await _context.HousingBookings
                .Include(b => b.Housing)
                .FirstOrDefaultAsync(b => b.Id == dto.HousingBookingId);

            if (booking == null)
                return NotFound("Бронювання не знайдено.");

            if (booking.UserId != CurrentUserId)
                return Forbid();

            if (booking.Status == BookingStatus.Cancelled)
                return BadRequest("Неможливо оплатити скасоване бронювання.");

            var existingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.HousingBookingId == dto.HousingBookingId
                    && p.Status == PaymentStatus.Paid);

            if (existingPayment != null)
                return BadRequest("Це бронювання вже оплачено.");

            // Розраховуємо суму (ціна/ніч * кількість ночей)
            var nights = (decimal)(booking.CheckOut - booking.CheckIn).TotalDays;
            var amount = booking.Housing.PricePerNight * nights;

            var payment = await _paymentService.ProcessPaymentAsync(
                userId: CurrentUserId,
                amount: amount,
                method: dto.Method,
                cardLastFour: dto.CardLastFour,
                housingBookingId: dto.HousingBookingId
            );

            return Ok(ToDto(payment));
        }

        // ──────────────────────────────────────────
        // Перегляд платежів
        // ──────────────────────────────────────────

        /// <summary>
        /// Мої платежі
        /// </summary>
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetMyPayments()
        {
            var payments = await _context.Payments
                .Where(p => p.UserId == CurrentUserId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(payments.Select(ToDto));
        }

        /// <summary>
        /// Всі платежі (Admin/Manager)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAll(
            [FromQuery] PaymentStatus? status = null)
        {
            var query = _context.Payments.AsQueryable();

            if (status.HasValue)
                query = query.Where(p => p.Status == status.Value);

            var payments = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(payments.Select(ToDto));
        }

        /// <summary>
        /// Деталі конкретного платежу
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetById(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            // Клієнт бачить лише свої платежі
            var isOwner = payment.UserId == CurrentUserId;
            var isStaff = User.IsInRole("Admin") || User.IsInRole("Manager");

            if (!isOwner && !isStaff) return Forbid();

            return Ok(ToDto(payment));
        }

        // ──────────────────────────────────────────
        // Повернення коштів
        // ──────────────────────────────────────────

        /// <summary>
        /// Повернення коштів за платіж
        /// </summary>
        [HttpPost("refund")]
        public async Task<ActionResult<PaymentDto>> Refund(RefundDto dto)
        {
            try
            {
                var payment = await _paymentService.ProcessRefundAsync(dto.PaymentId, CurrentUserId);
                return Ok(ToDto(payment));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ──────────────────────────────────────────
        // Mapper
        // ──────────────────────────────────────────

        private static PaymentDto ToDto(Payment p) => new()
        {
            Id = p.Id,
            TransactionId = p.TransactionId,
            Amount = p.Amount,
            Currency = p.Currency,
            Status = p.Status,
            Method = p.Method.ToString(),
            MaskedCard = p.MaskedCard,
            CreatedAt = p.CreatedAt,
            PaidAt = p.PaidAt,
            FailureReason = p.FailureReason,
            BookingId = p.BookingId,
            HousingBookingId = p.HousingBookingId
        };
    }
}
