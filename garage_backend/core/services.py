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

    @staticmethod
    def generate_invoice_pdf(invoice: Invoice):
        # Get related objects
        booking = invoice.booking
        customer = booking.customer
        vehicle = booking.vehicle
        service = booking.service
        
        # Format dates
        invoice_date = invoice.invoice_date.strftime('%Y-%m-%d')
        booking_date = booking.booking_date.strftime('%Y-%m-%d')
        scheduled_date = booking.scheduled_date.strftime('%Y-%m-%d') if booking.scheduled_date else 'N/A'
        
        # Calculate billing details
        service_cost = service.price
        
        # Format the invoice content
        pdf_content = f"""
    {'='*50}
    {'GARAGE NAME'.center(50)}
    {'='*50}

    {'INVOICE'.center(50)}
    {'='*50}

    Customer Details:
    {'-'*30}
    Customer Name: {customer.user.username}
    Contact Number: {customer.phone}

    Vehicle Details:
    {'-'*30}
    Vehicle Type: {vehicle.vehicle_type}
    Vehicle Number: {vehicle.vehicle_number}

    Booking Details:
    {'-'*30}
    Booking ID: {booking.id}
    Booking Date: {booking_date}
    Scheduled Date: {scheduled_date}
    Service Status: {booking.status}

    Service Details:
    {'-'*30}
    Service Name: {service.service_name}
    Service Description: {service.description}
    Service Price: {service_cost}

    Billing Details:
    {'-'*30}
    Service Cost: {service_cost}
    Additional Charges: [ ]
    {'-'*30}
    Total Amount: {invoice.total_amount}

    Payment Details:
    {'-'*30}
    Payment Status: {invoice.payment_status}
    Payment Method: [ ]
    {'-'*30}

    Administrative Details:
    {'-'*30}
    Authorized By: [ ]
    Garage Name: [ ]
    {'='*50}
    """
        return pdf_content.encode('utf-8')
