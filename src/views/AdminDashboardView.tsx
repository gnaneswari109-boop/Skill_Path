import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  Search,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { store } from '../services/store';
import { UserReport } from '../types';

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'reports' | 'users' | 'audit'>('verification');
  const experts = store.experts;
  const reports = store.reports;
  const auditLogs = store.auditLogs;
  const users = store.users;

  const pendingExperts = experts.filter((e) => !e.verified);

  const handleVerifyExpert = (expertUserId: string) => {
    store.verifyExpert(expertUserId, true);
  };

  const handleRejectExpert = (expertUserId: string) => {
    store.verifyExpert(expertUserId, false);
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'resolved' | 'remove') => {
    store.resolveReport(reportId, action);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-[#292D32]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Platform Governance & Trust</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-display">
              Administrator Governance Console
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] max-w-2xl leading-relaxed">
              Verify mentor credentials, investigate reported content, and monitor audit trails.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-[#B8BEC7] bg-white dark:bg-[#15181B] px-3.5 py-2 rounded-xl border border-zinc-200/80 dark:border-[#292D32] shadow-2xs">
              Actor: {store.currentUser.name} (Admin)
            </span>
          </div>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex border-b border-zinc-200/80 dark:border-[#292D32] gap-6 sm:gap-8 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'verification'
                ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                : 'border-transparent text-zinc-500 dark:text-[#858D98] hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Expert Verification Queue ({pendingExperts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                : 'border-transparent text-zinc-500 dark:text-[#858D98] hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Content Moderation ({reports.filter((r: UserReport) => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                : 'border-transparent text-zinc-500 dark:text-[#858D98] hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            <span>User Directory ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                : 'border-transparent text-zinc-500 dark:text-[#858D98] hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: Expert Verification */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            {pendingExperts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#FF6B00] mx-auto" />
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">All Expert Applications Reviewed</h4>
                <p className="text-xs text-zinc-500 dark:text-[#858D98] max-w-sm mx-auto">
                  There are no pending practitioner credentials awaiting administrative verification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExperts.map((exp) => (
                  <div
                    key={exp.userId}
                    className="p-6 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={exp.avatar}
                        alt={exp.name}
                        className="w-14 h-14 rounded-full object-cover border border-zinc-200 dark:border-[#292D32]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-zinc-950 dark:text-white text-base">{exp.name}</h3>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                            Verification Pending
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-[#B8BEC7]">{exp.headline}</p>
                        <p className="text-xs text-zinc-500 dark:text-[#858D98] mt-1 max-w-xl leading-relaxed">{exp.bio}</p>

                        <div className="pt-2 flex flex-wrap gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#1B1F23] font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                            Expertise: {exp.areasOfExpertise.join(', ')}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#1B1F23] font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                            Qualifications: {exp.qualifications}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => handleRejectExpert(exp.userId)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-[#858D98] hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-xl border border-zinc-200/80 dark:border-[#292D32] transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerifyExpert(exp.userId)}
                        className="px-5 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#FF6B00] mx-auto" />
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">Clean Moderation Queue</h4>
                <p className="text-xs text-zinc-500 dark:text-[#858D98] max-w-sm mx-auto">
                  Zero flagged messages, predatory contacts, or community violations reported.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep: UserReport) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-950 dark:text-white">
                          {rep.reportedEntityType.toUpperCase()}: {rep.entitySummary}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            rep.status === 'pending'
                              ? 'bg-[#FFF4ED] dark:bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20'
                              : 'bg-zinc-100 dark:bg-[#1B1F23] text-zinc-600 dark:text-[#858D98]'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-[#B8BEC7]">Reason: {rep.reason}</p>
                      <div className="text-[10px] text-zinc-400 dark:text-[#858D98]">
                        Reported by: {rep.reporterName} on{' '}
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismiss')}
                          className="px-3.5 py-1.5 text-zinc-600 dark:text-[#858D98] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-xl border border-zinc-200/80 dark:border-[#292D32] transition-colors cursor-pointer"
                        >
                          Dismiss (No violation)
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'remove')}
                          className="px-4 py-1.5 text-white bg-rose-600 hover:bg-rose-700 font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Remove Content
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-50 dark:bg-[#111315] border-b border-zinc-200/80 dark:border-[#292D32] text-zinc-600 dark:text-[#858D98] font-semibold">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Life Stage</th>
                  <th className="px-6 py-3.5">Hours / Wk</th>
                  <th className="px-6 py-3.5">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-[#292D32]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/60 dark:hover:bg-[#1B1F23]/60 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-[#292D32]" />
                      <div>
                        <div className="font-semibold text-zinc-950 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-zinc-400 dark:text-[#858D98]">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold capitalize text-zinc-800 dark:text-white bg-zinc-100 dark:bg-[#1B1F23] px-2 py-0.5 rounded-md text-[11px] border border-zinc-200 dark:border-[#292D32]">{u.role}</span>
                    </td>
                    <td className="px-6 py-4 capitalize text-zinc-600 dark:text-[#B8BEC7]">
                      {u.lifeStage.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-600 dark:text-[#B8BEC7]">
                      {u.availableHoursPerWeek} hrs
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-[#B8BEC7]">
                      {u.onboardingCompleted ? (
                        <span className="text-[#FF6B00] font-semibold">Yes</span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-200/80 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-950 dark:text-white">Privileged System Audit Trail</span>
              <span className="text-zinc-500 dark:text-[#858D98] font-mono">{auditLogs.length} events logged</span>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-[#292D32] text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-5 hover:bg-zinc-50/60 dark:hover:bg-[#1B1F23]/60 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 px-2 py-0.5 rounded-md border border-[#FF6B00]/20 text-[10px]">[{log.action}]</span>
                      <span className="text-zinc-300 dark:text-zinc-600">·</span>
                      <span className="font-medium text-zinc-800 dark:text-[#B8BEC7]">Actor: {log.actorName} ({log.actorRole})</span>
                    </div>
                    <p className="text-zinc-600 dark:text-[#858D98]">{log.details}</p>
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
