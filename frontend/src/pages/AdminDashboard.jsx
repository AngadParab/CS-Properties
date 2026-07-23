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
  getDocumentDownloadUrl,
  createManualDeal,
  createPropertyAndListing,
  deletePropertyListing,
  fetchAdminListings
} from '../services/api';
import { db, storage } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  LogOut, Calendar, Phone, MapPin, ChevronRight, RefreshCw, BarChart2, 
  ShieldCheck, Users, Briefcase, FileText, Send, UploadCloud, Download, 
  Lock, X, CheckCircle, ArrowRight, UserPlus, Image, Plus, Trash, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'agents' | 'inventory'
  const [deals, setDeals] = useState([]);
  const [agents, setAgents] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  // Drawer & Log state
  const [drawerTab, setDrawerTab] = useState('info'); // 'info' | 'activity' | 'vault'
  const [activities, setActivities] = useState([]);
  const [newActivityText, setNewActivityText] = useState('');
  const [activityType, setActivityType] = useState('note'); // 'note' | 'call' | 'email' | 'task'
  const [documents, setDocuments] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null); // stores deal ID being updated
  
  // Modals state
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Manual Deal Form State
  const [dealForm, setDealForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pipelineType: 'buyer',
    budgetMin: '',
    budgetMax: '',
    preferredBedrooms: '3',
    preferredZones: 'South Goa District',
    notes: '',
    assignedAgentId: ''
  });

  // Manual Listing Form State
  const [listingForm, setListingForm] = useState({
    address: '',
    city: 'South Goa District',
    bedrooms: '3',
    bathrooms: '3',
    squareFootage: '1500',
    assetClass: 'Residential Real Estate (Living spaces)',
    subtype: 'Apartments / Flats',
    amenities: 'Security, Parking, Pool',
    askingPrice: '',
    status: 'active',
    webDisplay: true,
    hoaFee: '',
    description: ''
  });
  const [selectedPropertyFiles, setSelectedPropertyFiles] = useState([]);
  const [uploadProgressText, setUploadProgressText] = useState('');

  const dealStages = ['New', 'Contacted', 'Qualified', 'Offer Submitted', 'Closed'];
  const locations = ['South Goa District', 'North Goa District', 'Kushawati District'];
  const assetClasses = [
    'Residential Real Estate (Living spaces)',
    'Commercial Real Estate (Business & income generation)',
    'Industrial Real Estate (Production, storage, logistics)',
    'Land / Plots (Raw, subdivided, or agricultural)',
    'Special Purpose / Mixed-Use'
  ];

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const dealsRes = await fetchDeals();
      setDeals(dealsRes.data || []);
      
      const agentsRes = await fetchAgents();
      setAgents(agentsRes || []);

      const listingsRes = await fetchAdminListings();
      setAdminListings(listingsRes || []);
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
        createdBy: user.email
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
        createdBy: user.email
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

  // Document uploading handler (Vault)
  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const storagePath = `deals/${selectedDeal._id}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, storagePath);
      
      await uploadBytes(fileRef, file);
      
      await addDocumentMetadata({
        dealId: selectedDeal._id,
        propertyId: selectedDeal.listingId || null,
        storagePath,
        filename: file.name,
        uploadedBy: user.email
      });

      await addActivityEntry({
        dealId: selectedDeal._id,
        contactId: selectedDeal.contactId,
        type: 'note',
        payload: {
          title: 'Document Uploaded',
          text: `Attached file: ${file.name}`
        },
        createdBy: user.email
      });

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
      
      setAgents(prev => prev.map(a => a._id === agentId ? { ...a, role: newRole } : a));
      alert(`Claim sync triggered: Synced ${newRole} claim for agent.`);
    } catch (err) {
      alert('Failed to update agent role claims: ' + err.message);
    }
  };

  // Handle manual deal submit
  const handleAddDealSubmit = async (e) => {
    e.preventDefault();
    if (!dealForm.firstName || !dealForm.phone) {
      alert('First Name and Phone are required.');
      return;
    }

    setIsFormSubmitting(true);
    try {
      await createManualDeal({
        firstName: dealForm.firstName,
        lastName: dealForm.lastName,
        email: dealForm.email || null,
        phone: dealForm.phone,
        pipelineType: dealForm.pipelineType,
        budgetMin: dealForm.budgetMin ? Number(dealForm.budgetMin) : null,
        budgetMax: dealForm.budgetMax ? Number(dealForm.budgetMax) : null,
        preferredBedrooms: Number(dealForm.preferredBedrooms) || null,
        preferredZones: [dealForm.preferredZones],
        notes: dealForm.notes,
        assignedAgentId: dealForm.assignedAgentId || null,
        stage: 'New'
      });

      setShowAddDealModal(false);
      setDealForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        pipelineType: 'buyer',
        budgetMin: '',
        budgetMax: '',
        preferredBedrooms: '3',
        preferredZones: 'South Goa District',
        notes: '',
        assignedAgentId: ''
      });

      // Reload
      const dealsRes = await fetchDeals();
      setDeals(dealsRes.data || []);
      alert('Client deal logged successfully!');
    } catch (err) {
      alert('Failed to log client deal: ' + err.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Handle listing property submit with multiple file uploads
  const handleAddListingSubmit = async (e) => {
    e.preventDefault();
    if (!listingForm.address || !listingForm.askingPrice) {
      alert('Property Address and Asking Price are required.');
      return;
    }

    setIsFormSubmitting(true);
    setUploadProgressText('Uploading property images to Storage...');
    try {
      const imageUrls = [];
      const timestamp = Date.now();

      for (let i = 0; i < selectedPropertyFiles.length; i++) {
        const file = selectedPropertyFiles[i];
        const path = `listings/${timestamp}_${Math.random().toString(36).substr(2, 9)}/${file.name}`;
        const fileRef = ref(storage, path);
        
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        imageUrls.push(url);
      }

      setUploadProgressText('Saving property & listing documents...');
      const amenitiesList = listingForm.amenities.split(',').map(s => s.trim()).filter(Boolean);

      await createPropertyAndListing(
        {
          address: listingForm.address,
          city: listingForm.city,
          bedrooms: Number(listingForm.bedrooms),
          bathrooms: Number(listingForm.bathrooms),
          squareFootage: Number(listingForm.squareFootage),
          amenities: amenitiesList,
          hoaFee: listingForm.hoaFee || null,
          description: listingForm.description
        },
        {
          askingPrice: Number(listingForm.askingPrice),
          status: listingForm.status,
          webDisplay: listingForm.webDisplay
        },
        imageUrls
      );

      setShowAddListingModal(false);
      setSelectedPropertyFiles([]);
      setUploadProgressText('');
      setListingForm({
        address: '',
        city: 'South Goa District',
        bedrooms: '3',
        bathrooms: '3',
        squareFootage: '1500',
        assetClass: 'Residential Real Estate (Living spaces)',
        subtype: 'Apartments / Flats',
        amenities: 'Security, Parking, Pool',
        askingPrice: '',
        status: 'active',
        webDisplay: true,
        hoaFee: '',
        description: ''
      });

      // Reload
      const listingsRes = await fetchAdminListings();
      setAdminListings(listingsRes || []);
      alert('Property listed successfully!');
    } catch (err) {
      alert('Failed to list property: ' + err.message);
    } finally {
      setIsFormSubmitting(false);
      setUploadProgressText('');
    }
  };

  // Delete Listing & cleanup images
  const handleDeleteListing = async (listingId, propertyId, images = []) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing and its uploaded files?')) return;
    try {
      await deletePropertyListing(listingId, propertyId, images);
      setAdminListings(prev => prev.filter(l => l._id !== listingId));
      alert('Listing and Storage images deleted successfully.');
    } catch (err) {
      alert('Failed to delete listing: ' + err.message);
    }
  };

  // Toggle Web Display status for listing
  const handleToggleWebDisplay = async (listingId, currentVal) => {
    try {
      const listingRef = doc(db, 'listings', listingId);
      await updateDoc(listingRef, { webDisplay: !currentVal });
      setAdminListings(prev => prev.map(l => l._id === listingId ? { ...l, webDisplay: !currentVal } : l));
    } catch (err) {
      alert('Failed to toggle web visibility: ' + err.message);
    }
  };

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
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'inventory' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-text-muted hover:text-brand-navy'}`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Inventory (Villas)</span>
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
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center space-x-3 text-left">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
              <div>
                <span className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Closed Deals</span>
                <span className="text-xl font-extrabold text-brand-navy">{getStageDeals('Closed').length}</span>
              </div>
            </div>
            <button
              onClick={() => setShowAddDealModal(true)}
              className="bg-brand-navy hover:bg-blue-900 border border-brand-navy p-4 rounded-xl transition-all flex items-center justify-between text-left text-white shadow-sm"
            >
              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-brand-gold">Operations</span>
                <span className="text-xs font-bold">Add Manual Deal</span>
              </div>
              <Plus className="w-5 h-5 text-brand-gold" />
            </button>
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
                          className="bg-white border border-slate-150 p-3.5 rounded-xl shadow-xs hover:shadow-md hover:border-brand-gold/60 cursor-pointer transition-all space-y-2 group relative text-left"
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
      ) : activeTab === 'inventory' ? (
        /* PROPERTY INVENTORY TAB VIEW */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">Villas & Plots Inventory</h2>
              <p className="text-xs text-brand-text-muted">List and update properties showcasing on the public directory.</p>
            </div>
            <button
              onClick={() => setShowAddListingModal(true)}
              className="bg-brand-navy hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-sm"
            >
              <Plus className="w-4.5 h-4.5 text-brand-gold" />
              <span>List Property & Uploads</span>
            </button>
          </div>

          {adminListings.length === 0 ? (
            <div className="bg-white border border-slate-150 rounded-2xl py-24 text-center text-sm font-semibold text-brand-text-muted italic shadow-sm">
              No inventory listings created yet. Click "List Property & Uploads" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminListings.map((listing) => (
                <div key={listing._id} className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left">
                  <div>
                    {/* Image Thumbnail banner */}
                    <div className="h-44 bg-brand-navy relative flex flex-col justify-between p-4 text-white overflow-hidden">
                      {listing.images && listing.images[0] ? (
                        <>
                          <img
                            src={listing.images[0]}
                            alt={listing.propertyAddress}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-slate-900 z-0" />
                      )}
                      
                      <div className="flex justify-between items-center w-full z-10">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${listing.status === 'active' ? 'bg-emerald-550 bg-emerald-600' : 'bg-amber-600'}`}>
                          {listing.status}
                        </span>
                        <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full">
                          {listing.images?.length || 0} Photos
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm z-10 drop-shadow">{listing.propertyAddress}</h3>
                    </div>

                    {/* Listing Parameters */}
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-text-muted">Asking Price</span>
                        <span className="text-sm font-extrabold text-brand-navy">{formatCurrency(listing.askingPrice)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] font-bold text-brand-navy">
                        <div className="border-r border-slate-200">
                          <span className="block text-brand-text-muted text-[8px] uppercase">Bedrooms</span>
                          <span>{listing.property?.bedrooms || 'N/A'} Beds</span>
                        </div>
                        <div className="border-r border-slate-200">
                          <span className="block text-brand-text-muted text-[8px] uppercase">Bathrooms</span>
                          <span>{listing.property?.bathrooms || 'N/A'} Baths</span>
                        </div>
                        <div>
                          <span className="block text-brand-text-muted text-[8px] uppercase">Area</span>
                          <span>{listing.property?.squareFootage || 'N/A'} SqFt</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons footer */}
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <button
                      onClick={() => handleToggleWebDisplay(listing._id, listing.webDisplay)}
                      className={`flex items-center space-x-1 text-xs font-bold px-3 py-2 rounded-lg transition-colors border ${listing.webDisplay ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                      title={listing.webDisplay ? "Visible on Public Web Site" : "Hidden from Public Web Site"}
                    >
                      {listing.webDisplay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{listing.webDisplay ? 'Public View' : 'Hidden'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteListing(listing._id, listing.propertyId, listing.images)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors border border-rose-150 outline-none"
                      title="Delete Listing"
                    >
                      <Trash className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeal(null)}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 font-sans text-left"
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

      {/* 3. ADD DEAL MANUALLY MODAL */}
      <AnimatePresence>
        {showAddDealModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDealModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-lg w-full relative z-10 border border-slate-100 flex flex-col text-left font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-brand-navy text-base flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-brand-gold" />
                  <span>Manual Ingestion: New Client Deal</span>
                </h3>
                <button
                  onClick={() => setShowAddDealModal(false)}
                  className="text-slate-400 hover:text-slate-600 outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDealSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">First Name *</label>
                    <input
                      type="text"
                      required
                      value={dealForm.firstName}
                      onChange={(e) => setDealForm({ ...dealForm, firstName: e.target.value })}
                      placeholder="Angad"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Last Name</label>
                    <input
                      type="text"
                      value={dealForm.lastName}
                      onChange={(e) => setDealForm({ ...dealForm, lastName: e.target.value })}
                      placeholder="Parab"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={dealForm.phone}
                      onChange={(e) => setDealForm({ ...dealForm, phone: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Email Address</label>
                    <input
                      type="email"
                      placeholder="angad@example.com"
                      value={dealForm.email}
                      onChange={(e) => setDealForm({ ...dealForm, email: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Pipeline Type</label>
                    <select
                      value={dealForm.pipelineType}
                      onChange={(e) => setDealForm({ ...dealForm, pipelineType: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-brand-navy"
                    >
                      <option value="buyer">Buyer (Inquiry)</option>
                      <option value="seller">Seller (Listing Property)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Region Interest</label>
                    <select
                      value={dealForm.preferredZones}
                      onChange={(e) => setDealForm({ ...dealForm, preferredZones: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-brand-navy"
                    >
                      {locations.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Min Budget (INR)</label>
                    <input
                      type="number"
                      placeholder="5000000"
                      value={dealForm.budgetMin}
                      onChange={(e) => setDealForm({ ...dealForm, budgetMin: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Max Budget (INR)</label>
                    <input
                      type="number"
                      placeholder="10000000"
                      value={dealForm.budgetMax}
                      onChange={(e) => setDealForm({ ...dealForm, budgetMax: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Bedrooms</label>
                    <input
                      type="number"
                      value={dealForm.preferredBedrooms}
                      onChange={(e) => setDealForm({ ...dealForm, preferredBedrooms: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-navy">Lead Route (Agent)</label>
                  <select
                    value={dealForm.assignedAgentId}
                    onChange={(e) => setDealForm({ ...dealForm, assignedAgentId: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-brand-navy"
                  >
                    <option value="">Broker Escalation Queue (Automatic)</option>
                    {agents.map(a => (
                      <option key={a._id} value={a._id}>{a.fullName} ({a.role})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-navy">Notes & Requirements</label>
                  <textarea
                    rows="2.5"
                    value={dealForm.notes}
                    onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
                    placeholder="Enter special features and notes client is looking for..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFormSubmitting}
                  className="w-full bg-brand-navy text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-sm text-xs disabled:opacity-50"
                >
                  {isFormSubmitting ? 'Saving Client Deal...' : 'Log Client & Assign Agent'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MANUAL LIST PROPERTY MODAL */}
      <AnimatePresence>
        {showAddListingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddListingModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-xl w-full relative z-10 border border-slate-100 flex flex-col text-left font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-brand-navy text-base flex items-center space-x-2">
                  <Image className="w-5 h-5 text-brand-gold" />
                  <span>Inventory Ops: List Villa / Plot</span>
                </h3>
                <button
                  onClick={() => setShowAddListingModal(false)}
                  className="text-slate-400 hover:text-slate-600 outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddListingSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-navy">Property Address / Title *</label>
                  <input
                    type="text"
                    required
                    value={listingForm.address}
                    onChange={(e) => setListingForm({ ...listingForm, address: e.target.value })}
                    placeholder="Grace Villas, Phase 2"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">District Region</label>
                    <select
                      value={listingForm.city}
                      onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-brand-navy"
                    >
                      {locations.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Asset Class</label>
                    <select
                      value={listingForm.assetClass}
                      onChange={(e) => setListingForm({ ...listingForm, assetClass: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-brand-navy"
                    >
                      {assetClasses.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Beds count</label>
                    <input
                      type="number"
                      value={listingForm.bedrooms}
                      onChange={(e) => setListingForm({ ...listingForm, bedrooms: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Baths count</label>
                    <input
                      type="number"
                      value={listingForm.bathrooms}
                      onChange={(e) => setListingForm({ ...listingForm, bathrooms: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Area (Sq.Ft)</label>
                    <input
                      type="number"
                      value={listingForm.squareFootage}
                      onChange={(e) => setListingForm({ ...listingForm, squareFootage: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Asking Price (INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="9500000"
                      value={listingForm.askingPrice}
                      onChange={(e) => setListingForm({ ...listingForm, askingPrice: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-navy">Amenities (comma-split)</label>
                    <input
                      type="text"
                      value={listingForm.amenities}
                      onChange={(e) => setListingForm({ ...listingForm, amenities: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                </div>

                {/* File Upload Selector */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center space-y-2">
                  <UploadCloud className="w-6 h-6 text-brand-navy mx-auto" />
                  <span className="block text-xs font-bold text-brand-navy">Select Property Photos</span>
                  <p className="text-[9px] text-brand-text-muted">Supports multiple files. Uploaded to public storage folder.</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedPropertyFiles(e.target.files)}
                    className="mx-auto text-xs"
                  />
                  {selectedPropertyFiles.length > 0 && (
                    <span className="block text-[10px] font-bold text-emerald-600 font-mono">
                      {selectedPropertyFiles.length} images selected
                    </span>
                  )}
                </div>

                {uploadProgressText && (
                  <div className="text-[10px] font-bold text-brand-goldDark flex items-center space-x-2 animate-pulse justify-center">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{uploadProgressText}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-navy">Description Details</label>
                  <textarea
                    rows="2.5"
                    value={listingForm.description}
                    onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                    placeholder="Enter property descriptions, special locations, security specifications..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFormSubmitting}
                  className="w-full bg-brand-navy text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-sm text-xs disabled:opacity-50"
                >
                  {isFormSubmitting ? 'Processing Uploads & Saving...' : 'List Property on Public Directory'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
