"""
API Views for KnowBot.
"""

import os
import uuid
from pathlib import Path

from django.conf import settings
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Document, ChatSession, ChatMessage, SystemPrompt
from .serializers import (
    DocumentSerializer, DocumentUploadSerializer,
    ChatSessionSerializer, ChatSessionListSerializer,
    ChatMessageSerializer, ChatRequestSerializer, ChatResponseSerializer,
    SystemPromptSerializer
)
from rag.service import RAGEngine, DocumentProcessor, VectorStoreManager


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing documents."""
    
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    @action(detail=False, methods=['post'], url_path='upload')
    def upload(self, request):
        """Upload a new document."""
        serializer = DocumentUploadSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = serializer.validated_data['file']
        
        # Ensure data directory exists
        data_dir = Path(settings.DATA_DIR)
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        ext = '.' + uploaded_file.name.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = data_dir / unique_filename
        
        # Save file
        with open(file_path, 'wb') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)
        
        # Create document record
        document = Document.objects.create(
            filename=unique_filename,
            original_filename=uploaded_file.name,
            file_path=str(file_path),
            file_size=uploaded_file.size,
            file_type=ext.lstrip('.'),
            index_status=Document.IndexStatus.PENDING
        )
        
        # Trigger async indexing via Celery
        try:
            from .tasks import index_document_task
            index_document_task.delay(document.id)
        except Exception as e:
            # Fallback to synchronous indexing if Celery is unavailable
            try:
                processor = DocumentProcessor()
                chunks = processor.load_single_document(str(file_path))
                
                manager = VectorStoreManager()
                manager.create_vector_store(chunks)
                
                document.index_status = Document.IndexStatus.INDEXED
                document.chunk_count = len(chunks)
                document.indexed_at = timezone.now()
                document.save()
            except Exception as sync_error:
                document.index_status = Document.IndexStatus.FAILED
                document.error_message = str(sync_error)
                document.save()
        
        return Response(
            DocumentSerializer(document).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'], url_path='status')
    def get_status(self, request, pk=None):
        """Get indexing status of a document."""
        document = self.get_object()
        return Response({
            'id': document.id,
            'index_status': document.index_status,
            'chunk_count': document.chunk_count,
            'error_message': document.error_message
        })
    
    def destroy(self, request, *args, **kwargs):
        """Delete document and its file."""
        document = self.get_object()
        
        # Delete file from filesystem
        try:
            file_path = Path(document.file_path)
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            print(f"Error deleting file: {e}")
        
        return super().destroy(request, *args, **kwargs)


class ChatSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing chat sessions."""
    
    queryset = ChatSession.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatSessionListSerializer
        return ChatSessionSerializer
    
    @action(detail=True, methods=['get'], url_path='messages')
    def messages(self, request, pk=None):
        """Get all messages in a session."""
        session = self.get_object()
        messages = session.messages.all()
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='clear')
    def clear_messages(self, request, pk=None):
        """Clear all messages in a session."""
        session = self.get_object()
        session.messages.all().delete()
        return Response({'message': 'Messages cleared'})


@api_view(['POST'])
def chat(request):
    """
    Main chat endpoint.
    Accepts a message and optional session_id.
    Returns AI response with citations.
    """
    serializer = ChatRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    message = serializer.validated_data['message']
    session_id = serializer.validated_data.get('session_id')
    
    # Get or create session
    if session_id:
        try:
            session = ChatSession.objects.get(id=session_id)
        except ChatSession.DoesNotExist:
            session = ChatSession.objects.create()
    else:
        session = ChatSession.objects.create()
    
    # Save user message
    ChatMessage.objects.create(
        session=session,
        role=ChatMessage.Role.USER,
        content=message
    )
    
    # Get active system prompt if any
    custom_prompt = None
    try:
        active_prompt = SystemPrompt.objects.get(is_active=True)
        custom_prompt = active_prompt.content
    except SystemPrompt.DoesNotExist:
        pass
    
    # Execute RAG query
    try:
        engine = RAGEngine(custom_prompt=custom_prompt)
        result = engine.query(message)
        
        response_text = result['response']
        citations = result['citations']
        
        # Save assistant message
        ChatMessage.objects.create(
            session=session,
            role=ChatMessage.Role.ASSISTANT,
            content=response_text,
            citations=citations
        )
        
        # Update session title if first message
        if session.messages.count() <= 2:
            # Use first few words of user message as title
            title = message[:50] + "..." if len(message) > 50 else message
            session.title = title
            session.save()
        
        return Response({
            'response': response_text,
            'session_id': session.id,
            'citations': citations
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class SystemPromptViewSet(viewsets.ModelViewSet):
    """ViewSet for managing system prompts."""
    
    queryset = SystemPrompt.objects.all()
    serializer_class = SystemPromptSerializer
    
    @action(detail=False, methods=['get'], url_path='active')
    def get_active(self, request):
        """Get the currently active system prompt."""
        try:
            prompt = SystemPrompt.objects.get(is_active=True)
            return Response(SystemPromptSerializer(prompt).data)
        except SystemPrompt.DoesNotExist:
            return Response({'message': 'No active prompt. Using default.'})
    
    @action(detail=True, methods=['post'], url_path='activate')
    def activate(self, request, pk=None):
        """Activate a specific prompt."""
        prompt = self.get_object()
        prompt.is_active = True
        prompt.save()
        return Response(SystemPromptSerializer(prompt).data)
    
    @action(detail=False, methods=['post'], url_path='reset')
    def reset_to_default(self, request):
        """Reset to default prompt (deactivate all custom prompts)."""
        SystemPrompt.objects.filter(is_active=True).update(is_active=False)
        return Response({'message': 'Reset to default prompt'})


@api_view(['GET'])
def health_check(request):
    """Health check endpoint."""
    return Response({
        'status': 'healthy',
        'service': 'knowbot-api',
        'timestamp': timezone.now().isoformat()
    })
