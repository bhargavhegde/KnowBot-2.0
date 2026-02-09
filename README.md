# KnowBot 2.0 - The Neural Knowledge Assistant 🧠⚡
<img width="2404" height="1187" alt="image" src="https://github.com/user-attachments/assets/ed61a9c1-fd7e-42a5-9214-24f9cfea72c6" />

**KnowBot 2.0** was an experimental migration phase exploring Docker containerization and Next.js frontend development. This version bridges the gap between the simple Streamlit v1.0 and the production-ready v3.0.

> **Status**: This is an experimental/intermediate version. For production use, see [KnowBot 3.0](https://github.com/bhargavhegde/KnowBot3.0).

---

## 🚀 What's in 2.0?

This version experimented with:

- **Next-Gen Cybernetic UI**: Early prototype with Next.js 15, Framer Motion, and Tailwind CSS
- **Persistent Chat History**: Multi-session support experiments
- **Django Backend**: REST API with Celery/Redis async task queue
- **Docker Setup**: Full-stack containerization attempt
- **Multi-User Foundation**: JWT authentication groundwork

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: React Context API

### Backend
- **Framework**: Django REST Framework
- **Task Queue**: Celery + Redis
- **Database**: PostgreSQL (metadata) + ChromaDB (vectors)
- **RAG Engine**: LangChain + Ollama

### AI Core
- **LLM**: Llama 3.1 8B (via Ollama)
- **Embeddings**: Nomic Embed Text
- **Vector Store**: Chroma

---

## 🏗️ Quick Start (Experimental)

### Option 1: Streamlit (Legacy Mode)

```bash
cd ~/Desktop/Knowbot2.0
python3 -m venv rag_env
source rag_env/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

### Option 2: Docker (Full Stack)

**Prerequisites:**
- Docker & Docker Compose installed
- Ollama running locally

```bash
# Pull models first
ollama pull llama3.1:8b
ollama pull nomic-embed-text

# Setup environment
cp .env.example .env

# Launch stack
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin**: http://localhost:8000/admin

---

## 📂 Project Structure

```text
KnowBot-2.0/
├── backend/            # Django REST Framework app
│   ├── api/            # Endpoints for chat, docs, auth
│   ├── rag/            # LangChain RAG engine
│   └── knowbot/        # Settings & Celery config
├── frontend/           # Next.js 15 Application
│   ├── src/app/        # Pages (Login, Chat, Register)
│   ├── src/components/ # UI Components
│   └── src/context/    # State management
├── streamlit_backup/   # Legacy v1.0 code
└── docker-compose.yml  # Full-stack orchestration
```

---

## 🔄 Version History

- **[v1.0](https://github.com/bhargavhegde/RAG-KnowBot)**: Simple Streamlit app (fully local)
- **v2.0** (this repo): Docker + Next.js experimentation
- **[v3.0](https://github.com/bhargavhegde/KnowBot3.0)**: Production deployment on Vercel/Railway

**Key Learnings from v2.0:**
- Docker adds complexity for local RAG (Ollama networking issues)
- Decided to go full cloud-native instead
- Validated Django/Next.js stack choice for v3.0

---

## 📄 License

MIT License - 2024 Bhargav Hegde
