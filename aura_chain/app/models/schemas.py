from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum

class AgentType(str, Enum):
    ORCHESTRATOR = "orchestrator"
    DATA_HARVESTER = "data_harvester"
    VISUALIZER = "visualizer"
    TREND_ANALYST = "trend_analyst"
    FORECASTER = "forecaster"
    MCTS_OPTIMIZER = "mcts_optimizer"
    ORDER_MANAGER = "order_manager"
    NOTIFIER = "notifier"

class ModelProvider(str, Enum):
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    OPENAI = "openai"

class DatasetSchema(BaseModel):
    dataset_id: str
    filename: str
    uploaded_at: datetime
    size_bytes: int
    row_count: int
    column_count: int
    columns: List[str]
    dtypes: Dict[str, str]

class UserSchema(BaseModel):
    user_id: str
    email: str
    company: Optional[str] = None
    created_at: datetime
    last_active: datetime

class SessionSchema(BaseModel):
    session_id: str
    user_id: str
    started_at: datetime
    last_activity: datetime
    message_count: int
    status: str  # 'active', 'ended'

class AgentExecutionSchema(BaseModel):
    execution_id: str
    agent_type: AgentType
    query: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_ms: Optional[float] = None
    success: bool
    error: Optional[str] = None
    tokens_used: Optional[int] = None

class AnalyticsResultSchema(BaseModel):
    result_id: str
    dataset_id: str
    analysis_type: str
    results: Dict[str, Any]
    generated_at: datetime
    agent_used: AgentType


# ============================================
# Docker Configuration
# ============================================

# docker-compose.yml
"""
version: '3.8'

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

  prometheus:
    image: prom/prometheus:latest
    container_name: msme_prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    container_name: msme_grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
"""

# Dockerfile
"""
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

# prometheus.yml
"""
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'msme_platform'
    static_configs:
      - targets: ['api:8000']
    metrics_path: '/api/v1/health/metrics'
"""

# .dockerignore
"""
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.gitignore
.mypy_cache
.pytest_cache
.hypothesis
*.db
*.sqlite
.DS_Store
.env
.vscode
.idea
"""