import asyncio
import pandas as pd
import numpy as np
from app.agents.mcts_optimizer import MCTSOptimizerAgent
from app.agents.base_agent import AgentRequest

async def test_mcts():
    # Create sample demand data
    np.random.seed(42)
    dates = pd.date_range('2024-01-01', '2024-10-01', freq='D')
    demand = np.random.poisson(100, len(dates))  # Poisson distribution
    
    df = pd.DataFrame({
        'date': dates,
        'sales': demand,
        'current_stock': [50] * len(dates)
    })
    
    agent = MCTSOptimizerAgent()
    request = AgentRequest(
        query="Optimize inventory to reduce costs",
        context={"dataset": df.to_dict('records')},
        parameters={
            "holding_cost": 5,
            "stockout_cost": 50,
            "horizon": 30,
            "iterations": 1000
        }
    )
    
    response = await agent.process(request)
    
    print(f"Success: {response.success}")
    if response.success:
        print(f"\nOptimal Action:")
        print(f"  Order Quantity: {response.data['optimal_action']['order_quantity']:.0f}")
        print(f"  Reorder Point: {response.data['optimal_action']['reorder_point']:.0f}")
        print(f"\nSavings: ₹{response.data['expected_savings']['amount_inr']:.2f}")
        print(f"Bullwhip Reduction: {response.data['bullwhip_reduction']['improvement_percentage']:.1f}%")
        print(f"\nInterpretation:\n{response.data['interpretation'][:300]}...")
    else:
        print(f"Error: {response.error}")

if __name__ == "__main__":
    asyncio.run(test_mcts())