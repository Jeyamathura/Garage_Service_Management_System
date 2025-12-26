from decimal import Decimal
from .models import Booking, Invoice

class InvoiceService:
    @staticmethod
    def generate_invoice(booking: Booking, additional_charge=0):
        """
        Calculate invoice total and create invoice.
        """
        base_price = booking.service.price
        total_amount = Decimal(base_price) + Decimal(additional_charge)

        invoice = Invoice.objects.create(
            booking=booking,
            total_amount=total_amount,
            payment_status='PENDING'
        )
        return invoice
