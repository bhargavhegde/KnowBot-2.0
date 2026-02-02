"""
Hybrid Search Module for KnowBot 2.0

Implements BM25 + Semantic (Vector) search fusion using Reciprocal Rank Fusion (RRF).
This improves retrieval accuracy by combining exact keyword matching with semantic understanding.
"""

from typing import List, Dict, Any, Optional
from collections import defaultdict

from langchain_core.documents import Document


# Try to import rank_bm25
try:
    from rank_bm25 import BM25Okapi
    BM25_AVAILABLE = True
except ImportError:
    BM25_AVAILABLE = False
    print("Warning: rank_bm25 not installed. Hybrid search disabled.")


def is_bm25_available() -> bool:
    """Check if BM25 is available."""
    return BM25_AVAILABLE


def tokenize(text: str) -> List[str]:
    """
    Simple tokenizer for BM25.
    Lowercases and splits on whitespace/punctuation.
    """
    import re
    # Remove punctuation and lowercase
    text = re.sub(r'[^\w\s]', ' ', text.lower())
    # Split on whitespace and filter empty
    tokens = [t.strip() for t in text.split() if t.strip()]
    return tokens


class BM25Index:
    """
    BM25 keyword index for document chunks.
    """
    
    def __init__(self, documents: List[Document] = None):
        """
        Initialize the BM25 index.
        
        Args:
            documents: Optional list of LangChain Documents to index
        """
        self.documents: List[Document] = []
        self.tokenized_corpus: List[List[str]] = []
        self.bm25: Optional[BM25Okapi] = None
        
        if documents:
            self.add_documents(documents)
    
    def add_documents(self, documents: List[Document]) -> None:
        """
        Add documents to the BM25 index.
        
        Args:
            documents: List of LangChain Documents
        """
        if not BM25_AVAILABLE:
            print("Warning: BM25 not available, skipping index update")
            return
        
        for doc in documents:
            self.documents.append(doc)
            tokens = tokenize(doc.page_content)
            self.tokenized_corpus.append(tokens)
        
        # Rebuild BM25 index
        if self.tokenized_corpus:
            self.bm25 = BM25Okapi(self.tokenized_corpus)
            print(f"BM25 index updated: {len(self.documents)} documents")
    
    def search(self, query: str, k: int = 10) -> List[tuple]:
        """
        Search the BM25 index.
        
        Args:
            query: Search query string
            k: Number of results to return
        
        Returns:
            List of (document, score) tuples
        """
        if not BM25_AVAILABLE or self.bm25 is None:
            return []
        
        query_tokens = tokenize(query)
        scores = self.bm25.get_scores(query_tokens)
        
        # Get top k documents with their scores
        doc_scores = [(self.documents[i], scores[i]) for i in range(len(scores))]
        doc_scores.sort(key=lambda x: x[1], reverse=True)
        
        return doc_scores[:k]
    
    def clear(self) -> None:
        """Clear the index."""
        self.documents = []
        self.tokenized_corpus = []
        self.bm25 = None


class HybridRetriever:
    """
    Hybrid retriever that fuses BM25 and semantic search results
    using Reciprocal Rank Fusion (RRF).
    """
    
    def __init__(
        self,
        vector_retriever,
        bm25_index: BM25Index,
        semantic_weight: float = 0.5,
        bm25_weight: float = 0.5,
        rrf_k: int = 60
    ):
        """
        Initialize hybrid retriever.
        
        Args:
            vector_retriever: LangChain vector store retriever
            bm25_index: BM25Index instance
            semantic_weight: Weight for semantic search results (0-1)
            bm25_weight: Weight for BM25 results (0-1)
            rrf_k: RRF constant (typically 60)
        """
        self.vector_retriever = vector_retriever
        self.bm25_index = bm25_index
        self.semantic_weight = semantic_weight
        self.bm25_weight = bm25_weight
        self.rrf_k = rrf_k
    
    def _reciprocal_rank_fusion(
        self,
        semantic_docs: List[Document],
        bm25_results: List[tuple],
        k: int
    ) -> List[Document]:
        """
        Fuse results using Reciprocal Rank Fusion.
        
        RRF score = sum(weight / (rrf_k + rank))
        
        Args:
            semantic_docs: Documents from semantic search (in ranked order)
            bm25_results: (doc, score) tuples from BM25 search
            k: Number of final results
        
        Returns:
            Fused list of documents sorted by RRF score
        """
        # Calculate RRF scores
        rrf_scores: Dict[str, float] = defaultdict(float)
        doc_map: Dict[str, Document] = {}
        
        # Process semantic results
        for rank, doc in enumerate(semantic_docs, start=1):
            # Use content hash as document ID
            doc_id = hash(doc.page_content)
            rrf_scores[doc_id] += self.semantic_weight / (self.rrf_k + rank)
            doc_map[doc_id] = doc
        
        # Process BM25 results
        for rank, (doc, score) in enumerate(bm25_results, start=1):
            doc_id = hash(doc.page_content)
            rrf_scores[doc_id] += self.bm25_weight / (self.rrf_k + rank)
            if doc_id not in doc_map:
                doc_map[doc_id] = doc
        
        # Sort by RRF score
        sorted_ids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
        
        # Return top k documents
        return [doc_map[doc_id] for doc_id in sorted_ids[:k]]
    
    def invoke(self, query: str, k: int = 5) -> List[Document]:
        """
        Retrieve documents using hybrid search.
        
        Args:
            query: Search query
            k: Number of documents to return
        
        Returns:
            List of documents fused from both search methods
        """
        # Get more results from each method, then fuse
        fetch_k = k * 2
        
        # Semantic search
        semantic_docs = self.vector_retriever.invoke(query)[:fetch_k]
        
        # BM25 search
        bm25_results = self.bm25_index.search(query, k=fetch_k)
        
        # If BM25 has no results, fall back to pure semantic
        if not bm25_results:
            return semantic_docs[:k]
        
        # Fuse results
        return self._reciprocal_rank_fusion(semantic_docs, bm25_results, k)
    
    def get_relevant_documents(self, query: str) -> List[Document]:
        """LangChain-compatible method."""
        return self.invoke(query)


# Global BM25 index cache (per user)
_BM25_INDEXES: Dict[int, BM25Index] = {}


def get_bm25_index(user_id: int = None) -> BM25Index:
    """
    Get or create BM25 index for a user.
    
    Args:
        user_id: User ID for index isolation
    
    Returns:
        BM25Index instance
    """
    key = user_id or 0
    if key not in _BM25_INDEXES:
        _BM25_INDEXES[key] = BM25Index()
    return _BM25_INDEXES[key]


def update_bm25_index(documents: List[Document], user_id: int = None) -> None:
    """
    Update the BM25 index with new documents.
    
    Args:
        documents: Documents to add
        user_id: User ID for index isolation
    """
    index = get_bm25_index(user_id)
    index.add_documents(documents)


def create_hybrid_retriever(
    vector_retriever,
    user_id: int = None,
    semantic_weight: float = 0.6,
    bm25_weight: float = 0.4
) -> HybridRetriever:
    """
    Create a hybrid retriever combining vector search and BM25.
    
    Args:
        vector_retriever: LangChain vector store retriever
        user_id: User ID for BM25 index isolation
        semantic_weight: Weight for semantic results
        bm25_weight: Weight for BM25 results
    
    Returns:
        HybridRetriever instance
    """
    bm25_index = get_bm25_index(user_id)
    return HybridRetriever(
        vector_retriever=vector_retriever,
        bm25_index=bm25_index,
        semantic_weight=semantic_weight,
        bm25_weight=bm25_weight
    )
