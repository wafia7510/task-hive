from rest_framework import permissions

class IsLikeOwnerOrReadOnly(permissions.BasePermission):
    """Only the user who liked the note can remove their like."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user