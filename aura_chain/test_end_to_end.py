import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def run_pipeline():
    print("🚀 Starting End-to-End Test...\n")

    # --- 1. UPLOAD CSV ---
    print("📂 Step 1: Uploading CSV...")
    try:
        with open("sales_data.csv", "rb") as f:
            files = {"file": ("sales_data.csv", f, "text/csv")}
            upload_res = requests.post(f"{BASE_URL}/data/upload", files=files)
        
        if upload_res.status_code != 200:
            print(f"❌ Upload failed: {upload_res.text}")
            return

        dataset_id = upload_res.json()["dataset_id"]
        print(f"✅ Upload success! Dataset ID: {dataset_id}")
    except FileNotFoundError:
        print("❌ Error: 'sales_data.csv' not found. Please create it first.")
        return

    # --- 2. FETCH DATA (Frontend Simulation) ---
    # In a real app, the orchestrator might fetch this from Redis automatically.
    # For now, we simulate the frontend fetching it and passing it in context.
    print(f"\n📥 Step 2: Fetching dataset content...")
    data_res = requests.get(f"{BASE_URL}/data/dataset/{dataset_id}")
    if data_res.status_code != 200:
        print("❌ Failed to retrieve dataset from Redis")
        return
        
    dataset_content = data_res.json()["data"]
    print(f"✅ Retrieved {len(dataset_content)} rows of data.")

    # --- 3. ASK ORCHESTRATOR ---
    print("\n🧠 Step 3: Asking Orchestrator to 'Analyze trends'...")
    
    payload = {
        "query": "Analyze the sales trends and forecast for next 3 days in this data",
        "user_id": "test_user_e2e",
        "context": {
            "dataset_id": dataset_id,
            "dataset": dataset_content # Passing data explicitly to helper agents
        }
    }
    
    start_time = time.time()
    query_res = requests.post(f"{BASE_URL}/orchestrator/query", json=payload, timeout=60)
    duration = time.time() - start_time
    
    if query_res.status_code == 200:
        result = query_res.json()
        print(f"\n✅ Request completed in {duration:.2f}s")
        
        # Print Plan
        agents = result.get("orchestration_plan", {}).get("agents", [])
        print(f"🤖 Agents Activated: {agents}")
        
        # Check Agent Response
        for resp in result.get("agent_responses", []):
            agent_name = resp["agent"]
            print(f"\n📋 Result from {agent_name}:")
            
            if agent_name == "TrendAnalyst":
                insights = resp["data"].get("insights", {})
                print(json.dumps(insights, indent=2))
                
            elif agent_name == "DataHarvester":
                print(resp["data"].get("analysis", "No analysis"))
                
            else:
                print(str(resp["data"])[:200] + "...")
                
    else:
        print(f"❌ Query failed: {query_res.text}")

if __name__ == "__main__":
    run_pipeline()