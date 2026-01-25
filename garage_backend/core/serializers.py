from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
            'date_joined',
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

    username = serializers.CharField(source='user.username', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id',
            'user',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone',
            'date_joined',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'created_at', 
            'updated_at',
            'date_joined',
        ]

    def update(self, instance, validated_data):
        # Extract user data if present (it will be under 'user' key due to 'source=user.xxx')
        user_data = validated_data.pop('user', {})
        
        # Update Customer fields
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        # Update User fields
        user = instance.user
        if user_data:
            if 'first_name' in user_data:
                user.first_name = user_data['first_name']
            if 'last_name' in user_data:
                user.last_name = user_data['last_name']
            if 'email' in user_data:
                user.email = user_data['email']
            if 'username' in user_data:
                user.username = user_data['username']
            user.save()

        return instance

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
        required=False  # Changed to False to allow Customers to create without sending ID
    )

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'customer',
            'customer_id',
            'vehicle_number',
            'vehicle_type',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]

    def validate_customer(self, customer):
        request = self.context['request']
        if request.user.role != 'ADMIN' and customer.user != request.user:
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
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True,
        required=False
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'service',
            'service_id',
            'customer',
            'customer_id',
            'vehicle',
            'vehicle_id',
            'booking_date',
            'preferred_date',
            'scheduled_date',
            'status',
            'invoice',
        ]
        read_only_fields = [
            'id',
            'service',
            'customer',
            'booking_date',
            'status',
            'created_at',
            'updated_at',
            'invoice',
        ]

    def validate_vehicle(self, vehicle):
        request = self.context['request']
        # If admin, check if vehicle belongs to the provided customer
        # Otherwise, check if vehicle belongs to the current user's customer
        if request.user.role == 'ADMIN':
            customer_id = self.initial_data.get('customer_id')
            if customer_id and vehicle.customer_id != int(customer_id):
                raise serializers.ValidationError("Vehicle does not belong to the selected customer.")
        else:
            if vehicle.customer.user != request.user:
                raise serializers.ValidationError("You do not own this vehicle.")
        return vehicle

    def validate(self, attrs):
        preferred = attrs.get('preferred_date')
        scheduled = attrs.get('scheduled_date')

         # Get current date in the configured timezone
        from django.utils import timezone
        today = timezone.now().date()
    
        # Validate preferred date is not in the past
        if preferred and preferred < today:
            raise serializers.ValidationError({
                'preferred_date': 'Preferred date cannot be in the past.'
            })
        
        # Validate scheduled date is not in the past
        if scheduled and scheduled < today:
            raise serializers.ValidationError({
                'scheduled_date': 'Scheduled date cannot be in the past.'
            })
        
        # Validate scheduled date is not before preferred date
        if scheduled and preferred and scheduled < preferred:
            raise serializers.ValidationError({
                'scheduled_date': 'Scheduled date cannot be before preferred date.'
            })
        
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        if request.user.role == 'ADMIN':
            # Customer should be provided in validated_data if admin is creating
            if 'customer' not in validated_data:
                raise serializers.ValidationError({"customer_id": "Customer is required for admin bookings."})
        else:
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
            'additional_charges',
            'additional_charges_description',
            'total_amount',
            'payment_status',
            'invoice_date',
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

    def update(self, instance, validated_data):
        from decimal import Decimal
        
        # Update additional charges fields if provided
        if 'additional_charges' in validated_data:
            instance.additional_charges = validated_data.get('additional_charges', instance.additional_charges)
        
        if 'additional_charges_description' in validated_data:
            instance.additional_charges_description = validated_data.get('additional_charges_description', instance.additional_charges_description)
        
        # Recalculate total_amount if additional_charges was updated
        if 'additional_charges' in validated_data:
            service_price = instance.booking.service.price
            instance.total_amount = Decimal(service_price) + Decimal(instance.additional_charges)
        
        # Update payment_status if provided
        if 'payment_status' in validated_data:
            instance.payment_status = validated_data.get('payment_status', instance.payment_status)
        
        instance.save()
        return instance

# -------------------
# Token Serializer
# -------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role  # your custom User model has role

        return token

# -------------------
# Customer Registration Serializer
# -------------------
class CustomerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    password = serializers.CharField(source="user.password", write_only=True)
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Customer
        fields = [
            "username", 
            "password", 
            "first_name", 
            "last_name", 
            "email",
            "phone"
        ]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        # We can reuse the logic from CustomerSerializer or just define it here
        if not value.isdigit():
            raise serializers.ValidationError("Phone number should contain only digits.")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits long.")
        return value

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        phone = validated_data.pop("phone", "")
        
        try:
            user = User.objects.create_user(
                username=user_data["username"],
                password=user_data["password"],
                first_name=user_data.get("first_name", ""),
                last_name=user_data.get("last_name", ""),
                email=user_data.get("email", ""),
                role="CUSTOMER",
            )
            customer = Customer.objects.create(user=user, phone=phone)
            return customer
        except Exception as e:
            # Fallback for unexpected errors during creation
            raise serializers.ValidationError({"error": str(e)})
