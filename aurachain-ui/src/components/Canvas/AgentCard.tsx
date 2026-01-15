import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Clock, AlertCircle, Database, TrendingUp, BrainCircuit } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  type: 'harvester' | 'analyst' | 'forecaster';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  summary?: string;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  // Icon Selection
  const Icon = {
    harvester: Database,
    analyst: TrendingUp,
    forecaster: BrainCircuit
  }[agent.type];

  return (
    <div className={clsx(
      "p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
      agent.status === 'processing' 
        ? "bg-white dark:bg-dark-elevated border-primary-200 dark:border-primary-900 shadow-md ring-1 ring-primary-100 dark:ring-primary-900/50" 
        : "bg-white dark:bg-dark-elevated border-light-border dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800"
    )}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={clsx(
            "p-2 rounded-lg mr-3 transition-colors",
            agent.status === 'processing' ? "bg-primary-50 text-primary-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
          )}>
            <Icon size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{agent.name}</h4>
            <span className="text-xs text-slate-500 capitalize">{agent.status}...</span>
          </div>
        </div>
        
        {/* Status Icon */}
        <div>
          {agent.status === 'completed' && <CheckCircle2 size={18} className="text-accent-teal" />}
          {agent.status === 'processing' && <Clock size={18} className="text-accent-amber animate-pulse" />}
          {agent.status === 'failed' && <AlertCircle size={18} className="text-accent-coral" />}
        </div>
      </div>

      {/* Progress Bar (Only for processing) */}
      {agent.status === 'processing' && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Analyzing data patterns...</span>
            <span>{agent.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-amber rounded-full relative"
              style={{ width: `${agent.progress}%` }}
            >
               <div className="absolute inset-0 bg-white/40 animate-[shimmer_1s_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Summary (For completed) */}
      {agent.status === 'completed' && agent.summary && (
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
          {agent.summary}
        </div>
      )}

      {/* Active Glow Effect */}
      {agent.status === 'processing' && (
        <div className="absolute inset-0 border-2 border-primary-500/10 rounded-xl pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default AgentCard;