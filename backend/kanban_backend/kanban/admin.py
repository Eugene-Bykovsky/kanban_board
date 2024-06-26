from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Task


class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name',
                    'telegram_id', 'is_staff']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info',
         {'fields': ('email', 'first_name', 'last_name', 'telegram_id')}),
        ('Permissions', {'fields': (
            'is_active', 'is_staff', 'is_superuser', 'groups',
            'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Task)
