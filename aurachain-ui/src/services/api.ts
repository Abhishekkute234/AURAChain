// src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// --- Types based on your Backend ---

export interface OrchestrationPlan {
  reasoning: string;
  agents: string[];
  execution_plan: Array<{
    agent: string;
    task: string;
    parameters: Record<string, any>;
  }>;
  requires_data: boolean;
}

export interface AgentResponseData {
  agent: string;
  success: boolean;
  data: any; // Flexible to handle Charts, Tables, Text
  error?: string;
}

export interface QueryResponse {
  request_id: string;
  orchestration_plan: OrchestrationPlan;
  agent_responses: AgentResponseData[];
  success: boolean;
  error?: string;
}

export interface DatasetResponse {
  dataset_id: string;
  filename: string;
  shape: [number, number]; // [rows, cols]
  columns: string[];
}

export const api = {
  // 1. Initialize a new Session
  createSession: async (userId: string) => {
    // We send a dummy init query to get a session ID from the backend
    // Or you can create a specific GET /session/new endpoint on backend
    const response = await fetch(`${API_URL}/orchestrator/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: "SESSION_INIT", // Special flag or just handle generic init
        user_id: userId,
        context: {}
      })
    });
    return response.json();
  },

  // 2. The Main Interaction Loop
  sendQuery: async (
    query: string, 
    sessionId: string, 
    userId: string,
    context: Record<string, any> = {}
  ): Promise<QueryResponse> => {
    const response = await fetch(`${API_URL}/orchestrator/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        session_id: sessionId,
        user_id: userId,
        context, 
        parameters: {}
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  // 3. File Upload
  uploadDataset: async (file: File): Promise<DatasetResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/data/upload`, {
      method: 'POST',
      body: formData // Content-Type header is auto-set by browser for FormData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  // 4. Human-in-the-Loop Approval (For OrderManager)
  approveOrder: async (orderId: string, sessionId: string) => {
    // Assuming you add this endpoint to your backend later
    // For now, we mock a success response to keep UI working
    console.log(`Approving order ${orderId} for session ${sessionId}`);
    return { success: true, message: "Order approved and sent to vendor." };
  }
};