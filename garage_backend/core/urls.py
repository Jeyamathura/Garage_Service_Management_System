from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    UserViewSet,
    CustomerViewSet,
    VehicleViewSet,
    ServiceViewSet,
    BookingViewSet,
    InvoiceViewSet,
    CustomerRegisterView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'invoices', InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('', include(router.urls)),  # keep all router URLs
    path('auth/register/', CustomerRegisterView.as_view(), name='customer-register'),  # now under /api/
]
