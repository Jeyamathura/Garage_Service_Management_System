from decimal import Decimal
from .models import Booking, Invoice
from django.utils import timezone

# -------------------
# Booking Service
# -------------------
class BookingService:

    @staticmethod
    def approve_booking(booking: Booking, scheduled_date):
        if booking.status != 'PENDING':
            raise ValueError('Only pending bookings can be approved')

        booking.status = 'APPROVED'
        booking.scheduled_date = scheduled_date
        booking.save()
        return booking

    @staticmethod
    def reject_booking(booking: Booking, reason=None):
        if booking.status != 'PENDING':
            raise ValueError('Only pending bookings can be rejected')

        booking.status = 'REJECTED'
        booking.save()
        return booking

    @staticmethod
    def start_service(booking: Booking):
        if booking.status != 'APPROVED':
            raise ValueError('Service can start only after approval')

        booking.status = 'IN_PROGRESS'
        booking.save()
        return booking

    @staticmethod
    def complete_service(booking: Booking):
        if booking.status != 'IN_PROGRESS':
            raise ValueError('Service must be in progress to complete')

        booking.status = 'COMPLETED'
        booking.save()
        return booking

# -------------------
# Invoice Service
# -------------------
class InvoiceService:

    @staticmethod
    def generate_invoice(booking: Booking, additional_charge=0):
        if booking.status != 'COMPLETED':
            raise ValueError('Invoice can be generated only after service completion')

        base_price = booking.service.price
        total_amount = Decimal(base_price) + Decimal(additional_charge)

        return Invoice.objects.create(
            booking=booking,
            total_amount=total_amount,
            payment_status='PENDING'
        )

    @staticmethod
    def mark_as_paid(invoice: Invoice):
        if invoice.payment_status == 'PAID':
            raise ValueError('Invoice already paid')

        invoice.payment_status = 'PAID'
        invoice.save()
        return invoice
