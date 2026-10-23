import React, { useState } from 'react';
import { X, Brain, Trash2, Shield, Download, Check, AlertTriangle } from 'lucide-react';
import { store } from '../services/store';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose }) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  if (!isOpen) return null;

  const memories = store.userMemories.filter((m) => m.userId === store.currentUser.id);

  const handleDelete = (id: string) => {
    store.deleteUserMemory(id);
  };

  const handleClearAll = () => {
    store.resetUserMemories();
    setConfirmClear(false);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `skillpath_export_${store.currentUser.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-[#292D32] w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-[#1B1F23] text-white flex items-center justify-center shadow-xs border border-zinc-800 dark:border-[#292D32]">
              <Brain className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-950 dark:text-white font-display text-sm">
                AI Personalization & Memory Inspector
              </h3>
              <p className="text-xs text-zinc-500 dark:text-[#858D98]">
                Transparently view and control what Skill Path remembers about you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#101214] border border-zinc-200 dark:border-[#292D32] text-xs text-zinc-600 dark:text-[#B8BEC7] flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white">Application-Level Memory Rule: </span>
              Skill Path Guide only remembers confirmed preferences, reflections, and rejection feedback that you have explicitly logged. Your data is isolated and never used to answer other users.
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Stored Personalization Records ({memories.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-[#1B1F23] hover:bg-zinc-200 dark:hover:bg-[#292D32] rounded-xl transition-colors cursor-pointer"
              >
                {copiedExport ? <Check className="w-3.5 h-3.5 text-[#FF6B00]" /> : <Download className="w-3.5 h-3.5" />}
                {copiedExport ? 'Downloaded JSON' : 'Export My Data'}
              </button>
              {memories.length > 0 && (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Memory
                </button>
              )}
            </div>
          </div>

          {confirmClear && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Permanently delete all saved personalization records?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1 bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-[#1B1F23] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {memories.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 dark:text-[#858D98] text-xs">
              No personalization memories stored yet. Complete a discovery question, challenge, or recommendation feedback to record insights.
            </div>
          ) : (
            <div className="space-y-2.5">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-[#292D32] hover:border-[#FF6B00]/40 transition-colors flex items-start justify-between gap-4 bg-white dark:bg-[#101214] shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-zinc-950 dark:text-white">{mem.label}</span>
                      <span className="text-zinc-300 dark:text-zinc-600">·</span>
                      <span className="text-[#FF6B00] font-medium capitalize">{mem.category}</span>
                      <span className="text-zinc-300 dark:text-zinc-600">·</span>
                      <span className="text-zinc-400 dark:text-[#858D98] text-[11px]">Source: {mem.source}</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">{mem.detail}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(mem.id)}
                    title="Delete this memory"
                    className="text-zinc-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-[#1B1F23] transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
