#!/usr/bin/env python3
"""
MSME Agent Platform - Complete Setup Script
This script creates the entire project structure with all necessary files
"""
import os
from pathlib import Path

# File contents as dictionary
FILES = {
    "requirements.txt": """fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0
anthropic==0.18.1
google-generativeai==0.3.2
openai==1.12.0
pandas==2.2.0
numpy==1.26.3
redis==5.0.1
sqlalchemy==2.0.25
asyncpg==0.29.0
httpx==0.26.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
loguru==0.7.2
prometheus-client==0.19.0
opentelemetry-api==1.22.0
opentelemetry-sdk==1.22.0
opentelemetry-instrumentation-fastapi==0.43b0
aiofiles==23.2.1
plotly==5.18.0
scipy==1.12.0
scikit-learn==1.4.0
joblib==1.3.2
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.26.0""",

    ".env.example": """# API Keys (Required)
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=AIza-your-key-here
OPENAI_API_KEY=sk-your-key-here

# Application
DEBUG=false
API_PREFIX=/api/v1
APP_NAME=MSME Agent Platform
APP_VERSION=1.0.0

# Server
HOST=0.0.0.0
PORT=8000
WORKERS=4

# Database
DATABASE_URL=postgresql+asyncpg://msme:msme123@localhost/msme_db

# Redis
REDIS_URL=redis://localhost:6379/0
REDIS_TTL=3600

# Storage
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=52428800

# Security
SECRET_KEY=generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Observability
LOG_LEVEL=INFO
ENABLE_METRICS=true
ENABLE_TRACING=true

# Agent Models
ORCHESTRATOR_MODEL=claude-sonnet-4-5-20250929
DATA_HARVESTER_MODEL=gemini-1.5-flash
VISUALIZER_MODEL=claude-sonnet-4-20250514
TREND_ANALYST_MODEL=gemini-2.0-flash-exp
FORECASTER_MODEL=claude-sonnet-4-20250514
MCTS_OPTIMIZER_MODEL=claude-sonnet-4-20250514
ORDER_MANAGER_MODEL=gpt-4o
NOTIFIER_MODEL=gpt-4o-mini

# Timeouts & Limits
API_TIMEOUT=60
MAX_TOKENS=4000
MAX_AGENTS_PARALLEL=3""",

    ".gitignore": """__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv
*.log
.env
.DS_Store
.vscode/
.idea/
*.db
*.sqlite
uploads/
logs/
.pytest_cache/
.coverage
htmlcov/
dist/
build/
*.egg-info/""",

    "README.md": """# MSME Multi-Agent Intelligence Platform

Production-grade AI backend for business intelligence

## Quick Start

1. Copy environment file:
```bash
   cp .env.example .env
```

2. Add your API keys to `.env`

3. Start with Docker:
```bash
   docker-compose up -d
```

4. Access API at: http://localhost:8000/docs

## Documentation

- See `docs/ARCHITECTURE.md` for system design
- See `docs/API.md` for endpoint documentation
- See `examples/` for usage examples

## Features

- 8 specialized AI agents
- Multi-model support (Claude, Gemini, GPT)
- Full observability (logs, traces, metrics)
- Memory & context management
- Docker deployment ready
""",

    "docker-compose.yml": """version: '3.8'

services:
  api:
    build: .
    container_name: msme_api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://msme:msme123@db:5432/msme_db
      - REDIS_URL=redis://redis:6379/0
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:15-alpine
    container_name: msme_db
    environment:
      - POSTGRES_USER=msme
      - POSTGRES_PASSWORD=msme123
      - POSTGRES_DB=msme_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: msme_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:""",

    "Dockerfile": """FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc postgresql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p logs uploads

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]""",
}

