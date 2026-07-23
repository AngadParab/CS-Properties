import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { 
  fetchDeals, 
  updateDealStage, 
  fetchActivityLog, 
  addActivityEntry, 
  fetchAgents, 
  fetchDocuments, 
  addDocumentMetadata, 
  getDocumentDownloadUrl 
} from '../services/api';
import { db, storage } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { 
  LogOut, Calendar, Phone, MapPin, ChevronRight, RefreshCw, BarChart2, 
  ShieldCheck, Users, Briefcase, FileText, Send, UploadCloud, Download, 
  Lock, X, CheckCircle, ArrowRight, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminDashboard() {
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'agents'
  const [deals, setDeals] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  // Drawer state
  const [drawerTab, setDrawerTab] = useState('info'); // 'info' | 'activity' | 'vault'
  const [activities, setActivities] = useState([]);
  const [newActivityText, setNewActivityText] = useState('');
  const [activityType, setActivityType] = useState('note'); // 'note' | 'call' | 'email' | 'task'
  const [documents, setDocuments] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null); // stores deal ID being updated
  
  const dealStages = ['New', 'Contacted', 'Qualified', 'Offer Submitted', 'Closed'];

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const dealsRes = await fetchDeals();
      setDeals(dealsRes.data || []);
      
      const agentsRes = await fetchAgents();
      setAgents(agentsRes || []);
    } catch (err) {
      setError(err.message || 'Failed to sync CRM records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle stage change from columns
  const handleStageChange = async (dealId, newStage) => {
    setIsUpdating(dealId);
    try {
      await updateDealStage(dealId, newStage);
      
      // Update local state directly
      setDeals((prev) =>
        prev.map((deal) => (deal._id === dealId ? { ...deal, stage: newStage } : deal))
      );
      
      // Log stage change activity
      await addActivityEntry({
        dealId,
        contactId: deals.find(d => d._id === dealId)?.contactId || null,
        type: 'task',
        payload: {
          title: 'Stage Transitioned',
          text: `Deal progressed to stage: ${newStage}`
        },
        createdBy: user.username || user.email
      });
      
      if (selectedDeal && selectedDeal._id === dealId) {
        setSelectedDeal(prev => ({ ...prev, stage: newStage }));
        // Refresh activities
        const logs = await fetchActivityLog(dealId);
        setActivities(logs);
      }
    } catch (err) {
      alert(`Error updating stage: ${err.message}`);
    } finally {
      setIsUpdating(null);
    }
  };

  // Open detailed deal drawer
  const handleOpenDealDrawer = async (deal) => {
    setSelectedDeal(deal);
    setDrawerTab('info');
    setActivities([]);
    setDocuments([]);
    try {
      const logs = await fetchActivityLog(deal._id);
      setActivities(logs);
      
      const docs = await fetchDocuments(deal._id);
      setDocuments(docs);
    } catch (err) {
      console.warn('Failed to load deal auxiliary records:', err.message);
    }
  };

  // Add activity entry handler
  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;

    try {
      await addActivityEntry({
        dealId: selectedDeal._id,
        contactId: selectedDeal.contactId,
        type: activityType,
        payload: {
          title: activityType.charAt(0).toUpperCase() + activityType.slice(1) + ' Logged',
          text: newActivityText.trim()
        },
        createdBy: user.username || user.email
      });
      setNewActivityText('');
      
      // Reload logs
      const logs = await fetchActivityLog(selectedDeal._id);
      setActivities(logs);
    } catch (err) {
      alert('Failed to log activity: ' + err.message);
    }
  };

  // Document download link retrieval (secure mediated function)
  const handleDownloadDoc = async (documentId) => {
    try {
      const url = await getDocumentDownloadUrl(documentId);
      window.open(url, '_blank');
    } catch (err) {
      alert(err.message || 'MFA or role credentials verified incorrectly.');
    }
  };

  // Document uploading handler
  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const storagePath = `deals/${selectedDeal._id}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, storagePath);
      
      // Upload bytes directly
      await uploadBytes(fileRef, file);
      
      // Add document metadata record to database
      await addDocumentMetadata({
        dealId: selectedDeal._id,
        propertyId: selectedDeal.listingId || null,
        storagePath,
        filename: file.name,
        uploadedBy: user.username || user.email
      });

      // Log upload activity
      await addActivityEntry({
        dealId: selectedDeal._id,
        contactId: selectedDeal.contactId,
        type: 'note',
        payload: {
          title: 'Document Uploaded',
          text: `Attached file: ${file.name}`
        },
        createdBy: user.username || user.email
      });

      // Refresh documents and activities
      const docs = await fetchDocuments(selectedDeal._id);
      setDocuments(docs);
      
      const logs = await fetchActivityLog(selectedDeal._id);
      setActivities(logs);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  // Role Claim synchronization trigger (write to agent document)
  const handleAgentRoleChange = async (agentId, newRole) => {
    try {
      const agentRef = doc(db, 'agents', agentId);
      await updateDoc(agentRef, { role: newRole });
      
      // Update local state
      setAgents(prev => prev.map(a => a._id === agentId ? { ...a, role: newRole } : a));
      alert(`Claim sync triggered: Synced ${newRole} claim for agent.`);
    } catch (err) {
      alert('Failed to update agent role claims: ' + err.message);
    }
  };

  // Filter columns
  const getStageDeals = (stage) => {
    return deals.filter(d => (d.stage || 'New').toLowerCase() === stage.toLowerCase());
  };

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[90vh]">
      <Helmet>
        <title>Admin CRM Pipeline Dashboard | CS Properties</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* 1. Sticky Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-brand-navy" />
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">CRM Enterprise Dashboard</h1>
          </div>
          <p className="text-xs text-brand-text-muted">Real Estate CRM & Automation Engine | User: <span className="font-bold text-brand-navy">{user?.email}</span></p>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'kanban' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-text-muted hover:text-brand-navy'}`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Deals Kanban</span>
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'agents' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-text-muted hover:text-brand-navy'}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Agent Roster</span>
            </button>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0 outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-brand-error text-xs font-bold p-4 rounded-xl border border-red-100 flex items-center space-x-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-brand-navy">
          <RefreshCw className="w-10 h-10 animate-spin text-brand-navy" />
          <span className="mt-4 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Pipeline Data...</span>
        </div>
      ) : activeTab === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="space-y-6">
          
          {/* Dashboard Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-brand-navy rounded-lg"><Briefcase className="w-5 h-5" /></div>
              <div>
                <span className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Active Deals</span>
                <span className="text-xl font-extrabold text-brand-navy">{deals.length}</span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
              <div>
                <span className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Closed Deals</span>
                <span className="text-xl font-extrabold text-brand-navy">{getStageDeals('Closed').length}</span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="p-2.5 bg-amber-50 text-brand-gold rounded-lg"><RefreshCw className="w-4 h-4 animate-spin-slow" /></div>
              <div>
                <span className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">In Progress</span>
                <span className="text-xl font-extrabold text-brand-navy">{deals.length - getStageDeals('Closed').length}</span>
              </div>
            </div>
            <button
              onClick={loadAllData}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-xl transition-all flex items-center justify-between text-left group"
            >
              <div>
                <span className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Sync Status</span>
                <span className="text-xs font-bold text-brand-navy">Reload Pipeline</span>
              </div>
              <RefreshCw className="w-5 h-5 text-brand-navy group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
            {dealStages.map((stage) => {
              const stageDeals = getStageDeals(stage);

              return (
                <div key={stage} className="bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4 flex flex-col min-w-[220px] max-h-[80vh]">
                  <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-200">
                    <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">{stage}</h3>
                    <span className="bg-slate-200 text-brand-navy font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="space-y-3 overflow-y-auto pr-1 flex-grow scrollbar-thin">
                    {stageDeals.length === 0 ? (
                      <div className="py-8 text-center text-[10px] font-medium text-slate-400 italic">
                        No deals in stage
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <motion.div
                          key={deal._id}
                          layoutId={deal._id}
                          onClick={() => handleOpenDealDrawer(deal)}
                          className="bg-white border border-slate-150 p-3.5 rounded-xl shadow-xs hover:shadow-md hover:border-brand-gold/60 cursor-pointer transition-all space-y-2 group relative"
                        >
                          {/* Pipeline badge */}
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${deal.pipelineType === 'seller' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {deal.pipelineType}
                            </span>
                            <span className="text-[9px] text-brand-text-muted">{formatDate(deal.updatedAt)}</span>
                          </div>

                          {/* Client name */}
                          <h4 className="font-bold text-sm text-brand-navy leading-tight group-hover:text-brand-goldDark transition-colors">
                            {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : 'Unassigned Contact'}
                          </h4>

                          {/* Financials details */}
                          <div className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
                            <span>Budget:</span>
                            <span className="text-brand-navy">
                              {deal.pipelineType === 'seller' 
                                ? formatCurrency(deal.askingPrice) 
                                : (deal.contact?.budgetMax ? formatCurrency(deal.contact.budgetMax) : 'Not Specd')}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center space-x-1 text-[10px] text-brand-text-muted">
                            <MapPin className="w-3 h-3 text-brand-gold shrink-0" />
                            <span className="truncate">{deal.contact?.preferredZones?.[0] || 'Goa Region'}</span>
                          </div>

                          {/* Assigned Agent */}
                          <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-50 text-[10px] text-brand-navy font-semibold">
                            <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-[8px]">
                              {deal.agent?.fullName?.charAt(0) || 'U'}
                            </div>
                            <span className="truncate">{deal.agent ? deal.agent.fullName : 'Broker Queue'}</span>
                          </div>

                          {isUpdating === deal._id && (
                            <div className="absolute inset-0 bg-white/60 rounded-xl flex items-center justify-center">
                              <RefreshCw className="w-5 h-5 animate-spin text-brand-gold" />
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* AGENTS ROSTER VIEW */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">Active Agent Roster</h2>
              <p className="text-xs text-brand-text-muted">Manage user roles, territorial jurisdictions, and system claim syncing.</p>
            </div>
            <div className="bg-blue-50 text-brand-navy text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{agents.length} Total Users</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-brand-navy font-bold text-xs uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Agent details</th>
                  <th className="px-6 py-4">Role Custom Claim</th>
                  <th className="px-6 py-4">Territory</th>
                  <th className="px-6 py-4">Lead Capacity Tracker</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {agents.map((agent) => {
                  const capacityPct = Math.min(((agent.currentOpenLeadCount || 0) / (agent.maxLeadCapacity || 10)) * 100, 100);

                  return (
                    <tr key={agent._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-brand-navy leading-tight">{agent.fullName}</div>
                        <div className="text-xs text-brand-text-muted font-mono">{agent.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={agent.role}
                          onChange={(e) => handleAgentRoleChange(agent._id, e.target.value)}
                          className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-brand-navy outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="admin">Administrator</option>
                          <option value="broker">Broker Manager</option>
                          <option value="listing_agent">Listing Agent</option>
                          <option value="sales_agent">Sales Agent</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span>{agent.territory || 'Unassigned'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 max-w-[180px]">
                          <div className="flex justify-between text-xs font-bold text-brand-navy">
                            <span>{agent.currentOpenLeadCount || 0} / {agent.maxLeadCapacity || 10} leads</span>
                            <span>{Math.round(capacityPct)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${capacityPct >= 90 ? 'bg-rose-500' : capacityPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${capacityPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${agent.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {agent.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Side-Over Detail Drawer */}
      <AnimatePresence>
        {selectedDeal && (
          <>
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeal(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 font-sans"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${selectedDeal.pipelineType === 'seller' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {selectedDeal.pipelineType} Pipeline
                    </span>
                    <span className="text-[10px] text-brand-text-muted">Updated {formatDate(selectedDeal.updatedAt)}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-brand-navy">
                    {selectedDeal.contact ? `${selectedDeal.contact.firstName} ${selectedDeal.contact.lastName}` : 'Unassigned Deal'}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="p-1.5 rounded-lg bg-slate-200/50 hover:bg-slate-200 transition-colors text-brand-navy shrink-0 outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Menu Tabs */}
              <div className="border-b border-slate-100 flex text-xs font-bold text-brand-text-muted bg-white px-4">
                <button
                  onClick={() => setDrawerTab('info')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all ${drawerTab === 'info' ? 'border-brand-navy text-brand-navy' : 'border-transparent hover:text-brand-navy'}`}
                >
                  General Profile
                </button>
                <button
                  onClick={() => setDrawerTab('activity')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all ${drawerTab === 'activity' ? 'border-brand-navy text-brand-navy' : 'border-transparent hover:text-brand-navy'}`}
                >
                  Activity Feed ({activities.length})
                </button>
                <button
                  onClick={() => setDrawerTab('vault')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all ${drawerTab === 'vault' ? 'border-brand-navy text-brand-navy' : 'border-transparent hover:text-brand-navy'}`}
                >
                  Document Vault ({documents.length})
                </button>
              </div>

              {/* Drawer Dynamic Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/20">
                
                {/* 1. General Profile Tab */}
                {drawerTab === 'info' && (
                  <div className="space-y-6">
                    {/* CRM Contact Details */}
                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
                      <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
                        <Users className="w-4 h-4 text-brand-gold shrink-0" />
                        <span>Client Information</span>
                      </h3>

                      <div className="grid grid-cols-1 gap-3.5 text-xs text-brand-text-muted">
                        <div>
                          <span className="block font-bold text-brand-navy">Full Name</span>
                          <span className="text-sm font-semibold">{selectedDeal.contact ? `${selectedDeal.contact.firstName} ${selectedDeal.contact.lastName}` : 'N/A'}</span>
                        </div>
                        {selectedDeal.contact?.email && (
                          <div>
                            <span className="block font-bold text-brand-navy">Email Address</span>
                            <a href={`mailto:${selectedDeal.contact.email}`} className="text-sm font-semibold text-blue-600 hover:underline">{selectedDeal.contact.email}</a>
                          </div>
                        )}
                        <div>
                          <span className="block font-bold text-brand-navy">Phone Contact</span>
                          <a href={`tel:${selectedDeal.contact?.phone}`} className="text-sm font-semibold text-blue-600 hover:underline flex items-center space-x-1.5">
                            <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span>{selectedDeal.contact?.phone || 'N/A'}</span>
                          </a>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block font-bold text-brand-navy">Lead Source</span>
                            <span className="font-semibold text-brand-navy bg-slate-50 px-2 py-0.5 rounded w-fit border border-slate-100">{selectedDeal.contact?.leadSource || 'Web Form'}</span>
                          </div>
                          <div>
                            <span className="block font-bold text-brand-navy">Created Date</span>
                            <span className="font-semibold">{formatDate(selectedDeal.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferences & Criteria */}
                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
                      <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
                        <Briefcase className="w-4 h-4 text-brand-gold shrink-0" />
                        <span>Lead Criteria Specs</span>
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-xs text-brand-text-muted">
                        <div>
                          <span className="block font-bold text-brand-navy">Budget Value</span>
                          <span className="text-sm font-extrabold text-brand-navy">
                            {selectedDeal.pipelineType === 'seller' 
                              ? formatCurrency(selectedDeal.askingPrice) 
                              : formatCurrency(selectedDeal.contact?.budgetMax)}
                          </span>
                        </div>
                        <div>
                          <span className="block font-bold text-brand-navy">Preferred Regions</span>
                          <span className="font-semibold">{selectedDeal.contact?.preferredZones?.join(', ') || 'Goa District'}</span>
                        </div>
                        <div>
                          <span className="block font-bold text-brand-navy">Rooms Intent</span>
                          <span className="font-semibold">{selectedDeal.contact?.preferredBedrooms || 'Any'} Bedrooms</span>
                        </div>
                        <div>
                          <span className="block font-bold text-brand-navy">Assigned Agent</span>
                          <span className="font-semibold text-brand-navy font-bold">{selectedDeal.agent ? selectedDeal.agent.fullName : 'Broker Queue Escalation'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pipeline Stage Transitions Selector */}
                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
                      <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider pb-2 border-b border-slate-100">
                        Pipeline Progression Stage
                      </h3>
                      
                      <div className="flex flex-col space-y-3.5">
                        <label className="text-xs font-bold text-brand-navy">Transition stage to:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {dealStages.map(stage => {
                            const isCurrent = (selectedDeal.stage || 'New').toLowerCase() === stage.toLowerCase();
                            return (
                              <button
                                key={stage}
                                onClick={() => handleStageChange(selectedDeal._id, stage)}
                                className={`text-[10px] font-bold py-2 rounded-lg border transition-all ${isCurrent ? 'bg-brand-navy text-white border-brand-navy shadow-sm' : 'bg-slate-50 border-slate-200 text-brand-navy hover:bg-slate-100'}`}
                              >
                                {stage}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Activity Feed Tab */}
                {drawerTab === 'activity' && (
                  <div className="space-y-6">
                    {/* Add Activity Form */}
                    <form onSubmit={handleAddActivity} className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">Log Conversation/Note</span>
                        <div className="flex items-center space-x-1.5 text-[9px] font-bold text-brand-text-muted">
                          {['note', 'call', 'email', 'task'].map(t => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setActivityType(t)}
                              className={`px-2 py-0.5 rounded capitalize transition-colors ${activityType === t ? 'bg-brand-navy text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          rows="2.5"
                          value={newActivityText}
                          onChange={(e) => setNewActivityText(e.target.value)}
                          placeholder="Type notes details here..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
                        />
                        <button
                          type="submit"
                          className="absolute right-2.5 bottom-2.5 bg-brand-navy hover:bg-blue-900 text-white p-1.5 rounded-lg transition-colors outline-none"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>

                    {/* Timeline Feed list */}
                    <div className="space-y-4">
                      {activities.length === 0 ? (
                        <div className="py-12 text-center text-xs font-semibold text-brand-text-muted italic">
                          No activities logged for this deal.
                        </div>
                      ) : (
                        activities.map((act) => (
                          <div key={act._id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex items-start space-x-3.5 relative overflow-hidden">
                            {/* Decorative line indicator */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-goldDark" />
                            
                            <div className="flex-grow space-y-1">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-extrabold text-brand-navy uppercase tracking-wider">{act.payload?.title || 'System Alert'}</span>
                                <span className="text-[9px] text-brand-text-muted font-bold">{formatDate(act.createdAt)}</span>
                              </div>
                              <p className="text-xs text-brand-navy leading-relaxed font-medium">
                                {act.payload?.text || act.payload?.description}
                              </p>
                              <div className="text-[9px] text-brand-text-muted flex items-center space-x-1">
                                <span>Created by:</span>
                                <span className="font-bold text-brand-navy uppercase">{act.createdBy}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Document Vault Tab */}
                {drawerTab === 'vault' && (
                  <div className="space-y-6">
                    {/* Vault Upload button */}
                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs text-center space-y-4">
                      <div className="mx-auto w-12 h-12 bg-blue-50 text-brand-navy rounded-full flex items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-brand-navy" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-brand-navy">Upload files to Document Vault</h4>
                        <p className="text-[10px] text-brand-text-muted">Upload contract drafts, title clearances, or bank statements.</p>
                      </div>
                      <div className="flex justify-center">
                        <label className="bg-brand-navy hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm inline-flex items-center space-x-2">
                          <UploadCloud className="w-4 h-4" />
                          <span>{uploadingFile ? 'Uploading Attachment...' : 'Select File Upload'}</span>
                          <input
                            type="file"
                            disabled={uploadingFile}
                            onChange={handleUploadDocument}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Vault Document files list */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold text-brand-navy uppercase tracking-wider flex items-center space-x-1">
                        <FileText className="w-4 h-4 text-brand-gold shrink-0" />
                        <span>Vault Documents ({documents.length})</span>
                      </h4>

                      {documents.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-xs font-semibold text-brand-text-muted italic shadow-xs">
                          No document attachments registered.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {documents.map((docFile) => (
                            <div key={docFile._id} className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-xs flex items-center justify-between group hover:border-brand-navy transition-all">
                              <div className="flex items-center space-x-3 truncate">
                                <FileText className="w-5 h-5 text-brand-gold shrink-0" />
                                <div className="truncate">
                                  <span className="block text-xs font-bold text-brand-navy truncate max-w-[200px]">{docFile.filename}</span>
                                  <span className="block text-[9px] text-brand-text-muted">Uploaded {formatDate(docFile.createdAt)}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownloadDoc(docFile._id)}
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-brand-navy p-2 rounded-lg transition-colors outline-none shrink-0"
                                title="Download Securely"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
