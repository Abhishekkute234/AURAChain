from sqlalchemy import Column, String, Integer, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    company = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    
    sessions = relationship("Session", back_populates="user")
    datasets = relationship("Dataset", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)
    message_count = Column(Integer, default=0)
    status = Column(String, default="active")
    
    user = relationship("User", back_populates="sessions")
    executions = relationship("AgentExecution", back_populates="session")

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    size_bytes = Column(Integer)
    row_count = Column(Integer)
    column_count = Column(Integer)
    columns = Column(JSON)
    dtypes = Column(JSON)
    storage_path = Column(String)
    
    user = relationship("User", back_populates="datasets")
    analyses = relationship("AnalyticsResult", back_populates="dataset")

class AgentExecution(Base):
    __tablename__ = "agent_executions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"))
    agent_type = Column(String, nullable=False)
    query = Column(String)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    duration_ms = Column(Float)
    success = Column(Boolean)
    error = Column(String)
    tokens_used = Column(Integer)
    metadata = Column(JSON)
    
    session = relationship("Session", back_populates="executions")

class AnalyticsResult(Base):
    __tablename__ = "analytics_results"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, ForeignKey("datasets.id"))
    analysis_type = Column(String, nullable=False)
    results = Column(JSON)
    generated_at = Column(DateTime, default=datetime.utcnow)
    agent_used = Column(String)
    
    dataset = relationship("Dataset", back_populates="analyses")

# ============================================
# Database Setup Script
# ============================================

# scripts/setup_db.py
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.database import Base
from app.config import get_settings

async def setup_database():
    settings = get_settings()
    
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=True
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(setup_database())
"""

# ============================================
# Testing Setup
# ============================================

# tests/conftest.py
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def test_user_id():
    return "test_user_123"

@pytest.fixture
async def test_session_id():
    return "test_session_123"
"""

# tests/test_api/test_orchestrator.py
"""
import pytest
from fastapi.testclient import TestClient

def test_query_endpoint(client):
    response = client.post(
        "/api/v1/orchestrator/query",
        json={
            "query": "Show me sales trends",
            "user_id": "test_user"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "orchestration_plan" in data
    assert "agent_responses" in data
"""