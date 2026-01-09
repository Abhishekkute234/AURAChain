import sys
sys.path.insert(0, '/app')

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.database import Base
from app.config import get_settings

async def setup_database():
    try:
        settings = get_settings()
        
        engine = create_async_engine(
            settings.DATABASE_URL,
            echo=True
        )
        
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        print("✓ Database tables created successfully!")
    except Exception as e:
        print(f"Error: {e}")
        print("Note: Database will be created on first use automatically.")

if __name__ == "__main__":
    asyncio.run(setup_database())