'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createActivityAction } from '@/app/dashboard/leads/[id]/actions';

interface Property {
  id: string;
  title: string;
  price: number;
}

interface AssignedTo {
  id: string;
  name: string;
  role: string;
}

interface Actor {
  id: string;
  name: string;
  role: string;
}

interface Activity {
  id: string;
  actor: Actor;
  type: 'CALL' | 'EMAIL' | 'SITE_VISIT' | 'NOTE' | 'STATUS_CHANGE';
  comment: string;
  createdAt: string;
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

export default function LeadDetailView({
  lead,
  activities,
}: {
  lead: Lead;
  activities: Activity[];
}) {
  const [type, setType] = useState<Activity['type']>('NOTE');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please add a comment description.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await createActivityAction(lead.id, type, comment.trim());
      if (res.success) {
        setComment('');
        setType('NOTE');
      } else {
        setError(res.error || 'Failed to log activity.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while saving activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort activities chronologically (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex-1 flex flex-col p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            <Link href="/dashboard/leads" className="hover:text-indigo-400 transition">
              Pipeline
            </Link>
            <span>/</span>
            <span className="text-zinc-400">Lead Profile</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{lead.fullName}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Contact Details</h3>

            <div className="space-y-3 text-sm text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500">Email</span>
                <span className="font-medium text-zinc-200">{lead.email}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500">Phone</span>
                <span className="font-medium text-zinc-200">{lead.phone}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500">Stage</span>
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-zinc-800 text-zinc-200">
                  {lead.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500">Budget</span>
                <span className="font-bold text-indigo-400">${lead.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500">Source</span>
                <span className="capitalize text-zinc-300">{lead.source || 'Unknown'}</span>
              </div>
              {lead.assignedTo && (
                <div className="flex justify-between pb-2">
                  <span className="text-zinc-500">Assigned Agent</span>
                  <span className="font-medium text-zinc-200">{lead.assignedTo.name}</span>
                </div>
              )}
            </div>
          </div>

          {lead.property && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">Linked Property</h3>
              <div>
                <p className="font-bold text-zinc-200">{lead.property.title}</p>
                <p className="text-xs text-indigo-400 mt-1 font-semibold">
                  List Price: ${lead.property.price.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Intake Notes</h3>
              <p className="text-sm text-zinc-300 leading-relaxed italic">"{lead.notes}"</p>
            </div>
          )}
        </div>

        {/* Timeline & Interaction Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Interaction Logger Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Log New Activity</h3>

            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase">Interaction Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition"
                  >
                    <option value="NOTE">NOTE</option>
                    <option value="CALL">CALL</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="SITE_VISIT">SITE VISIT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase">Details / Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Summarize the client discussion or visit outcome..."
                  rows={3}
                  className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-700 transition"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2 px-5 rounded-lg shadow-md hover:shadow-indigo-500/20 transition cursor-pointer"
                >
                  {isSubmitting ? 'Logging...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Interaction History</h3>

            {sortedActivities.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No activity history logged yet.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-zinc-800">
                {sortedActivities.map((act) => (
                  <div key={act.id} className="relative pl-10 flex gap-4 items-start group">
                    {/* Circle icon */}
                    <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-zinc-700 flex items-center justify-center top-1 group-hover:border-indigo-500 transition" />

                    <div className="flex-1 bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-indigo-400 uppercase tracking-wide">
                          {act.type}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-200 leading-relaxed">{act.comment}</p>

                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <span>Logged by:</span>
                        <span className="font-semibold text-zinc-400">
                          {act.actor?.name || 'System'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
