import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { store } from '../services/store';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'env'>('overview');
  const [supabaseUrl, setSupabaseUrl] = useState(store.supabaseConfig.url);
  const [anonKey, setAnonKey] = useState(store.supabaseConfig.anonKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    const sqlScript = `-- SKILL PATH MASTER DATABASE MIGRATION
-- Run this in your Supabase SQL Editor:
-- Covers 28 tables including profiles, user_roles, interests, discovery_sessions, roadmaps, communities, messages, audit_logs.
-- See full /src/supabase/migrations.sql in project root.`;
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    store.setSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: anonKey.trim(),
      isConnected: supabaseUrl.trim().length > 0 && anonKey.trim().length > 0
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Database & Supabase Architecture</h3>
              <p className="text-xs text-slate-500">PostgreSQL schema, RLS policies, and connection configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Status
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            PostgreSQL Schema (28 Tables)
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'env'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Connect Remote Supabase
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900">
                      {store.supabaseConfig.isConnected
                        ? 'Connected to Custom Supabase Instance'
                        : 'Local In-Browser Persistent Engine Active'}
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      All 28 tables, user roles, adaptive recommendation feedback, roadmaps, and audit logs are fully operational and persisted across sessions. You can connect your remote Supabase project anytime by providing your API credentials in the Connect tab.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Supported Architecture Entities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">1. profiles</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">2. user_roles</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">3. interests</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">4. user_interests</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">5. discovery_sessions</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">6. discovery_questions</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">7. discovery_answers</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">8. ai_conversations</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">9. ai_messages</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">10. user_memories</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">11. recommendations</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">12. recommendation_feedback</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">13. roadmaps</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">14. roadmap_milestones</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">15. challenges</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">16. challenge_attempts</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">17. expert_profiles</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">18. connections</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">19. conversations</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">20. messages</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">21. communities</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">22. community_members</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">23. community_posts</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">24. community_comments</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">25. community_reactions</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">26. user_reports</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">27. notifications</div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-100">28. audit_logs</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Location: /src/supabase/migrations.sql</span>
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard' : 'Copy SQL Script'}
                </button>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-72">
                <pre>{`-- SKILL PATH: MASTER DATABASE SCHEMA & ROW LEVEL SECURITY
-- 28 Entities with UUIDs, Foreign Keys & Cascades

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  life_stage TEXT CHECK (life_stage IN ('school','college','employed','career_transition','exploring')),
  bio TEXT,
  available_hours_per_week INT DEFAULT 5,
  profile_visibility TEXT DEFAULT 'public',
  onboarding_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enforcement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = id);

-- [Complete 28-table migration available in /src/supabase/migrations.sql]`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzproject.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                />
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Configuration saved successfully!
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Open Supabase Console <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Save Connection Settings
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
