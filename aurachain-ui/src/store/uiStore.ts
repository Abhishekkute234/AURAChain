import { create } from 'zustand';
import { api, type OrchestrationPlan } from '../services/api';
import { type Message } from '../components/Chat/MessageBubble';

interface DatasetContext {
  dataset_id: string;
  filename: string;
  shape: [number, number];
  columns: string[];
}

interface UIState {
  // --- Layout State ---
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  rightPanelWidth: number;
  isDarkMode: boolean;
  
  // --- Session Data ---
  sessionId: string | null;
  userId: string;
  messages: Message[];
  
  // --- Agentic State ---
  isThinking: boolean; 
  processingStep: string | null;
  
  // --- Context ---
  activeDataset: DatasetContext | null;
  selectedAgentId: string | null; 
  
  // --- Orchestration Data ---
  currentPlan: OrchestrationPlan | null;
  agentStatuses: Map<string, 'queued' | 'processing' | 'completed' | 'failed'>;
  
  // --- Actions ---
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  setSelectedAgent: (id: string | null) => void;
  toggleTheme: () => void;
  
  initializeSession: () => Promise<void>;
  uploadDataset: (file: File) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  resetSession: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // --- Initial State ---
  isSidebarOpen: true,
  isRightPanelOpen: false,
  rightPanelWidth: 450,
  isDarkMode: false,
  
  sessionId: null,
  userId: 'demo_user_01', 
  messages: [],
  
  isThinking: false,
  processingStep: null,
  
  activeDataset: null,
  selectedAgentId: null,
  currentPlan: null,
  agentStatuses: new Map(),

  // --- Layout Actions ---
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  setRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
  setSelectedAgent: (id) => set({ selectedAgentId: id, isRightPanelOpen: !!id }),
  
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode;
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDarkMode: newMode };
  }),

  // --- Functional Actions ---

  initializeSession: async () => {
    const { userId } = get();
    try {
      const res = await api.createSession(userId);
      const newSessionId = res.session_id || `sess_${Date.now()}`;
      set({ sessionId: newSessionId });
    } catch (e) {
      console.error("Session Init Failed", e);
      set({ sessionId: `offline_sess_${Date.now()}` }); 
    }
  },

  uploadDataset: async (file: File) => {
    try {
      const res = await api.uploadDataset(file);
      set({ 
        activeDataset: {
          dataset_id: res.dataset_id,
          filename: res.filename,
          shape: res.shape,
          columns: res.columns
        }
      });

      const sysMsg: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: `dataset_uploaded`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text', 
        metadata: {
            displayText: `✅ Ingested **${res.filename}** (${res.shape[0]} rows). Ready for analysis.` 
        }
      };
      
      set(state => ({ messages: [...state.messages, { ...sysMsg, text: sysMsg.metadata?.displayText || "" }] }));

    } catch (e) {
      console.error("Upload failed", e);
    }
  },

  sendMessage: async (text: string) => {
    const { sessionId, userId, activeDataset } = get();
    if (!sessionId) await get().initializeSession();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp,
      type: 'text'
    };

    set(state => ({ 
      messages: [...state.messages, userMsg],
      isThinking: true, 
      processingStep: "Orchestrator is analyzing request..."
    }));

    try {
      const context = activeDataset ? { dataset_id: activeDataset.dataset_id } : {};
      const response = await api.sendQuery(text, sessionId!, userId, context);

      // 1. Add "Thinking" Reasoning
      const reasoningMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.orchestration_plan.reasoning,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      set(state => ({ messages: [...state.messages, reasoningMsg] }));

      // 2. Add the "Plan Artifact"
      const planMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        text: 'Agent Execution Strategy', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'analysis', 
        status: 'processing',
        metadata: {
          progress: 0,
          agents: response.orchestration_plan.agents
        }
      };

      set(state => ({ 
        messages: [...state.messages, planMsg],
        currentPlan: response.orchestration_plan,
        isRightPanelOpen: true, 
        selectedAgentId: null 
      }));

      // --- STREAMING SIMULATION ---
      const agents = response.agent_responses;
      const totalAgents = agents.length;
      let completedCount = 0;

      for (const agentRes of agents) {
        set(state => ({
          processingStep: `Activating ${agentRes.agent}...`,
          agentStatuses: new Map(state.agentStatuses).set(agentRes.agent, 'processing')
        }));

        await new Promise(r => setTimeout(r, 800));

        // 3. Add the Agent Result Artifact
        const resultMsg: Message = {
          id: `${Date.now()}_${agentRes.agent}`,
          sender: 'ai',
          text: agentRes.agent, 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'analysis', 
          status: agentRes.success ? 'completed' : 'failed',
          metadata: {
            data: agentRes.data, 
            summary: "Click to view detailed report",
            agent: agentRes.agent, // <--- 🚨 THIS WAS MISSING 🚨
            success: agentRes.success,
            error: agentRes.error
          }
        };

        set(state => ({
          agentStatuses: new Map(state.agentStatuses).set(agentRes.agent, agentRes.success ? 'completed' : 'failed'),
          selectedAgentId: agentRes.agent,
          
          messages: [
            ...state.messages.map(m => 
                m.id === planMsg.id 
                  ? { ...m, metadata: { ...m.metadata, progress: Math.round(((completedCount + 1) / totalAgents) * 100) } } 
                  : m
            ),
            resultMsg
          ]
        }));

        completedCount++;
        await new Promise(r => setTimeout(r, 1200));
      }

      set(state => ({
        isThinking: false,
        processingStep: null,
        selectedAgentId: null, 
        messages: state.messages.map(m => 
            m.id === planMsg.id 
              ? { ...m, status: 'completed', metadata: { ...m.metadata, progress: 100 } } 
              : m
          )
      }));

    } catch (error: any) {
      console.error("Interaction failed", error);
      set(state => ({
        isThinking: false,
        processingStep: null,
        messages: [...state.messages, {
          id: Date.now().toString(),
          sender: 'ai',
          text: `System Error: ${error.message || "Unknown error"}`,
          timestamp,
          type: 'text'
        }]
      }));
    }
  },

  resetSession: () => set({
    messages: [],
    activeDataset: null,
    currentPlan: null,
    agentStatuses: new Map(),
    isRightPanelOpen: false
  })
}));