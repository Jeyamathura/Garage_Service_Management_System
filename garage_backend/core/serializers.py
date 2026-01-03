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
            'email',
            'first_name',
            'last_name',
            'role',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'role',
            'created_at',
            'updated_at',
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
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'created_at', 
            'updated_at',
        ]

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number should contain only digits.")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits long.")
        return value

# -------------------
# Vehicle Serializer
# -------------------
class VehicleSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True,
        required=True  # Added to ensure customer is always provided
    )

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'customer',
            'customer_id',
            'vehicle_number',
            'vehicle_type',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]

    def validate_customer(self, customer):
        request = self.context['request']
        if customer.user != request.user:
            raise serializers.ValidationError("You do not own this customer.")
        return customer

# -------------------
# Service Serializer
# -------------------
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'service_name',
            'description',
            'price',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at', 
            'updated_at',
        ]

        def validate_price(self, value):
            if value <= 0:
                raise serializers.ValidationError("Price must be greater than zero.")
            return value

# -------------------
# Booking Serializer
# -------------------
class BookingSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)

    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(),
        source='vehicle',
        write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'customer',
            'service',
            'service_id',
            'vehicle',
            'vehicle_id',
            'booking_date',
            'preferred_date',
            'scheduled_date',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'customer',
            'booking_date',
            'status',
            'created_at',
            'updated_at',
        ]

    def validate_vehicle(self, vehicle):
        request = self.context['request']
        if vehicle.customer.user != request.user:
            raise serializers.ValidationError("You do not own this vehicle.")
        return vehicle

    def validate(self, attrs):
        preferred = attrs.get('preferred_date')
        scheduled = attrs.get('scheduled_date')

        if scheduled and preferred and scheduled < preferred:
            raise serializers.ValidationError(
                "Scheduled date cannot be before preferred date."
            )
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        validated_data['customer'] = Customer.objects.get(user=request.user)
        return super().create(validated_data)

# -------------------
# Invoice Serializer
# -------------------
class InvoiceSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.none(),
        source='booking',
        write_only=True
    )

    class Meta:
        model = Invoice
        fields = [
            'id',
            'booking',
            'booking_id',
            'total_amount',
            'payment_status',
            'invoice_date',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'total_amount',
            'invoice_date',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            self.fields['booking_id'].queryset = Booking.objects.filter(
                customer__user=request.user
            )
