# File Reference Guide

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
