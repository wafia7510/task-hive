from rest_framework import permissions

class IsCommentOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to allow only the comment owner to edit or delete."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.commenter == request.user