def create_project_structure():
    """Create complete project structure"""
    
    # Define directory structure
    directories = [
        "app",
        "app/core",
        "app/agents",
        "app/tools",
        "app/models",
        "app/api",
        "app/api/routes",
        "app/services",
        "app/utils",
        "tests",
        "tests/test_agents",
        "tests/test_tools",
        "tests/test_api",
        "scripts",
        "examples",
        "docs",
        "logs",
        "uploads",
    ]
    
    print("Creating MSME Agent Platform Project Structure...\n")
    
    # Create directories
    print("Creating directories...")
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        # Create __init__.py for Python packages
        if directory.startswith("app") or directory.startswith("tests"):
            init_file = Path(directory) / "__init__.py"
            init_file.touch(exist_ok=True)
    print("Directories created\n")
    
    # Create root files
    print("Creating root files...")
    for filename, content in FILES.items():
        filepath = Path(filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"   Created: {filename}")
    print()
    
    # Create instruction file
    print("Creating setup instructions...")
    instructions = """# MSME Agent Platform - Setup Instructions

## What Was Created

This script created the project structure. Now you need to:

## Step 1: Get the Code Files

The code is in the chat artifacts. You need to:

1. Scroll up in the chat
2. Find each artifact (there are 12 of them)
3. Copy the code from each artifact into the corresponding file

### Files to Copy:

**Core Files:**
- `app/config.py` - From artifact "Configuration & Environment Setup"
- `app/main.py` - From artifact "FastAPI Routes & Main Application"

**Core Infrastructure:**
- `app/core/api_clients.py` - From "API Client Wrappers"
- `app/core/observability.py` - From "Observability Layer"
- `app/core/memory.py` - From "Memory & Session Management"

**Agents:**
- `app/agents/base_agent.py` - From "Base Agent & Orchestrator"
- `app/agents/orchestrator.py` - From "Base Agent & Orchestrator"
- `app/agents/data_harvester.py` - From "Specialized Agents"
- `app/agents/visualizer.py` - From "Specialized Agents"
- `app/agents/trend_analyst.py` - From "Specialized Agents"
- `app/agents/forecaster.py` - From "Specialized Agents"
- `app/agents/mcts_optimizer.py` - From "Specialized Agents"
- `app/agents/order_manager.py` - From "Specialized Agents"
- `app/agents/notifier.py` - From "Specialized Agents"

**Tools:**
- `app/tools/data_tools.py` - From "Agent Tools & MCP Implementation"
- `app/tools/analysis_tools.py` - From "Agent Tools & MCP Implementation"
- `app/tools/mcp_tools.py` - From "Agent Tools & MCP Implementation"

**API Routes:**
- `app/api/routes/orchestrator.py` - From "FastAPI Routes & Main Application"
- `app/api/routes/data.py` - From "FastAPI Routes & Main Application"
- `app/api/routes/analytics.py` - From "FastAPI Routes & Main Application"
- `app/api/routes/health.py` - From "FastAPI Routes & Main Application"

**Models:**
- `app/models/schemas.py` - From "Pydantic Models & Docker Configuration"
- `app/models/database.py` - From "Pydantic Models & Docker Configuration"

**Examples:**
- `examples/basic_usage.py` - From "Usage Examples & Quick Start Script"
- `scripts/quick_start.py` - From "Usage Examples & Quick Start Script"

## Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
```

## Step 3: Install Dependencies
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install packages
pip install -r requirements.txt
```

## Step 4: Start Services

### Option A: Docker (Recommended)
```bash
docker-compose up -d
```

### Option B: Local Development
```bash
# Start Redis and PostgreSQL separately
# Then run:
python scripts/setup_db.py
uvicorn app.main:app --reload
```

## Step 5: Test
```bash
# Check health
curl http://localhost:8000/api/v1/health

# Run examples
python examples/basic_usage.py
```

## Documentation

See the artifacts in the chat for complete code and documentation.
"""
    
    with open("SETUP_INSTRUCTIONS.md", 'w', encoding='utf-8') as f:
        f.write(instructions)
    print("Created SETUP_INSTRUCTIONS.md\n")
    
    # Create a reference guide
    reference = """# File Reference Guide

## Where to Find Each File's Code

All code is in the chat artifacts above. Here's the mapping:

### Artifact 2: "Configuration & Environment Setup"
- app/config.py
- .env.example

### Artifact 3: "API Client Wrappers"
- app/core/api_clients.py

### Artifact 4: "Observability Layer"
- app/core/observability.py

### Artifact 5: "Memory & Session Management"
- app/core/memory.py

### Artifact 6: "Base Agent & Orchestrator"
- app/agents/base_agent.py
- app/agents/orchestrator.py

### Artifact 7: "Specialized Agents"
- app/agents/data_harvester.py
- app/agents/visualizer.py
- app/agents/trend_analyst.py
- app/agents/forecaster.py
- app/agents/mcts_optimizer.py
- app/agents/order_manager.py
- app/agents/notifier.py

### Artifact 8: "Agent Tools & MCP"
- app/tools/data_tools.py
- app/tools/analysis_tools.py
- app/tools/mcp_tools.py

### Artifact 9: "FastAPI Routes & Main"
- app/main.py
- app/api/routes/orchestrator.py
- app/api/routes/data.py
- app/api/routes/analytics.py
- app/api/routes/health.py

### Artifact 10: "Pydantic Models & Docker"
- app/models/schemas.py
- app/models/database.py

### Artifact 11: "Usage Examples"
- examples/basic_usage.py
- scripts/quick_start.py

## How to Use

1. Create the file in the correct location
2. Copy the code from the artifact
3. Paste into the file
4. Save

Repeat for all files above.
"""
    
    with open("FILE_REFERENCE.md", 'w', encoding='utf-8') as f:
        f.write(reference)
    print("Created FILE_REFERENCE.md\n")
    
    print("=" * 60)
    print("PROJECT STRUCTURE CREATED SUCCESSFULLY!")
    print("=" * 60)
    print("\nNext Steps:\n")
    print("1. Read SETUP_INSTRUCTIONS.md")
    print("2. Copy code from artifacts into files (see FILE_REFERENCE.md)")
    print("3. Configure .env with your API keys")
    print("4. Run: docker-compose up -d")
    print("\nAll code is in the artifacts above in this chat!")

if __name__ == "__main__":
    create_project_structure()