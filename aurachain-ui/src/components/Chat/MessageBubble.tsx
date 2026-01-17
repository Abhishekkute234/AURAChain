import React from 'react';
import { clsx } from 'clsx';
import { BrainCircuit, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

// 👇 UPDATED INTERFACE
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  type: 'text' | 'analysis' | 'agent_result'; 
  status?: 'processing' | 'completed' | 'failed';
  metadata?: {
    title?: string;  
    agents?: string[];
    progress?: number;
    data?: any;
    agent?: string; 
    summary?: string;
    success?: boolean; 
    error?: string; 
    displayText?: string; // <--- ADDED THIS PROPERTY
  };
}

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const { setSelectedAgent, setRightPanelOpen } = useUIStore();

  // --- ARTIFACT CARD RENDERER ---
  if (message.type === 'analysis' || message.type === 'agent_result') {
    const isPlan = !!message.metadata?.agents; 
    const isResult = !!message.metadata?.data;

    return (
      <div className="mb-8 max-w-[85%] animate-fade-in-up">
        <div className="flex items-center text-xs font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">
          <BrainCircuit size={14} className="mr-2" />
          {isPlan ? "Orchestrator Plan" : message.metadata?.agent || "Agent Artifact"}
        </div>
        
        <div 
          onClick={() => {
             if (isResult) {
                 setSelectedAgent(message.metadata?.agent || null); 
                 setRightPanelOpen(true);
             } else if (isPlan) {
                 setSelectedAgent(null); 
                 setRightPanelOpen(true);
             }
          }}
          className={clsx(
            "group relative bg-white dark:bg-[#212121] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all overflow-hidden",
            (isResult || isPlan) 
              ? "hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer" 
              : ""
          )}
        >
          <div className={clsx(
            "absolute left-0 top-0 bottom-0 w-1 transition-colors",
            message.status === 'processing' ? "bg-accent-amber" : 
            message.status === 'failed' ? "bg-red-500" : "bg-accent-teal"
          )} />

          <div className="p-5 pl-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-heading font-semibold text-lg text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {message.text}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isPlan 
                    ? "Executing agent workflow..." 
                    : message.metadata?.summary || "Click to view detailed analysis"
                  }
                </p>
              </div>
              
              <div className={clsx(
                "p-1.5 rounded-lg transition-colors",
                message.status === 'processing' 
                    ? "bg-amber-50 text-accent-amber" 
                    : message.status === 'failed'
                    ? "bg-red-50 text-red-500"
                    : "bg-teal-50 dark:bg-teal-900/20 text-accent-teal"
              )}>
                {message.status === 'processing' ? (
                    <Clock size={18} className="animate-spin" />
                ) : (
                    isResult ? <ArrowRight size={18} /> : <CheckCircle2 size={18} />
                )}
              </div>
            </div>
            
            {(message.status === 'processing' || isPlan) && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center text-slate-500">
                            {message.status === 'processing' ? "Processing..." : "Workflow Progress"}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">{message.metadata?.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={clsx(
                                "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                                message.status === 'processing' ? "bg-accent-amber" : "bg-accent-teal"
                            )}
                            style={{ width: `${message.metadata?.progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                    </div>

                    {isPlan && message.metadata?.agents && (
                        <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                            {message.metadata.agents.map((agent, idx) => (
                                <span key={idx} className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                    {agent}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
        <span className="text-[10px] text-slate-400 ml-1 mt-2 block">{message.timestamp}</span>
      </div>
    );
  }

  // --- STANDARD TEXT MESSAGE ---
  return (
    <div className={clsx("flex w-full mb-6 animate-fade-in-up", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("max-w-[75%] flex flex-col", isUser ? "items-end" : "items-start")}>
        
        {!isUser && (
          <span className="flex items-center text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">
            <BrainCircuit size={12} className="mr-1.5" />
            Orchestrator
          </span>
        )}

        <div className={clsx(
          "px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
          isUser 
            ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm" 
            : "bg-white dark:bg-[#212121] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm"
        )}>
          {/* Support custom display text via metadata (e.g. for system messages) */}
          {message.metadata?.displayText || message.text}
        </div>
        
        <span className={clsx("text-[10px] text-slate-400 mt-1.5", isUser ? "mr-1" : "ml-1")}>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;