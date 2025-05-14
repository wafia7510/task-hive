from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to allow only owners of a task to access or modify it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
