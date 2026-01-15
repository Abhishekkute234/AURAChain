import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CheckCircle2, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '../../services/api'; 
import { useUIStore } from '../../store/uiStore';

interface ArtifactRendererProps {
  agentType: string;
  data: any; // The raw JSON payload from the backend
}

const ArtifactRenderer: React.FC<ArtifactRendererProps> = ({ agentType, data }) => {
  const { sessionId } = useUIStore();

  // --- 0. ERROR HANDLING & ZERO STATE ---
  // If data is null/undefined OR explicit error from backend
  if (!data || (data.error && typeof data.error === 'string')) {
      return (
          <div className="p-6 flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-red-200 dark:border-red-900 rounded-xl bg-red-50 dark:bg-red-900/10">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-3 text-red-600 dark:text-red-400">
                  <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">Execution Failed</h3>
              <p className="text-sm text-red-600 dark:text-red-300 max-w-xs">
                  {data?.error || "The agent could not complete the task. Please check backend logs."}
              </p>
          </div>
      );
  }

  // --- 1. DATA HARVESTER (Stats Grid) ---
  if (agentType === 'DataHarvester' || agentType === 'data_harvester') {
    const profile = data?.profile || {};
    const qualityScore = profile.improvement_score || 0;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Metric */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <div>
            <h4 className="text-sm text-slate-500">Data Quality Score</h4>
            <div className="text-3xl font-bold text-accent-teal mt-1">{qualityScore}%</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Rows Processed</div>
            <div className="text-xl font-semibold">{profile.cleaned?.shape?.rows || 0}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Missing Values Fixed</div>
            <div className="text-xl font-semibold text-accent-amber">
                {/* Safe summation logic */}
                {Object.values(profile.original?.missing_values || {}).reduce((a: any, b: any) => a + b, 0) as number}
            </div>
          </div>
        </div>

        {/* Cleaning Log */}
        {profile.cleaning_operations && profile.cleaning_operations.length > 0 && (
            <div>
                <h4 className="text-sm font-bold mb-3 text-slate-700 dark:text-slate-200">Cleaning Operations</h4>
                <ul className="space-y-2">
                    {profile.cleaning_operations.map((op: string, idx: number) => (
                        <li key={idx} className="text-xs flex items-start text-slate-600 dark:text-slate-400">
                            <span className="mr-2 mt-0.5 text-accent-teal">•</span>
                            {op}
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    );
  }

  // --- 2. VISUALIZER (Charts) ---
  if (agentType === 'Visualizer' || agentType === 'visualizer') {
    // Fallback Mock Data if backend data structure is missing or complex to parse
    const chartData = data?.chart_data || [
      { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, 
      { name: 'Mar', value: 600 }, { name: 'Apr', value: 800 }
    ];

    const title = data?.chart_spec?.title || "Data Visualization";

    return (
      <div className="h-[400px] w-full mt-4 flex flex-col">
        <h3 className="text-sm font-bold mb-4 text-center text-slate-700 dark:text-slate-300">
            {title}
        </h3>
        <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#4A90E2" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // --- 3. MCTS OPTIMIZER (Simulation Results) ---
  if (agentType === 'MCTSOptimizer' || agentType === 'mcts_optimizer') {
    return (
      <div className="space-y-6">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-5 rounded-xl border border-primary-100 dark:border-primary-800">
            <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-primary-600" size={20} />
                <span className="font-bold text-primary-700 dark:text-primary-300">Optimization Result</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Simulated <strong>{data?.simulation_stats?.iterations || 0}</strong> scenarios.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-[#212121] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Baseline Cost</div>
                <div className="text-lg font-mono text-slate-400 line-through">
                    ₹{data?.simulation_stats?.baseline_cost?.toLocaleString() || 0}
                </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#212121] border border-green-200 dark:border-green-900 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg">
                    SAVINGS
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Optimized Cost</div>
                <div className="text-xl font-mono font-bold text-green-600 dark:text-green-400">
                    ₹{data?.simulation_stats?.optimized_cost?.toLocaleString() || 0}
                </div>
            </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold mb-2">Recommendation</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                {data?.interpretation || "No interpretation provided."}
            </p>
        </div>
      </div>
    );
  }

  // --- 4. ORDER MANAGER (Human-in-the-Loop) ---
  if (agentType === 'OrderManager' || agentType === 'order_manager') {
    const handleApprove = async () => {
        if (!sessionId) {
            alert("No active session found.");
            return;
        }
        try {
            await api.approveOrder("order_123", sessionId);
            alert("Order Approved & Sent to Vendor!");
        } catch(e) {
            alert("Failed to approve order");
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-l-4 border-accent-amber bg-orange-50 dark:bg-orange-900/10 p-4 rounded-r-xl">
                <h3 className="flex items-center text-accent-amber font-bold text-lg mb-1">
                    <AlertTriangle size={20} className="mr-2" />
                    Approval Required
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    The agent has prepared a purchase order based on the optimization. Please review before sending.
                </p>
            </div>

            <div className="bg-white dark:bg-dark-elevated border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="text-sm text-slate-500">PO #IND-2025-001</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-bold">DRAFT</span>
                </div>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Reorder Quantity:</span>
                        <span className="font-mono font-bold">{data?.optimal_action?.order_quantity || 0} Units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Vendor:</span>
                        <span className="font-medium">Rajesh Electronics</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-dashed border-slate-200">
                        <span>Est. Cost:</span>
                        <span className="font-bold text-slate-800 dark:text-white flex items-center">
                            <DollarSign size={14} /> 
                            {data?.simulation_stats?.optimized_cost?.toLocaleString() || 0}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    onClick={handleApprove}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30"
                >
                    Approve Order
                </button>
                <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 rounded-xl font-medium transition-all">
                    Edit
                </button>
            </div>
        </div>
    );
  }

  // --- DEFAULT FALLBACK (Raw JSON) ---
  return (
    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-auto max-h-[500px]">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ArtifactRenderer;