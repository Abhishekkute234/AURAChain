# test_discord.py
import asyncio
from app.agents.notifier import NotifierAgent
from app.agents.base_agent import AgentRequest

async def test_discord():
    agent = NotifierAgent()
    
    # Test 1: Simple notification
    request = AgentRequest(
        query="System initialized successfully",
        parameters={"type": "success"}
    )
    response = await agent.process(request)
    print(f"Test 1 - Success: {response.success}")
    
    # Test 2: Forecast notification with embed
    request = AgentRequest(
        query="Sales forecast completed",
        parameters={"type": "forecast"},
        context={
            "forecast": {
                "periods": 30,
                "confidence": 0.87
            }
        }
    )
    response = await agent.process(request)
    print(f"Test 2 - Success: {response.success}")
    
    # Test 3: Optimization notification
    request = AgentRequest(
        query="Inventory optimization complete",
        parameters={"type": "optimization"},
        context={
            "savings": {
                "amount": 18000,
                "percentage": 23
            },
            "bullwhip_reduction": {
                "improvement_percentage": 45.8
            },
            "order_details": {
                "quantity": 180,
                "reorder_point": 150
            }
        }
    )
    response = await agent.process(request)
    print(f"Test 3 - Success: {response.success}")

if __name__ == "__main__":
    asyncio.run(test_discord())