import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLeads, updateLeadStatus } from '../services/api';
import { LogOut, Calendar, User, Phone, MapPin, ChevronDown, ChevronUp, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';

function AdminDashboard() {
  const { token, logout } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null); // stores lead ID being updated

  const statuses = ['All', 'New', 'Pending Document', 'Contacted', 'Approved', 'Rejected'];

  const getLeadsList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchLeads(token);
      setLeads(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeadsList();
  }, [token]);

  // Handle status update change from dropdown
  const handleStatusChange = async (id, newStatus) => {
    setIsUpdating(id);
    try {
      await updateLeadStatus(id, newStatus, token);

      // Update local state directly
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === id ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      alert(`Error updating lead status: ${err.message}`);
    } finally {
      setIsUpdating(null);
    }
  };

  // Toggle detail card expanded view
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Filtered leads computation
  const filteredLeads = useMemo(() => {
    if (statusFilter === 'All') return leads;
    return leads.filter((lead) => lead.status === statusFilter);
  }, [leads, statusFilter]);

  // Lead counters computation
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
    const approvedCount = leads.filter((l) => l.status === 'Approved').length;

    return { total, newCount, contactedCount, approvedCount };
  }, [leads]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* 1. Header with Title & Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-brand-navy" />
            <h1 className="text-2xl font-bold text-brand-navy">CRM Leads Dashboard</h1>
          </div>
          <p className="text-xs text-brand-text-muted">Manage loan applications and client status cards.</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-semibold px-4 py-2 rounded-lg text-xs transition-colors outline-none"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-brand-navy rounded-lg">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Total Leads</span>
            <span className="text-2xl font-extrabold text-brand-navy">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-brand-gold rounded-lg">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">New</span>
            <span className="text-2xl font-extrabold text-brand-navy">{stats.newCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Contacted</span>
            <span className="text-2xl font-extrabold text-brand-navy">{stats.contactedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-brand-success rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Approved</span>
            <span className="text-2xl font-extrabold text-brand-navy">{stats.approvedCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Action Toolbar: Filters & Reload */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors outline-none ${statusFilter === status
                  ? 'bg-brand-navy text-white'
                  : 'bg-slate-50 text-brand-navy hover:bg-slate-100'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={getLeadsList}
          disabled={loading}
          className="flex items-center space-x-1.5 text-xs font-semibold text-brand-navy hover:text-brand-gold self-end sm:self-auto disabled:opacity-50 outline-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Records</span>
        </button>
      </div>

      {/* 4. Leads List Grid / Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brand-navy">
            <RefreshCw className="w-10 h-10 animate-spin text-brand-navy" />
            <span className="mt-4 text-xs font-semibold uppercase tracking-widest">Loading Leads...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-brand-error font-semibold text-sm bg-red-50 border border-red-100 m-6 rounded-xl">
            {error}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center text-brand-text-muted text-sm font-semibold">
            No leads recorded matching "{statusFilter}" status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">

              {/* Table Head */}
              <thead className="bg-slate-50 text-brand-navy font-bold text-left text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Loan Specs</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Pipeline Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-sm text-brand-text-primary">
                {filteredLeads.map((lead) => {
                  const isExpanded = expandedRow === lead._id;

                  return (
                    <React.Fragment key={lead._id}>
                      {/* Primary Row */}
                      <tr className={`hover:bg-slate-50/50 transition-colors ${isExpanded ? 'bg-slate-50/30' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-brand-text-muted">
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{formatDate(lead.createdAt)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-brand-navy leading-tight">{lead.fullName}</div>
                          <div className="text-xs text-brand-text-muted flex items-center space-x-1 mt-0.5">
                            <Phone className="w-3 h-3 text-brand-gold shrink-0" />
                            <span>{lead.phone}</span>
                            {lead.email && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[120px]">{lead.email}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-brand-navy text-xs uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded w-fit">
                            {lead.loanType}
                          </div>
                          <div className="text-xs text-brand-text-muted font-bold mt-1">
                            {formatCurrency(lead.amount)} <span className="font-medium">over {lead.tenureYears} yrs</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-brand-text-muted">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span>{lead.location}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isUpdating === lead._id ? (
                            <span className="text-xs font-semibold text-brand-text-muted flex items-center space-x-1">
                              <RefreshCw className="w-3 h-3 animate-spin text-brand-gold" />
                              <span>Updating...</span>
                            </span>
                          ) : (
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 rounded-md border outline-none cursor-pointer bg-white ${lead.status === 'New'
                                  ? 'text-amber-600 border-amber-200 bg-amber-50/50'
                                  : lead.status === 'Contacted'
                                    ? 'text-teal-600 border-teal-200 bg-teal-50/50'
                                    : lead.status === 'Approved'
                                      ? 'text-emerald-600 border-emerald-200 bg-emerald-50/50'
                                      : lead.status === 'Rejected'
                                        ? 'text-red-600 border-red-200 bg-red-50/50'
                                        : 'text-slate-600 border-slate-200 bg-slate-50/50'
                                }`}
                            >
                              {statuses.filter((s) => s !== 'All').map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleRow(lead._id)}
                            className="text-brand-navy hover:text-brand-gold inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 transition-all outline-none"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Card Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="6" className="bg-slate-50/40 px-6 py-5 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">

                              {/* Income Liabilities */}
                              <div className="space-y-2">
                                <h4 className="font-bold text-brand-navy uppercase tracking-wide text-[10px] text-brand-text-muted">
                                  Financial Context
                                </h4>
                                <div className="space-y-1">
                                  <p className="text-brand-text-muted">Employment: <span className="font-bold text-brand-navy">{lead.employmentType}</span></p>
                                  <p className="text-brand-text-muted">Monthly Income: <span className="font-bold text-brand-navy">{formatCurrency(lead.monthlyIncome)}</span></p>
                                  <p className="text-brand-text-muted">Existing EMIs: <span className="font-bold text-brand-navy">{formatCurrency(lead.existingEmis)}</span></p>
                                </div>
                              </div>

                              {/* Additional notes/text */}
                              <div className="md:col-span-2 space-y-2">
                                <h4 className="font-bold text-brand-navy uppercase tracking-wide text-[10px] text-brand-text-muted">
                                  Applicant Comments & Target Metadata
                                </h4>
                                <p className="bg-white p-3 rounded-lg border border-slate-100 text-xs text-brand-navy leading-relaxed italic whitespace-pre-line">
                                  {lead.notes || 'No applicant comments registered for this inquiry.'}
                                </p>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
