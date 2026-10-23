import React, { useState } from 'react';
import { Brain, Trash2, Download, AlertTriangle, Shield, Check, X } from 'lucide-react';
import { store } from '../services/store';
import { UserMemory } from '../types';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose }) => {
  const [memories, setMemories] = useState<UserMemory[]>(
    store.userMemories.filter((m) => m.userId === store.currentUser.id)
  );
  const [copiedExport, setCopiedExport] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    store.deleteUserMemory(id);
    setMemories(store.userMemories.filter((m) => m.userId === store.currentUser.id));
  };

  const handleClearAll = () => {
    store.resetUserMemories();
    setMemories([]);
    setConfirmClear(false);
  };

  const handleExport = () => {
    const jsonStr = store.exportUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillpath_export_${store.currentUser.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI Personalization & Memory Inspector</h3>
              <p className="text-xs text-slate-500">Transparently view and control what Skill Path remembers about you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Application-Level Memory Rule: </span>
              Skill Path Guide only remembers confirmed preferences, reflections, and rejection feedback that you have explicitly logged. Your data is isolated and never used to answer other users.
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Stored Personalization Records ({memories.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                {copiedExport ? 'Downloaded JSON' : 'Export My Data'}
              </button>
              {memories.length > 0 && (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Memory
                </button>
              )}
            </div>
          </div>

          {confirmClear && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Permanently delete all saved personalization records?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-2.5 py-1 bg-red-600 text-white font-medium rounded hover:bg-red-700"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-medium rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {memories.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No personalization memories stored yet. Complete a discovery question, challenge, or recommendation feedback to record insights.
            </div>
          ) : (
            <div className="space-y-2.5">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-900">{mem.label}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 capitalize">{mem.category}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-400 text-[11px]">Source: {mem.source}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{mem.detail}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(mem.id)}
                    title="Delete this memory"
                    className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
