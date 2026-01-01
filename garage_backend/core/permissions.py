from rest_framework.permissions import BasePermission, SAFE_METHODS

#-------------------
# Allow access only to Admin users
#-------------------
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

#-------------------
# Allow access only to Customer users
#-------------------
class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CUSTOMER'

#-------------------
# Allow read-only access to all authenticated users, write access only to Admin users
#-------------------
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  
            return request.user.is_authenticated # Allow authenticated users to read
        return request.user.is_authenticated and request.user.role == 'ADMIN'   # Allow only admins to write
    
    

