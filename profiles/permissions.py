from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only profile owners to edit.
    """

    def has_object_permission(self, request, view, obj):
        # Allow GET (read-only) for anyone authenticated
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow edit only if the request user owns the profile
        return obj.user == request.user
