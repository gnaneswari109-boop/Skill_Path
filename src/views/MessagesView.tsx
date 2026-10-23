import React, { useState } from 'react';
import {
  Send,
  ShieldAlert,
  UserX,
  MessageSquare,
  Lock,
  Flag,
  CheckCircle2,
  Users
} from 'lucide-react';
import { store } from '../services/store';
import { DirectMessage, ConnectionRequest } from '../types';

export const MessagesView: React.FC = () => {
  const user = store.currentUser;

  // Accepted connections
  const connections = store.connectionRequests.filter(
    (c) =>
      (c.senderId === user.id || c.recipientId === user.id) &&
      c.status === 'accepted'
  );

  const [activeConnectionId, setActiveConnectionId] = useState<string>(
    connections.length > 0 ? connections[0].id : ''
  );
  const [inputText, setInputText] = useState('');
  const [reportedModalOpen, setReportedModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const activeConn = connections.find((c) => c.id === activeConnectionId) || connections[0];
  const partnerName = activeConn
    ? activeConn.senderId === user.id
      ? activeConn.recipientName
      : activeConn.senderName
    : '';
  const partnerId = activeConn
    ? activeConn.senderId === user.id
      ? activeConn.recipientId
      : activeConn.senderId
    : '';

  const activeMessages = store.directMessages.filter(
    (m) => activeConn && m.connectionId === activeConn.id
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConn) return;

    store.sendDirectMessage(activeConn.id, partnerId, inputText.trim());
    setInputText('');
  };

  const handleReportUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConn || !reportReason.trim()) return;

    store.reportContent(
      partnerId,
      'user',
      `Direct message partner ${partnerName}`,
      reportReason
    );
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportedModalOpen(false);
      setReportReason('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Direct Channels
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              1-on-1 Mentorship & Peer Conversations
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-end authorization enforced</span>
          </div>
        </div>

        {/* Messaging Interface Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[580px] overflow-hidden">
          {/* Left: Active Connection Channels (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/40">
            <div className="p-3.5 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Accepted Connections ({connections.length})
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {connections.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Users className="w-6 h-6 text-slate-400 mx-auto" />
                  <p>No active connections yet. Send a request to an expert mentor or study peer to unlock 1-on-1 messaging.</p>
                </div>
              ) : (
                connections.map((conn) => {
                  const otherName =
                    conn.senderId === user.id ? conn.recipientName : conn.senderName;
                  const isSelected = activeConn && activeConn.id === conn.id;
                  return (
                    <button
                      key={conn.id}
                      onClick={() => setActiveConnectionId(conn.id)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isSelected ? 'bg-white shadow-2xs font-semibold' : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                        {otherName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-slate-900 truncate flex items-center justify-between">
                          <span className="font-semibold">{otherName}</span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {conn.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{conn.note}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Message Thread (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            {activeConn ? (
              <>
                {/* Chat Top Bar */}
                <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{partnerName}</h3>
                    <p className="text-[11px] text-slate-500 capitalize">
                      Connection Status: Accepted · {activeConn.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReportedModalOpen(true)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-600 px-2 py-1 rounded hover:bg-slate-50"
                      title="Report inappropriate behavior"
                    >
                      <Flag className="w-3 h-3" />
                      <span>Report / Safety</span>
                    </button>
                  </div>
                </div>

                {/* Message Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                  {activeMessages.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No messages exchanged yet. Say hello and share your current roadmap milestone!
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMe = msg.senderId === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-3.5 rounded-xl leading-relaxed ${
                              isMe
                                ? 'bg-slate-900 text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <div
                              className={`text-[10px] mt-1 text-right ${
                                isMe ? 'text-slate-400' : 'text-slate-400'
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${partnerName}...`}
                    className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="p-16 text-center text-slate-400 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Select a conversation on the left to begin messaging.</p>
              </div>
            )}
          </div>
        </div>

        {/* Safety & Report Modal */}
        {reportedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Safety & Inappropriate Content Report</span>
              </div>

              {reportSubmitted ? (
                <div className="p-4 text-center text-xs text-emerald-800 bg-emerald-50 rounded-lg">
                  Report submitted to platform governance. Our team reviews all flagged conversations within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleReportUser} className="space-y-3 text-xs">
                  <p className="text-slate-600">
                    Flag inappropriate or commercial behavior for moderator investigation:
                  </p>
                  <textarea
                    rows={3}
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe what occurred..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReportedModalOpen(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
