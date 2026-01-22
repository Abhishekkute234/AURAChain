import requests
import json
import pandas as pd
from typing import Dict, Any

BASE_URL = "http://localhost:8000/api/v1"

class MSMEPlatformClient:
    """Python client for the MSME Agent Platform"""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
    
    def upload_dataset(self, filepath: str) -> Dict[str, Any]:
        """Upload a dataset file"""
        with open(filepath, 'rb') as f:
            files = {'file': f}
            response = self.session.post(
                f"{self.base_url}/data/upload",
                files=files
            )
            response.raise_for_status()
            return response.json()
    
    def query(
        self,
        query: str,
        user_id: str,
        context: Dict = None,
        session_id: str = None
    ) -> Dict[str, Any]:
        """Send a natural language query"""
        payload = {
            "query": query,
            "user_id": user_id,
            "context": context or {},
            "session_id": session_id
        }
        
        response = self.session.post(
            f"{self.base_url}/orchestrator/query",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    def analyze(
        self,
        dataset_id: str,
        analysis_type: str,
        parameters: Dict = None
    ) -> Dict[str, Any]:
        """Run specific analytics"""
        payload = {
            "dataset_id": dataset_id,
            "analysis_type": analysis_type,
            "parameters": parameters or {}
        }
        
        response = self.session.post(
            f"{self.base_url}/analytics/analyze",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    def health_check(self) -> Dict[str, Any]:
        """Check system health"""
        response = self.session.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()


# Example 1: Basic Sales Analysis
def example_sales_analysis():
    """Analyze sales data and get insights"""
    client = MSMEPlatformClient()
    
    # 1. Upload data
    print("📤 Uploading sales data...")
    upload_result = client.upload_dataset("data/sales_2024.csv")
    dataset_id = upload_result["dataset_id"]
    print(f"✅ Dataset uploaded: {dataset_id}")
    print(f"   Rows: {upload_result['shape'][0]}")
    print(f"   Columns: {upload_result['columns']}")
    
    # 2. Query with natural language
    print("\n🤔 Asking: 'What are the sales trends?'")
    result = client.query(
        query="Show me sales trends by product category and identify top performers",
        user_id="demo_user",
        context={"dataset_id": dataset_id}
    )
    
    # 3. Display results
    print("\n📊 Orchestration Plan:")
    print(f"   Agents used: {result['orchestration_plan']['agents']}")
    
    print("\n💡 Insights:")
    for agent_response in result['agent_responses']:
        if agent_response['success']:
            print(f"\n   [{agent_response['agent']}]")
            if 'insights' in agent_response.get('data', {}):
                insights = agent_response['data']['insights']
                for finding in insights.get('key_findings', []):
                    print(f"   • {finding}")


# Example 2: Forecasting
def example_forecasting():
    """Predict future values"""
    client = MSMEPlatformClient()
    
    # Upload time series data
    print("📤 Uploading monthly revenue data...")
    upload_result = client.upload_dataset("data/monthly_revenue.csv")
    dataset_id = upload_result["dataset_id"]
    
    # Direct forecasting
    print("\n🔮 Running forecast analysis...")
    result = client.analyze(
        dataset_id=dataset_id,
        analysis_type="forecast",
        parameters={
            "periods": 6,  # 6 months ahead
            "confidence_interval": 0.95
        }
    )
    
    print("\n📈 Forecast Results:")
    forecasts = result['results']['forecasts']
    for column, forecast_data in forecasts.items():
        print(f"\n   {column}:")
        predictions = forecast_data['predictions']
        for i, pred in enumerate(predictions, 1):
            print(f"   Month +{i}: ${pred:,.2f}")


# Example 3: Multi-Agent Workflow
def example_complex_analysis():
    """Complex analysis requiring multiple agents"""
    client = MSMEPlatformClient()
    
    upload_result = client.upload_dataset("data/customer_data.csv")
    dataset_id = upload_result["dataset_id"]
    
    # Complex query
    query = """
    Analyze customer behavior:
    1. Identify customer segments
    2. Find purchase patterns in each segment
    3. Predict customer lifetime value
    4. Recommend retention strategies
    """
    
    print("🚀 Running complex multi-agent analysis...")
    result = client.query(
        query=query,
        user_id="business_analyst_01",
        context={"dataset_id": dataset_id}
    )
    
    print("\n🎯 Execution Plan:")
    for step in result['orchestration_plan']['execution_plan']:
        print(f"   {step['agent']}: {step['task']}")
    
    print("\n📋 Results Summary:")
    for response in result['agent_responses']:
        print(f"\n   {response['agent']}:")
        print(f"   Status: {'✅ Success' if response['success'] else '❌ Failed'}")
        if response['success'] and response['data']:
            # Pretty print first level of data
            for key in list(response['data'].keys())[:3]:
                print(f"   - {key}: {str(response['data'][key])[:100]}...")


# Example 4: Optimization
def example_inventory_optimization():
    """Optimize inventory using MCTS"""
    client = MSMEPlatformClient()
    
    upload_result = client.upload_dataset("data/inventory.csv")
    dataset_id = upload_result["dataset_id"]
    
    query = """
    Optimize inventory levels to:
    - Minimize holding costs
    - Avoid stockouts
    - Consider seasonal demand
    - Maximize profit margin
    """
    
    print("⚙️ Running MCTS optimization...")
    result = client.query(
        query=query,
        user_id="operations_manager",
        context={
            "dataset_id": dataset_id,
            "constraints": {
                "max_holding_cost": 50000,
                "service_level": 0.95
            }
        }
    )
    
    print("\n🎯 Optimization Results:")
    for response in result['agent_responses']:
        if response['agent'] == 'MCTSOptimizer' and response['success']:
            solution = response['data']['optimal_solution']
            print(f"   Solution Score: {solution['score']}")
            print(f"   States Explored: {solution['explored_states']}")


# Example 5: Real-time Dashboard
def example_dashboard_data():
    """Get data for a real-time dashboard"""
    client = MSMEPlatformClient()
    
    # Simulate dashboard queries
    queries = [
        "What is today's revenue?",
        "Show active orders count",
        "Display top 5 selling products",
        "Alert me about low inventory items"
    ]
    
    dashboard_data = {}
    
    for query in queries:
        print(f"🔍 {query}")
        result = client.query(
            query=query,
            user_id="dashboard_user",
            session_id="dashboard_session_1"  # Maintain session context
        )
        
        # Extract key metrics
        metric_name = query.split()[1]  # Simple extraction
        dashboard_data[metric_name] = result['agent_responses'][0]['data']
    
    print("\n📊 Dashboard Data:")
    print(json.dumps(dashboard_data, indent=2))
