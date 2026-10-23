import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  AlertTriangle,
  Lock,
  Clock
} from 'lucide-react';
import { store } from '../services/store';

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'reports' | 'users' | 'audit'>(
    'verification'
  );

  const pendingExperts = store.experts.filter((e) => !e.verified);
  const reports = store.reports;
  const auditLogs = store.auditLogs;
  const users = store.users;

  const handleVerifyExpert = (expertUserId: string, approved: boolean) => {
    store.verifyExpert(expertUserId, approved);
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'resolved' | 'remove') => {
    store.resolveReport(reportId, action);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Platform Governance & Trust</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Administrator Governance Console
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Verify mentor credentials, investigate reported content, and monitor audit trails.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Actor: {store.currentUser.name} (Admin)
            </span>
          </div>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'border-purple-600 text-purple-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Expert Verification Queue ({pendingExperts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-purple-600 text-purple-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Content Moderation ({reports.filter((r) => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-purple-600 text-purple-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: Expert Verification */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Practitioner Verification Queue
            </h2>
            <p className="text-xs text-slate-500">
              Review declared degrees, coaching certifications, and published portfolios before awarding verified status.
            </p>

            {pendingExperts.length === 0 ? (
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                All mentor applications are currently reviewed. No pending submissions.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExperts.map((exp) => (
                  <div
                    key={exp.userId}
                    className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.avatar}
                          alt={exp.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{exp.name}</h3>
                          <p className="text-xs text-slate-500">{exp.headline}</p>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Expertise: {exp.areasOfExpertise.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerifyExpert(exp.userId, false)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerifyExpert(exp.userId, true)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                        >
                          Approve Credentials
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="font-semibold text-slate-800">Submitted Credentials:</div>
                      <p className="text-slate-600">{exp.qualifications}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Content Moderation Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Reported Content & Community Moderation
            </h2>

            {reports.length === 0 ? (
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                Zero open safety reports.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {rep.reportedEntityType.toUpperCase()}: {rep.entitySummary}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            rep.status === 'pending'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-slate-600">Reason: {rep.reason}</p>
                      <div className="text-[10px] text-slate-400">
                        Reported by: {rep.reporterName} on{' '}
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismiss')}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                        >
                          Dismiss (No violation)
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'remove')}
                          className="px-3.5 py-1.5 text-white bg-red-600 hover:bg-red-700 font-semibold rounded-lg shadow-xs"
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Life Stage</th>
                  <th className="px-6 py-3">Hours / Wk</th>
                  <th className="px-6 py-3">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold capitalize text-slate-800">{u.role}</span>
                    </td>
                    <td className="px-6 py-3.5 capitalize text-slate-600">
                      {u.lifeStage.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {u.availableHoursPerWeek} hrs
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {u.onboardingCompleted ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">Privileged System Audit Trail</span>
              <span className="text-slate-500 font-mono">{auditLogs.length} events logged</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50/50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">[{log.action}]</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-700">Actor: {log.actorName} ({log.actorRole})</span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono shrink-0">
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
