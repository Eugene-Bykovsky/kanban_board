from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    telegram_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    executor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL,
                                 null=True,
                                 blank=True)
    priority = models.CharField(max_length=255, choices=PRIORITY_CHOICES,
                                null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
