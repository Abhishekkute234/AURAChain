import subprocess
import time
import sys
import os

def run_command(cmd: str, description: str):
    """Run shell command with progress indication"""
    print(f"\n🔄 {description}...")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr}")
        sys.exit(1)
    print(f"✅ {description} completed")
    return result.stdout

def wait_for_service(url: str, max_attempts: int = 30):
    """Wait for service to be ready"""
    import requests
    
    print(f"⏳ Waiting for service at {url}...")
    for i in range(max_attempts):
        try:
            response = requests.get(url, timeout=2)
            if response.status_code == 200:
                print("✅ Service is ready!")
                return True
        except:
            pass
        time.sleep(2)
        print(f"   Attempt {i+1}/{max_attempts}...")
    
    print("❌ Service failed to start")
    return False

def main():
    print("🚀 MSME Agent Platform - Quick Start")
    print("=" * 50)
    
    # Check prerequisites
    print("\n📋 Checking prerequisites...")
    
    if not os.path.exists(".env"):
        print("⚠️  .env file not found. Creating from template...")
        run_command("cp .env.example .env", "Creating .env file")
        print("\n⚠️  Please edit .env with your API keys before continuing!")
        print("   Required keys: ANTHROPIC_API_KEY, GOOGLE_API_KEY, OPENAI_API_KEY")
        sys.exit(0)
    
    # Check Docker
    try:
        run_command("docker --version", "Checking Docker")
        run_command("docker-compose --version", "Checking Docker Compose")
    except:
        print("❌ Docker not found. Please install Docker Desktop")
        sys.exit(1)
    
    # Start services
    print("\n🐳 Starting Docker services...")
    run_command(
        "docker-compose up -d",
        "Starting containers"
    )
    
    # Wait for API
    if not wait_for_service("http://localhost:8000/api/v1/health"):
        sys.exit(1)
    
    # Setup database
    print("\n🗄️  Setting up database...")
    run_command(
        "docker-compose exec -T api python scripts/setup_db.py",
        "Creating database tables"
    )
    
    # Run basic test
    print("\n🧪 Running health check...")
    import requests
    response = requests.get("http://localhost:8000/api/v1/health")
    print(f"   Status: {response.json()['status']}")
    
    # Success message
    print("\n" + "=" * 50)
    print("✅ Setup complete!")
    print("\n📚 Next steps:")
    print("   1. API is running at: http://localhost:8000")
    print("   2. API docs at: http://localhost:8000/docs")
    print("   3. Grafana at: http://localhost:3000 (admin/admin)")
    print("   4. Prometheus at: http://localhost:9090")
    print("\n💡 Try the examples:")
    print("   python examples/basic_usage.py")
    print("\n🛑 To stop:")
    print("   docker-compose down")

if __name__ == "__main__":
    main()