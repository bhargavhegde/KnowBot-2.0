"""
URL routes for KnowBot API.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    DocumentViewSet, ChatSessionViewSet, SystemPromptViewSet,
    chat, health_check
)

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'sessions', ChatSessionViewSet, basename='session')
router.register(r'prompts', SystemPromptViewSet, basename='prompt')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', chat, name='chat'),
    path('health/', health_check, name='health'),
]
