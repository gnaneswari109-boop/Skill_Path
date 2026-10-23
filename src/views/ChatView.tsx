import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  UserCheck,
  Shield,
  Search,
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
  ChevronRight,
  Brain,
  Info,
  AlertTriangle,
  User,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { store } from '../services/store';
import { aiGuide, AIMessage } from '../services/aiGuide';
import { UserRole } from '../types';

interface ChatViewProps {
  onOpenMemoryModal: () => void;
  onNavigateTab: (tab: string) => void;
  initialConversationId?: string;
}

type ConversationType = 'ai' | 'expert' | 'support';

interface ConversationItem {
  id: string;
  type: ConversationType;
  title: string;
  subtitle: string;
  avatar: string;
  roleBadge: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  online: boolean;
  participantId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  onOpenMemoryModal,
  onNavigateTab,
  initialConversationId
}) => {
  const currentUser = store.currentUser;

  // Active tab filter: 'all' | 'ai' | 'expert' | 'support'
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'expert' | 'support'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState<string>(initialConversationId || 'conv_ai');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'chat' | 'info'>('list');

  // Chat message thread state for AI Guide
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'm_init',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I'm your private **Skill Path Guide**.\n\nMy role is to help you explore genuine interests, test activities through 30-minute experiments, and reflect on what energizes you—without any premature career pressure. What would feel helpful to explore today?`,
      timestamp: '10:00 AM',
      suggestedActions: [
        { label: 'Suggest a weekend experiment', actionType: 'prompt', payload: 'Suggest a small 45-minute activity I can try this weekend' },
        { label: 'What can I do with cricket?', actionType: 'prompt', payload: 'I enjoy cricket but don’t know what else I can do with it' },
        { label: 'Why did I reject my last idea?', actionType: 'prompt', payload: 'I rejected my last recommendations. Help me understand why.' }
      ]
    }
  ]);

  // Thread state for Expert (Dr. Aris Thorne)
  const [expertMessages, setExpertMessages] = useState<{
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    time: string;
    isMe: boolean;
  }[]>([
    {
      id: 'exp_1',
      senderId: 'usr_expert_aris',
      senderName: 'Dr. Aris Thorne',
      text: `Hi ${currentUser.name}! I reviewed your cricket tactical breakdown notes from Week 1. Your analysis of dot-ball frequency in the death overs showed impressive pattern recognition.`,
      time: 'Yesterday, 4:15 PM',
      isMe: false
    },
    {
      id: 'exp_2',
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: `Thanks Dr. Thorne! I was wondering whether sports analysts typically build their own data scrapers or use ready-made feeds?`,
      time: 'Yesterday, 4:20 PM',
      isMe: true
    },
    {
      id: 'exp_3',
      senderId: 'usr_expert_aris',
      senderName: 'Dr. Aris Thorne',
      text: `Most start with open public ball-by-ball datasets (like Cricsheet or StatsBomb). What matters first is asking the right questions, not the tooling. Have you checked out Challenge #1?`,
      time: 'Yesterday, 4:28 PM',
      isMe: false
    }
  ]);

  // Thread state for Admin Support
  const [supportMessages, setSupportMessages] = useState<{
    id: string;
    senderName: string;
    text: string;
    time: string;
    isMe: boolean;
  }[]>([
    {
      id: 'sup_1',
      senderName: 'Platform Support (Elena)',
      text: `Welcome to Skill Path Support. How can our team assist you with your discovery roadmap, account privacy, or mentor connections today?`,
      time: '2 days ago',
      isMe: false
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Define available conversations based on Role-Based Access Rules
  const conversations: ConversationItem[] = [
    {
      id: 'conv_ai',
      type: 'ai',
      title: 'Skill Path Guide',
      subtitle: 'Continuous memory active',
      avatar: '',
      roleBadge: 'Private AI Assistant',
      unreadCount: 0,
      lastMessage: aiMessages[aiMessages.length - 1]?.text.slice(0, 52) + '...',
      lastMessageTime: 'Just now',
      online: true
    },
    {
      id: 'conv_expert_aris',
      type: 'expert',
      title: 'Dr. Aris Thorne',
      subtitle: 'Sports Analytics Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      roleBadge: 'Verified Expert',
      unreadCount: 1,
      lastMessage: expertMessages[expertMessages.length - 1]?.text.slice(0, 52) + '...',
      lastMessageTime: '4:28 PM',
      online: true,
      participantId: 'usr_expert_aris'
    },
    {
      id: 'conv_support',
      type: 'support',
      title: 'Admin Support',
      subtitle: 'Elena Rostova · Governance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      roleBadge: 'Platform Admin',
      unreadCount: 0,
      lastMessage: supportMessages[supportMessages.length - 1]?.text.slice(0, 52) + '...',
      lastMessageTime: '2d ago',
      online: true
    }
  ];

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesFilter = filterType === 'all' || conv.type === filterType;
    const matchesSearch =
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeConversation = conversations.find((c) => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, expertMessages, supportMessages, isAiThinking]);

  // Handle Send Message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    setInputMessage('');

    if (activeConversation.type === 'ai') {
      const userMsg: AIMessage = {
        id: 'u_' + Date.now(),
        sender: 'user',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiMessages((prev) => [...prev, userMsg]);
      setIsAiThinking(true);

      try {
        const history = aiMessages.map((m) => ({ sender: m.sender, text: m.text }));
        const response = await aiGuide.getGuideResponse(textToSend, history);

        const botMsg: AIMessage = {
          id: 'a_' + Date.now(),
          sender: 'assistant',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: response.actions
        };
        setAiMessages((prev) => [...prev, botMsg]);
      } catch {
        setAiMessages((prev) => [
          ...prev,
          {
            id: 'err_' + Date.now(),
            sender: 'assistant',
            text: 'I ran into an issue reflecting on that query. Let’s explore smaller starter questions.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setIsAiThinking(false);
      }
    } else if (activeConversation.type === 'expert') {
      const newMsg = {
        id: 'exp_msg_' + Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: textToSend,
        time: 'Just now',
        isMe: true
      };
      setExpertMessages((prev) => [...prev, newMsg]);

      // If current user is member, simulate helpful practitioner response
      if (currentUser.role === 'member') {
        setTimeout(() => {
          setExpertMessages((prev) => [
            ...prev,
            {
              id: 'exp_rep_' + Date.now(),
              senderId: 'usr_expert_aris',
              senderName: 'Dr. Aris Thorne',
              text: `Got your note, ${currentUser.name}! That aligns well with the direction we discussed. Take a look at the Tactical Modeling challenge in the Challenges tab—try logging 3 match events and sharing your reflection note.`,
              time: 'Just now',
              isMe: false
            }
          ]);
        }, 1200);
      }
    } else if (activeConversation.type === 'support') {
      const newMsg = {
        id: 'sup_msg_' + Date.now(),
        senderName: currentUser.name,
        text: textToSend,
        time: 'Just now',
        isMe: true
      };
      setSupportMessages((prev) => [...prev, newMsg]);

      setTimeout(() => {
        setSupportMessages((prev) => [
          ...prev,
          {
            id: 'sup_rep_' + Date.now(),
            senderName: 'Elena Rostova (Admin)',
            text: `Thank you for reaching out! We have logged your request under ticket #SP-${Math.floor(1000 + Math.random() * 9000)}. Our moderation & trust team will follow up within 24 hours.`,
            time: 'Just now',
            isMe: false
          }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white dark:bg-[#0B0B0C] text-zinc-900 dark:text-white overflow-hidden">
      {/* 3-Column Chat Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= COLUMN 1: CONVERSATION LIST (LEFT) ================= */}
        <section
          className={`w-full md:w-80 lg:w-88 border-r border-zinc-200 dark:border-[#292D32] bg-[#F8F9FA] dark:bg-[#111315] flex flex-col shrink-0 transition-all ${
            mobileActiveView !== 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Conversation List Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-[#292D32] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold tracking-tight font-display text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF6B00]" />
                <span>Messages</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-[#1B1F23] text-zinc-600 dark:text-[#B8BEC7]">
                {filteredConversations.length} Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#101214] border border-zinc-200 dark:border-[#292D32] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#FF6B00] transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'ai', label: 'AI Guide' },
                { id: 'expert', label: 'Experts' },
                { id: 'support', label: 'Support' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-[#FF6B00] text-white shadow-2xs'
                      : 'bg-white dark:bg-[#15181B] text-zinc-600 dark:text-[#B8BEC7] hover:bg-zinc-100 dark:hover:bg-[#1B1F23] border border-zinc-200/80 dark:border-[#292D32]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-[#1B1F23]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeChatId;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveChatId(conv.id);
                    setMobileActiveView('chat');
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border-l-4 border-[#FF6B00]'
                      : 'hover:bg-white dark:hover:bg-[#15181B]'
                  }`}
                >
                  {/* Avatar / Icon */}
                  <div className="relative shrink-0 mt-0.5">
                    {conv.type === 'ai' ? (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C1F24] to-[#111315] border border-[#292D32] flex items-center justify-center text-[#FF6B00] shadow-2xs">
                        <Bot className="w-5 h-5" />
                      </div>
                    ) : (
                      <img
                        src={conv.avatar}
                        alt={conv.title}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-[#292D32]"
                      />
                    )}
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111315]" />
                    )}
                  </div>

                  {/* Conversation Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900 dark:text-white truncate">
                        {conv.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-[#858D98]">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                        conv.type === 'ai'
                          ? 'bg-[#FF6B00]/15 text-[#FF6B00]'
                          : conv.type === 'expert'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                      }`}>
                        {conv.roleBadge}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-[#858D98] truncate mt-1 leading-snug">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Member-to-Member Policy Guard Notice (Scenario C) */}
            <div className="p-4 m-3 rounded-xl bg-zinc-100/70 dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Member-to-Member Privacy Policy</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-[#858D98] leading-relaxed">
                Direct private messaging between two Members is disabled for psychological safety. To exchange ideas, join our public <strong>Guild Communities</strong> or use your private <strong>AI Assistant</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ================= COLUMN 2: ACTIVE CONVERSATION THREAD (CENTER) ================= */}
        <section
          className={`flex-1 flex flex-col bg-white dark:bg-[#0B0B0C] transition-all overflow-hidden ${
            mobileActiveView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Thread Header */}
          <div className="h-16 px-4 sm:px-6 border-b border-zinc-200 dark:border-[#292D32] flex items-center justify-between bg-white/80 dark:bg-[#111315]/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile Back to List Button */}
              <button
                onClick={() => setMobileActiveView('list')}
                className="p-1.5 -ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white md:hidden cursor-pointer"
              >
                ← Back
              </button>

              <div className="relative">
                {activeConversation.type === 'ai' ? (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C1F24] to-[#111315] border border-[#292D32] flex items-center justify-center text-[#FF6B00]">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.title}
                    className="w-9 h-9 rounded-xl object-cover border border-zinc-200 dark:border-[#292D32]"
                  />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-[#111315]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                    {activeConversation.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    activeConversation.type === 'ai'
                      ? 'bg-[#FF6B00]/15 text-[#FF6B00]'
                      : activeConversation.type === 'expert'
                      ? 'bg-blue-500/15 text-blue-500'
                      : 'bg-purple-500/15 text-purple-400'
                  }`}>
                    {activeConversation.roleBadge}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-[#858D98] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online · {activeConversation.subtitle}</span>
                </div>
              </div>
            </div>

            {/* Toggle Info / Context Panel Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setMobileActiveView(mobileActiveView === 'info' ? 'chat' : 'info');
                  } else {
                    setShowRightPanel(!showRightPanel);
                  }
                }}
                className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showRightPanel
                    ? 'bg-zinc-100 dark:bg-[#1B1F23] text-zinc-900 dark:text-white border-zinc-300 dark:border-[#292D32]'
                    : 'text-zinc-500 dark:text-[#858D98] border-transparent hover:bg-zinc-100 dark:hover:bg-[#15181B]'
                }`}
                title="Toggle Context Panel"
              >
                <Info className="w-4 h-4 text-[#FF6B00]" />
                <span className="hidden sm:inline text-xs">Details</span>
              </button>
            </div>
          </div>

          {/* Messages Thread Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-50/50 dark:bg-[#0B0B0C]">
            {/* Encryption & Safety Banner */}
            <div className="max-w-md mx-auto p-2.5 rounded-xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] text-center text-[11px] text-zinc-500 dark:text-[#858D98] flex items-center justify-center gap-2 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>
                {activeConversation.type === 'ai'
                  ? 'Private AI continuous memory session isolated to your profile.'
                  : 'Authorized 1-on-1 direct channel under Skill Path safety governance.'}
              </span>
            </div>

            {/* AI Messages Thread */}
            {activeConversation.type === 'ai' &&
              aiMessages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-[#292D32] text-[#FF6B00] flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="space-y-2 max-w-[85%] sm:max-w-[75%]">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                          isUser
                            ? 'bg-[#FF6B00] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#15181B] text-zinc-900 dark:text-[#FFFFFF] border border-zinc-200 dark:border-[#292D32] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Suggested Action Chips from Guide */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedActions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (act.actionType === 'prompt' && act.payload) {
                                  handleSendMessage(act.payload);
                                } else if (act.actionType === 'navigate' && act.payload) {
                                  onNavigateTab(act.payload);
                                } else if (act.actionType === 'open_memory_modal') {
                                  onOpenMemoryModal();
                                }
                              }}
                              className="px-3 py-1.5 bg-white dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 border border-zinc-200 dark:border-[#292D32] hover:border-[#FF6B00] text-zinc-700 dark:text-[#B8BEC7] hover:text-[#FF6B00] text-[11px] font-semibold rounded-xl transition-all shadow-2xs text-left cursor-pointer"
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className={`text-[10px] text-zinc-400 dark:text-[#858D98] ${isUser ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Expert Messages Thread */}
            {activeConversation.type === 'expert' &&
              expertMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <img
                      src={activeConversation.avatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-lg object-cover border border-zinc-200 dark:border-[#292D32] mt-1 shrink-0"
                    />
                  )}

                  <div className="space-y-1 max-w-[85%] sm:max-w-[75%]">
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.isMe
                          ? 'bg-[#FF6B00] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#15181B] text-zinc-900 dark:text-[#FFFFFF] border border-zinc-200 dark:border-[#292D32] rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className={`text-[10px] text-zinc-400 dark:text-[#858D98] ${msg.isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

            {/* Support Messages Thread */}
            {activeConversation.type === 'support' &&
              supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-xs mt-1 shrink-0">
                      S
                    </div>
                  )}

                  <div className="space-y-1 max-w-[85%] sm:max-w-[75%]">
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.isMe
                          ? 'bg-[#FF6B00] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#15181B] text-zinc-900 dark:text-[#FFFFFF] border border-zinc-200 dark:border-[#292D32] rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className={`text-[10px] text-zinc-400 dark:text-[#858D98] ${msg.isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

            {/* Thinking / Typing Indicator */}
            {isAiThinking && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-[#292D32] text-[#FF6B00] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] rounded-2xl rounded-bl-xs text-xs text-zinc-500 dark:text-[#858D98] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-bounce [animation-delay:0.4s]" />
                  <span>Guide is reflecting on your answers and memories...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer Bar */}
          <div className="p-4 border-t border-zinc-200 dark:border-[#292D32] bg-white dark:bg-[#111315] shrink-0">
            {/* Quick Starter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 text-[11px]">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
                Quick:
              </span>
              {activeConversation.type === 'ai' ? (
                <>
                  <button
                    onClick={() => handleSendMessage('Suggest a weekend experiment for me')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Weekend experiment
                  </button>
                  <button
                    onClick={() => handleSendMessage('What else can I do with cricket?')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cricket exploration
                  </button>
                  <button
                    onClick={() => handleSendMessage('How do I calibrate my active roadmap?')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Calibrate roadmap
                  </button>
                </>
              ) : activeConversation.type === 'expert' ? (
                <>
                  <button
                    onClick={() => handleSendMessage('Could you review my Week 2 task output?')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Review task output
                  </button>
                  <button
                    onClick={() => handleSendMessage('What is the best way to practice statistical models?')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Practice advice
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSendMessage('I have a question regarding my data export.')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] text-zinc-600 dark:text-[#B8BEC7] whitespace-nowrap cursor-pointer"
                  >
                    Data export question
                  </button>
                  <button
                    onClick={() => handleSendMessage('How do I report an issue in a Guild community?')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#15181B] text-zinc-600 dark:text-[#B8BEC7] whitespace-nowrap cursor-pointer"
                  >
                    Report guild issue
                  </button>
                </>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  activeConversation.type === 'ai'
                    ? 'Ask Skill Path Guide anything about your interests...'
                    : `Message ${activeConversation.title}...`
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 text-xs px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#101214] border border-zinc-200 dark:border-[#292D32] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#FF6B00] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isAiThinking}
                className="px-5 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#FF8126] disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-md shadow-orange-950/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* ================= COLUMN 3: CHAT OPTIONS & CONTEXT PANEL (RIGHT) ================= */}
        {showRightPanel && (
          <aside
            className={`w-full lg:w-80 border-l border-zinc-200 dark:border-[#292D32] bg-[#F8F9FA] dark:bg-[#111315] flex flex-col shrink-0 overflow-y-auto p-5 space-y-5 transition-all ${
              mobileActiveView === 'info' ? 'flex fixed inset-0 z-40 bg-white dark:bg-[#111315]' : 'hidden lg:flex'
            }`}
          >
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-[#292D32] lg:hidden">
              <span className="font-bold text-sm">Conversation Details</span>
              <button
                onClick={() => setMobileActiveView('chat')}
                className="p-1 text-zinc-500 font-semibold text-xs"
              >
                Close
              </button>
            </div>

            {/* Chat Target Profile Snippet */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] text-center space-y-2 shadow-2xs">
              <div className="relative inline-block mx-auto">
                {activeConversation.type === 'ai' ? (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1C1F24] to-[#111315] border border-[#292D32] flex items-center justify-center text-[#FF6B00] mx-auto shadow-md">
                    <Bot className="w-8 h-8" />
                  </div>
                ) : (
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.title}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-200 dark:border-[#292D32] mx-auto"
                  />
                )}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#15181B]" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                  {activeConversation.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-[#858D98]">
                  {activeConversation.subtitle}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF6B00]/15 text-[#FF6B00]">
                  {activeConversation.roleBadge}
                </span>
              </div>
            </div>

            {/* Dynamic Context Card based on active conversation */}
            {activeConversation.type === 'ai' && (
              <>
                {/* AI Memory Architecture Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-[#FF6B00]" />
                      Continuous Memory
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold font-mono">
                      Active
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                    The Guide remembers your stated interests, rejected recommendations, and roadmap reflections to personalize advice without corporate tracking.
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={onOpenMemoryModal}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-[#1B1F23] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-800 dark:text-zinc-200 hover:text-[#FF6B00] border border-zinc-200 dark:border-[#292D32] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inspect Memory Records</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Helpful Exploration Prompts Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-2.5 shadow-2xs">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Discovery Prompts</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {[
                      'I enjoy competition and tactics. What can I explore?',
                      'Suggest a 45-minute zero-pressure experiment',
                      'How do I test if I enjoy sports analytics?',
                      'Help me understand my hesitation about this roadmap'
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="w-full p-2.5 text-left text-[11px] rounded-xl bg-zinc-50 dark:bg-[#101214] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 border border-zinc-200/80 dark:border-[#292D32] text-zinc-700 dark:text-[#B8BEC7] hover:text-[#FF6B00] transition-colors leading-snug cursor-pointer flex items-center justify-between group"
                      >
                        <span className="truncate pr-1">{prompt}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-[#FF6B00] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeConversation.type === 'expert' && (
              <>
                {/* Expert Credentials & Bio */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Practitioner Credentials</span>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-600 dark:text-[#B8BEC7]">
                    <div>
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase">Focus Areas</div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        Tactical modeling, cricket event analysis, performance data
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase">Verified Qualifications</div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        PhD in Sports Informatics, 8+ years match analyst consulting
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase">Response Rhythm</div>
                      <div className="text-zinc-700 dark:text-[#B8BEC7] mt-0.5">
                        Usually responds within 24 hours. Focused on artifact review.
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => onNavigateTab('roadmaps')}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-[#1B1F23] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 text-zinc-800 dark:text-zinc-200 hover:text-[#FF6B00] border border-zinc-200 dark:border-[#292D32] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Share Active Roadmap Artifact</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeConversation.type === 'support' && (
              <>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-500" />
                    <span>Governance & Safety</span>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                    Direct member support is monitored by platform administrators to ensure respectful exchanges, data privacy, and prompt verification resolution.
                  </p>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#101214] border border-zinc-200 dark:border-[#292D32] text-[11px] space-y-1">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">Live Support Hours</div>
                    <div className="text-zinc-500 dark:text-[#858D98]">Monday – Friday: 9am – 6pm EST</div>
                  </div>
                </div>
              </>
            )}

            {/* Quick Link to Explore Mentors */}
            <div className="p-4 rounded-2xl bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 space-y-2">
              <div className="text-xs font-bold text-[#FF6B00]">Need More Perspectives?</div>
              <p className="text-[11px] text-zinc-700 dark:text-[#B8BEC7] leading-relaxed">
                Connect with verified experts in writing, game design, sports science, and software.
              </p>
              <button
                onClick={() => onNavigateTab('mentors')}
                className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Verified Mentors</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
