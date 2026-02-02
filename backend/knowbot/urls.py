"""
URL configuration for knowbot project.
"""

from django.contrib import admin
from django.urls import path, include

admin.site.site_header = "KnowBot Admin"
admin.site.site_title = "KnowBot Admin Portal"
admin.site.index_title = "Welcome to KnowBot Admin"
admin.site.site_url = "http://localhost:3000"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
