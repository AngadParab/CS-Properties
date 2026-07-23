'use client';

import { useState } from 'react';
import Link from 'next/link';
import { progressLeadAction } from '@/app/dashboard/leads/actions';

interface Property {
  id: string;
  title: string;
}

interface AssignedTo {
  id: string;
  name: string;
}

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'NEW' | 'CONTACTED' | 'SITE_VISIT_SCHEDULED' | 'UNDER_NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  budget: number;
  notes?: string | null;
  source?: string | null;
  property?: Property | null;
  assignedTo?: AssignedTo | null;
  createdAt: string;
}

const COLUMNS: { id: Lead['status']; label: string; border: string; bg: string; text: string }[] = [
  { id: 'NEW', label: 'New Inquiries', border: 'border-t-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-400' },
  { id: 'CONTACTED', label: 'Contacted', border: 'border-t-yellow-500', bg: 'bg-yellow-500/5', text: 'text-yellow-400' },
  { id: 'SITE_VISIT_SCHEDULED', label: 'Site Visit', border: 'border-t-orange-500', bg: 'bg-orange-500/5', text: 'text-orange-400' },
  { id: 'UNDER_NEGOTIATION', label: 'Negotiation', border: 'border-t-pink-500', bg: 'bg-pink-500/5', text: 'text-pink-400' },
  { id: 'CLOSED_WON', label: 'Won', border: 'border-t-green-500', bg: 'bg-green-500/5', text: 'text-green-400' },
  { id: 'CLOSED_LOST', label: 'Lost', border: 'border-t-red-500', bg: 'bg-red-500/5', text: 'text-red-400' },
];

export default function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [transitioningLead, setTransitioningLead] = useState<Lead | null>(null);
  const [targetStatus, setTargetStatus] = useState<Lead['status'] | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const openTransitionModal = (lead: Lead, status: Lead['status']) => {
    setTransitioningLead(lead);
    setTargetStatus(status);
    setComment('');
    setError('');
  };

  const handleTransition = async () => {
    if (!transitioningLead || !targetStatus) return;
    if (!comment.trim()) {
      setError('Please add a comment explaining this status change.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await progressLeadAction(transitioningLead.id, targetStatus, comment.trim());

    if (res.success) {
      setTransitioningLead(null);
      setTargetStatus(null);
      setComment('');
    } else {
      setError(res.error || 'Failed to transition lead status.');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Kanban Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-h-0 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colLeads = initialLeads.filter((l) => l.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-900/20 ${col.border} border-t-4 min-w-[240px]`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                <span className={`text-sm font-bold tracking-wide ${col.text}`}>{col.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 scrollbar-thin">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl space-y-3 shadow-md hover:shadow-xl transition group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="font-bold text-sm text-zinc-100 hover:text-indigo-400 transition truncate block max-w-[85%]"
                        title={lead.fullName}
                      >
                        {lead.fullName}
                      </Link>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1">
                      <p className="flex items-center gap-1.5 truncate">
                        <span>💰</span>
                        <span className="font-semibold text-zinc-200">
                          ${lead.budget.toLocaleString()}
                        </span>
                      </p>
                      {lead.property && (
                        <p className="flex items-center gap-1.5 truncate">
                          <span>🏠</span>
                          <span className="text-zinc-300 font-medium">{lead.property.title}</span>
                        </p>
                      )}
                      {lead.assignedTo && (
                        <p className="flex items-center gap-1.5 truncate">
                          <span>👤</span>
                          <span>{lead.assignedTo.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Transition actions */}
                    <div className="pt-2 border-t border-zinc-800/50 flex flex-wrap gap-1.5 shrink-0">
                      {lead.status === 'NEW' && (
                        <button
                          onClick={() => openTransitionModal(lead, 'CONTACTED')}
                          className="w-full text-center bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-300 py-1.5 px-2 rounded text-[11px] font-bold transition cursor-pointer"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {lead.status === 'CONTACTED' && (
                        <button
                          onClick={() => openTransitionModal(lead, 'SITE_VISIT_SCHEDULED')}
                          className="w-full text-center bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-300 py-1.5 px-2 rounded text-[11px] font-bold transition cursor-pointer"
                        >
                          Schedule Visit
                        </button>
                      )}
                      {lead.status === 'SITE_VISIT_SCHEDULED' && (
                        <button
                          onClick={() => openTransitionModal(lead, 'UNDER_NEGOTIATION')}
                          className="w-full text-center bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-300 py-1.5 px-2 rounded text-[11px] font-bold transition cursor-pointer"
                        >
                          Mark Negotiating
                        </button>
                      )}
                      {lead.status === 'UNDER_NEGOTIATION' && (
                        <div className="grid grid-cols-2 gap-1.5 w-full">
                          <button
                            onClick={() => openTransitionModal(lead, 'CLOSED_WON')}
                            className="bg-green-950 text-green-300 hover:bg-green-600 hover:text-white py-1.5 px-1.5 rounded text-[11px] font-bold text-center transition cursor-pointer"
                          >
                            Won
                          </button>
                          <button
                            onClick={() => openTransitionModal(lead, 'CLOSED_LOST')}
                            className="bg-red-950 text-red-300 hover:bg-red-600 hover:text-white py-1.5 px-1.5 rounded text-[11px] font-bold text-center transition cursor-pointer"
                          >
                            Lost
                          </button>
                        </div>
                      )}
                      {(lead.status === 'CLOSED_WON' || lead.status === 'CLOSED_LOST') && (
                        <span className="w-full text-center text-zinc-600 py-1 text-[10px] font-medium uppercase tracking-wide">
                          Terminal Stage
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transition Comment Modal */}
      {transitioningLead && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔄</span> Progress Status for {transitioningLead.fullName}
            </h3>
            <p className="text-sm text-zinc-400">
              Moving status from <span className="font-semibold text-zinc-200">{transitioningLead.status}</span> to{' '}
              <span className="font-semibold text-indigo-400">{targetStatus}</span>.
            </p>

            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-300 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Reason / Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Discussed property layout, scheduled Saturday tour..."
                rows={3}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-zinc-100 placeholder-zinc-600 transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                disabled={loading}
                onClick={() => setTransitioningLead(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg text-zinc-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleTransition}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold rounded-lg text-white transition cursor-pointer"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
