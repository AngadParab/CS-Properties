import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Landmark, FileText, CheckCircle2, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { submitLead } from '../services/api';

function ApplyNow() {
  const query = new URLSearchParams(useLocation().search);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyName: '',
    propertyLocation: 'Panaji',
    propertyType: 'Villa',
    propertyPrice: '',
    preferredDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill from URL params
  useEffect(() => {
    const propName = query.get('propertyName');
    const propLoc = query.get('propertyLocation');
    const propPrice = query.get('propertyPrice');
    const typeParam = query.get('type');
    const locationParam = query.get('location');
    const budgetParam = query.get('budget');

    setFormData((prev) => ({
      ...prev,
      propertyName: propName || prev.propertyName || '',
      propertyLocation: propLoc || locationParam || prev.propertyLocation,
      propertyPrice: propPrice || (budgetParam ? String(parseFloat(budgetParam) * 10000000) : prev.propertyPrice),
      propertyType: typeParam || prev.propertyType,
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep = () => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) stepErrors.fullName = 'Full Name is required.';
      if (!formData.phone.trim()) {
        stepErrors.phone = 'Phone number is required.';
      } else if (!/^\d{10}$/.test(formData.phone.trim())) {
        stepErrors.phone = 'Please enter a valid 10-digit phone number.';
      }
    } else if (step === 2) {
      if (!formData.propertyName.trim()) stepErrors.propertyName = 'Property/Listing Name is required.';
      if (!formData.propertyLocation.trim()) stepErrors.propertyLocation = 'Location is required.';
      if (!formData.propertyPrice || Number(formData.propertyPrice) <= 0) {
        stepErrors.propertyPrice = 'Please enter a valid estimated budget or price.';
      }
    } else if (step === 3) {
      if (!formData.preferredDate) {
        stepErrors.preferredDate = 'Please select a preferred date for site visit / office consultation.';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        location: formData.propertyLocation,
        loanType: formData.propertyType,
        amount: Number(formData.propertyPrice),
        tenureYears: 1,
        employmentType: 'Salaried',
        monthlyIncome: 0,
        notes: `[Property: ${formData.propertyName}] [Preferred Visit Date: ${formData.preferredDate}] ${formData.notes}`
      };
      
      await submitLead(payload);
      setIsSuccess(true);
    } catch (error) {
      setErrors({ apiError: error.message || 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step names & icons
  const stepsList = [
    { number: 1, label: 'Contact Details', icon: <User className="w-5 h-5" /> },
    { number: 2, label: 'Property Prefs', icon: <Landmark className="w-5 h-5" /> },
    { number: 3, label: 'Schedule Review', icon: <FileText className="w-5 h-5" /> },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-brand-navy">Property Inquiry & Consultation</h1>
        <p className="text-brand-text-muted text-sm max-w-md mx-auto">
          Complete our 3-step property inquiry wizard. We process documents directly with 0% brokerage commission.
        </p>
      </div>

      {/* Steps Indicator Progress Bar */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 sm:p-6 shadow-sm flex justify-between items-center relative overflow-hidden">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block mx-12"></div>
        {/* Active Line Progress overlay */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-brand-gold -translate-y-1/2 z-0 hidden sm:block mx-12 transition-all duration-300"
          style={{ width: `${((step - 1) / (stepsList.length - 1)) * 80}%` }}
        ></div>

        {stepsList.map((s) => (
          <div key={s.number} className="relative z-10 flex flex-col items-center space-y-2 text-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                step === s.number
                  ? 'bg-brand-navy border-brand-navy text-brand-gold font-bold ring-4 ring-blue-50'
                  : step > s.number
                  ? 'bg-brand-navy border-brand-navy text-white'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {s.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
              step === s.number ? 'text-brand-navy' : 'text-brand-text-muted'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        
        {isSuccess ? (
          <div className="text-center py-10 space-y-6 max-w-md mx-auto">
            <CheckCircle2 className="w-16 h-16 text-brand-success mx-auto" />
            <h2 className="text-2xl font-bold text-brand-navy">Inquiry Registered!</h2>
            <p className="text-xs text-brand-text-muted leading-relaxed">
              Your inquiry has been successfully registered on Firestore. Our property consultants will verify documentation papers and contact you within 24 hours to schedule the site visit.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setIsSuccess(false);
                setFormData({
                  fullName: '',
                  phone: '',
                  email: '',
                  propertyName: '',
                  propertyLocation: 'Panaji',
                  propertyType: 'Villa',
                  propertyPrice: '',
                  preferredDate: '',
                  notes: '',
                });
              }}
              className="bg-brand-navy text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
            >
              Inquire Another Property
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.apiError && (
              <div className="text-xs text-brand-error font-semibold bg-red-50 p-3.5 rounded-lg border border-red-100">
                {errors.apiError}
              </div>
            )}
            
            {/* STEP 1: Contact Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Contact Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Angad Parab"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.fullName ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.fullName && <span className="text-[10px] text-brand-error font-semibold">{errors.fullName}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.phone ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.phone && <span className="text-[10px] text-brand-error font-semibold">{errors.phone}</span>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. angad@example.com"
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Property Preferences */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Property Preferences</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Property / Listing Name *</label>
                    <input
                      type="text"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      placeholder="e.g. Sea Breeze Apartments, or General Search"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.propertyName ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.propertyName && <span className="text-[10px] text-brand-error font-semibold">{errors.propertyName}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Select Property Location *</label>
                    <select
                      name="propertyLocation"
                      value={formData.propertyLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-semibold text-brand-navy"
                    >
                      <option value="Panaji">Panaji</option>
                      <option value="Margao">Margao</option>
                      <option value="Calangute">Calangute</option>
                      <option value="Candolim">Candolim</option>
                      <option value="Mapusa">Mapusa</option>
                      <option value="Vasco">Vasco</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Property Category</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-semibold text-brand-navy"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Luxury Villa</option>
                      <option value="Plot">Residential Plot</option>
                      <option value="Commercial">Commercial Office/Shop</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Budget / Price Range (INR) *</label>
                    <input
                      type="number"
                      name="propertyPrice"
                      value={formData.propertyPrice}
                      onChange={handleChange}
                      placeholder="e.g. 15000000 (1.5 Cr)"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.propertyPrice ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.propertyPrice && <span className="text-[10px] text-brand-error font-semibold">{errors.propertyPrice}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Schedule Visit */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Review & Schedule</h3>
                
                <div className="bg-slate-50 p-5 rounded-xl text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Client Name</span>
                    <span className="font-bold text-brand-navy">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Contact Phone</span>
                    <span className="font-bold text-brand-navy">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Target Location</span>
                    <span className="font-bold text-brand-navy">{formData.propertyLocation}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Listing Name</span>
                    <span className="font-bold text-brand-navy">{formData.propertyName}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Category</span>
                    <span className="font-bold text-brand-navy">{formData.propertyType}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Estimated Budget</span>
                    <span className="font-bold text-brand-navy">{formatCurrency(formData.propertyPrice)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Preferred Site Visit Date *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-brand-gold absolute left-3 top-3.5" />
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                          errors.preferredDate ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {errors.preferredDate && <span className="text-[10px] text-brand-error font-semibold">{errors.preferredDate}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Additional Details (Optional)</label>
                    <textarea
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Specify preferred hours, parking needs, or other questions..."
                      className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-brand-navy hover:bg-slate-50 transition-colors flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < stepsList.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-brand-navy text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors flex items-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold px-6 py-2.5 rounded-lg text-xs transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Property Inquiry'}
                </button>
              )}
            </div>

          </form>
        )}
      </div>

    </div>
  );
}

export default ApplyNow;
