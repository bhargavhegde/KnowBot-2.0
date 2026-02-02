"""
Models for KnowBot API.
Handles Documents, Chat Sessions, and Messages.
"""

from django.db import models
from django.utils import timezone


class Document(models.Model):
    """Represents an uploaded document for RAG indexing."""
    
    class IndexStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        INDEXED = 'indexed', 'Indexed'
        FAILED = 'failed', 'Failed'
    
    filename = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255)
    file_path = models.CharField(max_length=512)
    file_size = models.IntegerField(default=0)
    file_type = models.CharField(max_length=50)  # pdf, txt, md
    
    index_status = models.CharField(
        max_length=20,
        choices=IndexStatus.choices,
        default=IndexStatus.PENDING
    )
    chunk_count = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)
    
    uploaded_at = models.DateTimeField(default=timezone.now)
    indexed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.original_filename} ({self.index_status})"


class ChatSession(models.Model):
    """Represents a chat session with the RAG system."""
    
    title = models.CharField(max_length=255, default="New Chat")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Session {self.id}: {self.title}"


class ChatMessage(models.Model):
    """Individual message in a chat session."""
    
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'Assistant'
        SYSTEM = 'system', 'System'
    
    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(max_length=20, choices=Role.choices)
    content = models.TextField()
    citations = models.JSONField(default=list, blank=True)  # List of source citations
    
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"{self.role}: {preview}"


class SystemPrompt(models.Model):
    """Custom system prompts for RAG chain."""
    
    name = models.CharField(max_length=100, default="Custom Prompt")
    content = models.TextField()
    is_active = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        active_status = " (Active)" if self.is_active else ""
        return f"{self.name}{active_status}"
    
    def save(self, *args, **kwargs):
        # Ensure only one prompt is active at a time
        if self.is_active:
            SystemPrompt.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)
