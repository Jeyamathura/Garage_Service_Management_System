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

    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
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
        ]
        read_only_fields = [
            'id',
            'user',
            'created_at', 
            'updated_at',
        ]

    def update(self, instance, validated_data):
        # Update Customer fields
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        # Update User fields manually
        user = instance.user
        
        # Check for each field in validated_data
        if 'first_name' in validated_data:
            user.first_name = validated_data['first_name']
        if 'last_name' in validated_data:
            user.last_name = validated_data['last_name']
        if 'email' in validated_data:
            user.email = validated_data['email']
        if 'username' in validated_data:
            user.username = validated_data['username']
            
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
            "email"
            ]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create_user(
            username=user_data["username"],
            password=user_data["password"],
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name", ""),
            email=user_data.get("email", ""),
            role="CUSTOMER",
        )
        customer = Customer.objects.create(user=user, **validated_data)
        return customer
