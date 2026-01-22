from decimal import Decimal
from .models import Booking, Invoice
from django.utils import timezone
from django.http import HttpResponse
from django.template.loader import render_to_string
from io import BytesIO
from xhtml2pdf import pisa

# -------------------
# Booking Service
# -------------------
class BookingService:

    @staticmethod
    def approve_booking(booking: Booking, scheduled_date):
        if booking.status != 'PENDING':
            raise ValueError('Only pending bookings can be approved')

        if not scheduled_date:
            raise ValueError('Scheduled date must be provided for approval')
               
        booking.status = 'APPROVED'
        booking.scheduled_date = scheduled_date
        booking.save()
        return booking

    @staticmethod
    def reject_booking(booking: Booking, reason=None):
        if booking.status != 'PENDING':
            raise ValueError('Only pending bookings can be rejected')

        booking.status = 'REJECTED'

        # if reason:
        #     booking.reason = reason #if there's a reason field in the model

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
    def generate_invoice(booking: Booking, additional_charge=0, additional_charge_description=''):
        if booking.status != 'COMPLETED':
            raise ValueError('Invoice can be generated only after service completion')

        base_price = booking.service.price
        total_amount = Decimal(base_price) + Decimal(additional_charge)

        return Invoice.objects.create(
            booking=booking,
            additional_charges=Decimal(additional_charge),
            additional_charges_description=additional_charge_description,
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

    @staticmethod
    def generate_invoice_pdf(invoice: Invoice):
   
        # Get related objects
        booking = invoice.booking
        customer = booking.customer
        vehicle = booking.vehicle
        service = booking.service
    
        # Prepare context for template
        context = {
            'invoice': invoice,
            'customer': customer,
            'vehicle': vehicle,
            'service': service,
            'booking': booking,
        }
    
        # Render HTML template
        html = render_to_string('invoice.html', context)
    
        # Create PDF
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("UTF-8")), result)
    
        if not pdf.err:
            return result.getvalue()
    
        return None
