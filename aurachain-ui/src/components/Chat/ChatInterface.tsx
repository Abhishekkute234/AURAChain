import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import MessageBubble, { type Message } from './MessageBubble';
import InputPanel from './InputPanel';
import { useUIStore } from '../../store/uiStore';

const ChatInterface: React.FC = () => {
  const {
    messages,
    isThinking,
    processingStep,
    setRightPanelOpen,
    isSidebarOpen
  } = useUIStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const analysisMessages = messages.filter(msg => msg.type === 'analysis');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, processingStep]);

  const getAnalysisTitle = (msg: Message, idx: number): string => {
    if (msg.text) return msg.text;
    if (msg.metadata?.title) return msg.metadata.title;

    const content = msg.metadata?.summary?.toLowerCase() || msg.text?.toLowerCase() || '';
    if (content.includes('forecast')) return 'Demand Forecast Analysis';
    if (content.includes('inventory')) return 'Inventory Analysis';
    if (content.includes('supplier')) return 'Supplier Analysis';
    if (content.includes('shipment')) return 'Shipment Analysis';
    if (content.includes('sales')) return 'Sales Analysis';
    if (content.includes('cost')) return 'Cost Analysis';
    if (content.includes('trend')) return 'Trend Analysis';
    if (msg.metadata?.agents) return 'Orchestration Plan';

    return `Analysis ${idx + 1}`;
  };

  const handleNodeClick = (msgId: string) => {
    const element = messageRefs.current.get(msgId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      element.style.transition = 'box-shadow 0.3s ease';
      element.style.boxShadow = '0 0 0 2px var(--primary-500, #3b82f6)';

      setTimeout(() => {
        element.style.boxShadow = '';
      }, 2000);
    }
    setRightPanelOpen(true);
  };

  const leftOffset = isSidebarOpen ? 280 : 72;


  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full relative bg-light-bg dark:bg-dark-bg transition-colors duration-500">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="mb-8 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-heading font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center justify-center gap-4">
              <InfinityIcon size={48} className="text-primary-500" strokeWidth={2.5} />
              Good Afternoon
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Ready to orchestrate your supply chain agents?
            </p>
          </div>
          <div className="w-full max-w-2xl animate-fade-in-up delay-100">
            <InputPanel isZeroState={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative bg-light-bg dark:bg-dark-bg">

      {analysisMessages.length > 0 && (
        <div
          className="fixed top-24 z-40 flex flex-col items-center pointer-events-none transition-all duration-300"
          style={{
            left: `${leftOffset + 32}px`,
            height: '70vh',
            maxHeight: '700px'
          }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-primary-200 dark:bg-primary-800" />

          <div className={clsx(
            "relative flex flex-col h-full py-2 pointer-events-auto",
            analysisMessages.length > 1 ? "justify-between" : "justify-start"
          )}>
            {analysisMessages.map((msg, idx) => (
              <button
                key={msg.id}
                onClick={() => handleNodeClick(msg.id)}
                className="relative group/node focus:outline-none"
                aria-label={`Jump to analysis at ${msg.timestamp || 'unknown time'}`}
                type="button"
              >
                <div className={clsx(
                  "w-3 h-3 rounded-full transition-all duration-200 relative z-10",
                  "ring-4 ring-light-bg dark:ring-dark-bg",
                  "hover:scale-150 hover:ring-2 cursor-pointer",
                  msg.status === 'processing'
                    ? "bg-primary-500 animate-pulse"
                    : msg.status === 'failed'
                      ? "bg-red-500"
                      : "bg-primary-500"
                )}>
                  {msg.status === 'processing' && (
                    <div className="absolute inset-0 bg-primary-500/40 rounded-full animate-ping" />
                  )}
                </div>

                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-50 min-w-max">
                  <div className="font-semibold">
                    {getAnalysisTitle(msg, idx)}
                  </div>
                  {msg.timestamp && (
                    <div className="text-slate-300 text-[10px] mt-0.5">
                      {msg.timestamp}
                    </div>
                  )}
                  <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-900" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
        <div className="max-w-3xl mx-auto relative">

          {messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={(el) => {
                if (el) {
                  messageRefs.current.set(msg.id, el);
                } else {
                  messageRefs.current.delete(msg.id);
                }
              }}
              className="relative fade-in mb-6 transition-all duration-300 rounded-lg"
            >
              <MessageBubble
                message={msg}
                isLast={index === messages.length - 1}
              />
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 mb-6 animate-pulse ml-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-400 to-accent-teal flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Sparkles size={16} className="text-white animate-spin-slow" />
              </div>
              <div className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-teal">
                {processingStep || "Orchestrator is thinking..."}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <InputPanel isZeroState={false} />
    </div>
  );
};

export default ChatInterface;