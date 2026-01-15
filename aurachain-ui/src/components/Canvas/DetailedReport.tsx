import React from 'react';
import { ArrowLeft, Download, Share2, FileText, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

interface DetailedReportProps {
  agentId: string;
}

const DetailedReport: React.FC<DetailedReportProps> = ({ agentId }) => {
  const { setSelectedAgent } = useUIStore();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-elevated animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
        <button 
          onClick={() => setSelectedAgent(null)}
          className="flex items-center text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Workflow
        </button>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <Download size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-800 dark:text-white">Data Harvester Report</h2>
              <span className="text-xs text-slate-500">ID: {agentId} • Completed 2m ago</span>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Records Processed</div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">24,592</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Quality Score</div>
            <div className="text-lg font-bold text-accent-teal flex items-center">
              98.5% <CheckCircle2 size={14} className="ml-2" />
            </div>
          </div>
        </div>

        {/* LLM Reasoning Block */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">🧠 LLM Reasoning</h3>
          <div className="p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "I analyzed the sales data for the Mumbai region. The dataset covers 730 days. There were 15 missing values which I imputed using linear interpolation. A strong seasonal spike is detected in October-November correlating with Diwali."
          </div>
        </div>

        {/* Visual Data Breakdown (CSS Chart) */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📈 Data Source Breakdown</h3>
          <div className="space-y-3">
            {['POS System (65%)', 'Inventory DB (25%)', 'External CSV (10%)'].map((label, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{label.split('(')[0]}</span>
                  <span>{label.split('(')[1].replace(')', '')}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-accent-teal' : 'bg-accent-amber'}`}
                    style={{ width: label.split('(')[1].replace(')', '') }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailedReport;