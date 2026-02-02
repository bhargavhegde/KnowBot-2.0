from django.contrib import admin
from .models import Document, ChatSession, ChatMessage, SystemPrompt


from django.utils.html import format_html
from django.urls import reverse

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'user', 'file_type', 'index_status', 'preview_link', 'delete_link']
    readonly_fields = ['filename', 'file_path', 'indexed_at']

    def preview_link(self, obj):
        url = reverse('preview_document', args=[obj.id])
        return format_html('<a href="{}" target="_blank" class="button">Preview</a>', url)
    preview_link.short_description = 'Preview'

    def delete_link(self, obj):
        url = reverse('admin:api_document_delete', args=[obj.id])
        return format_html('<a href="{}" class="button" style="color:red;">Delete</a>', url)
    delete_link.short_description = 'Delete'


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'created_at', 'updated_at']
    list_filter = ['user']
    search_fields = ['title', 'user__username']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'role', 'short_content', 'created_at']
    list_filter = ['role', 'session__user', 'session']
    search_fields = ['content', 'session__user__username']
    
    def short_content(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    short_content.short_description = 'Content'


@admin.register(SystemPrompt)
class SystemPromptAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'user']
