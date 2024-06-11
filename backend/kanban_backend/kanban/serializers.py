from rest_framework import serializers
from .models import Task, CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name']


class TaskSerializer(serializers.ModelSerializer):
    deadline = serializers.DateField(format='%d.%m.%y')
    executor = CustomUserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'executor', 'priority', 'deadline',
            'status')