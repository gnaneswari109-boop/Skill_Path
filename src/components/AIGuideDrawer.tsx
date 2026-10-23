import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Brain, Bot, User, X } from 'lucide-react';
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
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'm_init',
      sender: 'assistant',
      text: `Hello ${store.currentUser.name}. I'm your **Skill Path Guide**.\n\nMy role is to help you explore genuine interests, reflect on small experiments, and take clear next steps—without the pressure of premature career commitments. What would feel most helpful to explore today?`,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        { label: 'Suggest a weekend experiment', actionType: 'prompt', payload: 'Suggest a small 45-minute activity I can try this weekend' },
        { label: 'I enjoy cricket: what can I do with it?', actionType: 'prompt', payload: 'I enjoy cricket but don’t know what else I can do with it' },
        { label: 'Help me understand why I rejected my last idea', actionType: 'prompt', payload: 'I rejected my last recommendations. Help me understand why.' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: AIMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, text: m.text }));
      const response = await aiGuide.getGuideResponse(textToSend, history);

      const assistantMsg: AIMessage = {
        id: 'a_' + Date.now(),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString(),
        suggestedActions: response.actions
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          text: 'I ran into an issue processing that question. Let’s try breaking it into a smaller question.',
          timestamp: new Date().toISOString()
        }
      ]);
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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                Skill Path Guide
                <span className="text-[10px] text-emerald-700 font-medium">· Memory Active</span>
              </div>
              <p className="text-[11px] text-slate-500">Continuous context & empathetic discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenMemoryModal}
              title="Inspect AI Memory & Personalization Records"
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Brain className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-3 rounded-xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
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
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 text-[11px] font-medium rounded-md shadow-2xs transition-colors text-left"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl rounded-bl-none text-slate-500 text-xs">
                Reflecting on your answers and memories...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-200 bg-white">
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
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Powered by continuous memory architecture</span>
            <button
              onClick={onOpenMemoryModal}
              className="text-emerald-700 hover:underline"
            >
              Manage Stored Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
