from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import User, Customer, Vehicle, Service, Booking, Invoice
from .serializers import (
    UserSerializer, CustomerSerializer, VehicleSerializer,
    ServiceSerializer, BookingSerializer, InvoiceSerializer
)
from .permissions import IsAdmin, IsCustomer
from .services import InvoiceService


# -------------------
# User (Admin only)
# -------------------
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


# -------------------
# Customer Management (Admin)
# -------------------
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


# -------------------
# Vehicle
# -------------------
class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return Vehicle.objects.all()

        return Vehicle.objects.filter(customer__user=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user.customer)

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsCustomer()]
        return [IsAuthenticated()]

# -------------------
# Service Management (Admin)
# -------------------
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


# -------------------
# Booking
# -------------------
class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return Booking.objects.all()

        return Booking.objects.filter(customer__user=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user.customer)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsCustomer()]
        return [IsAuthenticated(), IsAdmin()]

# -------------------
# Invoice (Admin Only)
# -------------------
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')

        try:
            additional_charge = float(
                request.data.get('additional_charge', 0)
            )
        except ValueError:
            return Response(
                {'error': 'Invalid additional_charge'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        #Booking must be completed
        if booking.status != 'COMPLETED':
            return Response(
                {
                    'error': 'Invoice can be generated only after service completion'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        #Prevent duplicate invoice
        if hasattr(booking, 'invoice'):
            return Response(
                {'error': 'Invoice already exists for this booking'},
                status=status.HTTP_400_BAD_REQUEST
            )

        #Generate invoice
        invoice = InvoiceService.generate_invoice(
            booking,
            additional_charge
        )

        serializer = self.get_serializer(invoice)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
