from rest_framework import serializers
from .models import Task
from django.utils import timezone


class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'created_at', 'updated_at', 'due_date', 'is_public',
            'is_overdue'
        ]

    def get_is_overdue(self, obj):
        if not obj.due_date:
            return False
        today = timezone.localtime(timezone.now()).date()
        return obj.due_date < today
