import React, { useState, useEffect, useRef } from 'react';
import { Bot, Compass, Send, X, Sparkles, Brain, ArrowRight, User } from 'lucide-react';
import { aiGuide, AIMessage } from '../services/aiGuide';
import { store } from '../services/store';

interface AIGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMemoryModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AIGuideDrawer: React.FC<AIGuideDrawerProps> = ({
  isOpen,
  onClose,
  onOpenMemoryModal,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = `Hello ${store.currentUser.name}. I'm your Skill Path Guide.\n\nI hold your continuous learning context, life rhythm constraints, and rejection feedback in mind. What would you like to explore or clarify today?`;
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: greeting,
          timestamp: new Date().toISOString(),
          suggestedActions: [
            { label: 'Suggest a low-stakes 30-min challenge', actionType: 'navigate', payload: 'challenges' },
            { label: 'Why was Sports Analytics recommended?', actionType: 'prompt', payload: 'Why did you recommend Sports Analytics to me?' },
            { label: 'Review my 4-week roadmap', actionType: 'navigate', payload: 'roadmaps' }
          ]
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    if (!userText) {
      setInput('');
    }

    const userMsg: AIMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const resp = await aiGuide.getGuideResponse(
        textToSend,
        newHistory.map((m) => ({ sender: m.sender, text: m.text }))
      );

      const assistantMsg: AIMessage = {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: resp.text,
        timestamp: new Date().toISOString(),
        suggestedActions: resp.actions
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: string }) => {
    if (action.actionType === 'prompt' && action.payload) {
      handleSend(action.payload);
    } else if (action.actionType === 'guide_prompt' && action.payload) {
      handleSend(action.payload);
    } else if (action.actionType === 'navigate' && action.payload) {
      onNavigateTab(action.payload);
      onClose();
    } else if (action.actionType === 'open_memory_modal') {
      onOpenMemoryModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#15181B] h-full shadow-2xl flex flex-col border-l border-zinc-200 dark:border-[#292D32] animate-in slide-in-from-right duration-250 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-[#1B1F23] text-white flex items-center justify-center shadow-xs border border-zinc-800 dark:border-[#292D32]">
              <Compass className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <div className="font-semibold text-xs text-zinc-950 dark:text-white flex items-center gap-1.5 font-display">
                Skill Path Guide
                <span className="text-[10px] text-[#FF6B00] font-medium px-1.5 py-0.2 rounded-full bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                  Memory Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-[#858D98]">Continuous context & empathetic discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenMemoryModal}
              title="Inspect AI Memory & Personalization Records"
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-[#858D98] dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
            >
              <Brain className="w-4 h-4 text-[#FF6B00]" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-zinc-50/30 dark:bg-[#0B0B0C]/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Compass className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#FF6B00] text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-[#1B1F23] border border-zinc-200/90 dark:border-[#292D32] text-zinc-800 dark:text-[#B8BEC7] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="px-3 py-1.5 bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] text-zinc-700 dark:text-[#B8BEC7] hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:text-[#FF8126] text-[11px] font-medium rounded-xl shadow-2xs transition-all text-left cursor-pointer hover:shadow-xs"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-[#1B1F23] text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-6 h-6 rounded-full bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 bg-white dark:bg-[#1B1F23] border border-zinc-200/90 dark:border-[#292D32] rounded-2xl rounded-bl-xs text-zinc-500 dark:text-[#858D98] text-xs shadow-2xs">
                Reflecting on your answers and memories...
              </div>
            </div>
          )}

            <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3.5 border-t border-zinc-200 dark:border-[#292D32] bg-white dark:bg-[#15181B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Guide about your path..."
              className="flex-1 text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-[#858D98]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#FF6B00] text-white rounded-xl hover:bg-[#FF8126] disabled:opacity-40 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-zinc-400 dark:text-[#858D98] mt-2 flex items-center justify-between">
            <span>Powered by continuous memory architecture</span>
            <button
              onClick={onOpenMemoryModal}
              className="text-[#FF6B00] hover:text-[#FF8126] font-semibold cursor-pointer"
            >
              Manage Stored Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
