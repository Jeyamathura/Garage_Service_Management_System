from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .serializers import CustomerRegistrationSerializer
from .models import User, Customer, Vehicle, Service, Booking, Invoice
from .serializers import (
    UserSerializer, CustomerSerializer, VehicleSerializer,
    ServiceSerializer, BookingSerializer, InvoiceSerializer
)
from .permissions import IsAdmin, IsCustomer, IsAdminOrOwner, IsAdminOrReadOnly
from .services import InvoiceService, BookingService
from rest_framework import generics
from rest_framework.permissions import AllowAny

# -------------------
# User (Admin only)
# -------------------
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


# -------------------
# Customer Management
# -------------------
class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Customer.objects.all()
        else:
            # Customer sees only their own profile
            return Customer.objects.filter(user=user)
        
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
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsCustomer()]
        return [IsAuthenticated()]

# -------------------
# Service Management (Admin)
# -------------------
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]


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

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user.customer)

    # -------------------
    # Booking transitions
    # -------------------

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        booking = self.get_object()
        scheduled_date = request.data.get('scheduled_date')

        if not scheduled_date:
            return Response(
                {'error': 'scheduled_date is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        BookingService.approve_booking(booking, scheduled_date)
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        booking = self.get_object()
        BookingService.reject_booking(booking)
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def start(self, request, pk=None):
        booking = self.get_object()
        BookingService.start_service(booking)
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def complete(self, request, pk=None):
        booking = self.get_object()
        BookingService.complete_service(booking)
        return Response(self.get_serializer(booking).data)


# -------------------
# Invoice (Admin Only)
# -------------------
class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Invoice.objects.all()
        return Invoice.objects.filter(booking__customer__user=user)

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

# -------------------
# Token Authentication
# -------------------
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

#-------------------
# Customer Registration
#-------------------
class CustomerRegisterView(generics.CreateAPIView):
    serializer_class = CustomerRegistrationSerializer
    permission_classes = [AllowAny] # Allow anyone to register