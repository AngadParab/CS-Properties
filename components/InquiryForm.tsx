'use client';

import { useState } from 'react';
import { submitInquiryAction } from '@/app/properties/[id]/actions';

export default function InquiryForm({ propertyId }: { propertyId: string }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !budget) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await submitInquiryAction(propertyId, {
        fullName,
        email,
        phone,
        budget: parseFloat(budget),
        notes,
      });

      if (res.success) {
        setSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setBudget('');
        setNotes('');
      } else {
        setError(res.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-900/60 p-6 rounded-2xl text-center space-y-3">
        <span className="text-3xl">🎉</span>
        <h4 className="text-emerald-400 font-bold text-base">Inquiry Submitted!</h4>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Thank you for your interest. One of our listing agents will contact you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-900 p-6 rounded-2xl space-y-4 shadow-xl">
      <h3 className="text-base font-bold text-white">Inquire About This Property</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">
        Fill out the form below to receive more details and schedule a walkthrough.
      </p>

      {error && (
        <div className="bg-red-950/50 border border-red-800 text-red-300 p-3 rounded-lg text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Full Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Phone Number *</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 019-2834"
            className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Your Maximum Budget ($) *</label>
          <input
            type="number"
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="1200000"
            className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Message / Custom Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="I would like to request a site visit on..."
            rows={3}
            className="mt-1 block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-md hover:shadow-indigo-500/20 transition cursor-pointer"
        >
          {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
