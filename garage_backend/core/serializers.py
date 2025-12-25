from rest_framework import serializers
from .models import User, Customer, Vehicle, Service, Booking, Invoice

# -------------------
# User Serializer
# -------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'role',
            'is_superuser',
            'date_joined',
            'last_login'
        ]

# -------------------
# Customer Serializer
# -------------------
class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Customer
        fields = [
            'id',
            'user',
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

# -------------------
# Vehicle Serializer
# -------------------
class VehicleSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True, required=False
    )

    class Meta:
        model = Vehicle
        fields = ['id', 'vehicle_number', 'vehicle_type', 'customer', 'customer_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

# -------------------
# Service Serializer
# -------------------
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'service_name', 'description', 'price', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

# -------------------
# Booking Serializer
# -------------------
class BookingSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)

    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True, required=False
    )
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), source='service', write_only=True, required=False
    )
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), source='vehicle', write_only=True, required=False
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_id',
            'service', 'service_id',
            'vehicle', 'vehicle_id',
            'booking_date', 'preferred_date', 'scheduled_date',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['booking_date', 'created_at', 'updated_at']

# -------------------
# Invoice Serializer
# -------------------
class InvoiceSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all(), source='booking', write_only=True, required=False
    )

    class Meta:
        model = Invoice
        fields = [
            'id', 'booking', 'booking_id',
            'total_amount', 'payment_status', 'invoice_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
