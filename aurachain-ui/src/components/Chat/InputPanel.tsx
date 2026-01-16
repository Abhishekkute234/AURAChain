import React, { useState, useRef } from 'react';
import { Paperclip, Send, Loader2, X, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { useUIStore } from '../../store/uiStore';

interface InputPanelProps {
  isZeroState?: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ isZeroState = false }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, uploadDataset, isThinking } = useUIStore();

  const handleSubmit = async () => {
    if ((!text.trim() && !file) || isThinking) return;

    if (file) {
      await uploadDataset(file);
      setFile(null);
    }

    if (text.trim()) {
      await sendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out z-20",
        isZeroState ? "p-0" : "w-full max-w-3xl mx-auto px-4 pb-6"
      )}
    >
      <div className="mx-auto relative w-full">

        {file && (
          <div className="absolute -top-12 left-0 right-0 mx-2 p-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg flex items-center justify-between animate-slide-in">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 bg-white dark:bg-primary-800 rounded-md text-primary-600 dark:text-primary-300">
                <FileText size={16} />
              </div>
              <span className="text-xs font-medium text-primary-700 dark:text-primary-200 truncate max-w-[200px]">
                {file.name}
              </span>
              <span className="text-[10px] text-primary-400">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full text-primary-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div
          className={clsx(
            "relative flex items-center bg-white dark:bg-[#212121] border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 transition-all rounded-2xl p-2 shadow-xl",
            isThinking && "opacity-80 pointer-events-none"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".csv,.xlsx,.json"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Attach data file"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isThinking ? "Agent is working..." : "Ask AURAChain..."}
            className={clsx(
              "flex-1 py-3 px-2 bg-transparent border-none focus:ring-0 outline-none resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 custom-scrollbar",
              isZeroState ? "text-lg" : "text-sm"
            )}
            rows={1}
            style={{ minHeight: isZeroState ? '56px' : '44px', maxHeight: '200px' }}
          />

          <div className="flex items-center p-2">
            <button
              onClick={handleSubmit}
              disabled={(!text.trim() && !file) || isThinking}
              className={clsx(
                "p-2 rounded-lg shadow-sm transition-all",
                (text.trim() || file) && !isThinking
                  ? "bg-primary-600 hover:bg-primary-700 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
              )}
            >
              {isThinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
