import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Landmark, Briefcase, FileText, CheckCircle2, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { submitLead } from '../services/api';
import { useCurrencyInput } from '../hooks/useCurrencyInput';

function ApplyNow() {
  const query = new URLSearchParams(useLocation().search);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '', // Goa Residence Location
    loanType: 'Business Loan',
    amount: '',
    tenureYears: '5',
    employmentType: 'Salaried',
    monthlyIncome: '',
    existingEmis: '0',
    preferredDate: '', // For property visits
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Field validation function to provide real-time validation cues
  const validateField = (name, value) => {
    let errorMsg = '';
    const val = value !== undefined ? value : formData[name];

    if (name === 'fullName') {
      if (!val.trim()) errorMsg = 'Full Name is required.';
    } else if (name === 'phone') {
      if (!val.trim()) {
        errorMsg = 'Mobile number is required.';
      } else if (!/^\d{10}$/.test(val.trim())) {
        errorMsg = 'Please enter a valid 10-digit mobile number.';
      }
    } else if (name === 'location') {
      if (!val.trim()) errorMsg = 'Goa Location is required.';
    } else if (name === 'amount') {
      if (!val || Number(val) <= 0) {
        errorMsg = formData.loanType === 'Property Inquiry' 
          ? 'Please enter a valid estimated budget.' 
          : 'Please enter a valid positive loan amount.';
      }
    } else if (name === 'preferredDate') {
      if (formData.loanType === 'Property Inquiry' && !val) {
        errorMsg = 'Please select a preferred site visit date.';
      }
    } else if (name === 'monthlyIncome') {
      if (formData.loanType !== 'Property Inquiry' && (!val || Number(val) <= 0)) {
        errorMsg = 'Net monthly income is required.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    return !errorMsg;
  };

  // Instantiating the real-time custom regex formatting hooks
  const amountInput = useCurrencyInput(formData.amount, (val) => {
    setFormData((prev) => ({ ...prev, amount: val }));
    validateField('amount', val);
  });

  const monthlyIncomeInput = useCurrencyInput(formData.monthlyIncome, (val) => {
    setFormData((prev) => ({ ...prev, monthlyIncome: val }));
    validateField('monthlyIncome', val);
  });

  const existingEmisInput = useCurrencyInput(formData.existingEmis, (val) => {
    setFormData((prev) => ({ ...prev, existingEmis: val }));
    validateField('existingEmis', val);
  });

  // Pre-fill from URL params
  useEffect(() => {
    const amountParam = query.get('amount');
    const tenureParam = query.get('tenure');
    const propertyParam = query.get('property');
    const vehicleParam = query.get('vehicle');
    const loanParam = query.get('loan');

    let notesText = '';
    let selectedLoan = formData.loanType;

    if (propertyParam) {
      notesText += `Interested in property: ${propertyParam}. `;
      selectedLoan = 'Property Inquiry';
    }
    if (vehicleParam) {
      notesText += `Interested in vehicle: ${vehicleParam}. `;
      selectedLoan = 'Vehicle Loan';
    }
    if (loanParam) {
      if (loanParam === 'mortgage') selectedLoan = 'Mortgage Loan';
      if (loanParam === 'personal') selectedLoan = 'Personal Loan';
      if (loanParam === 'business') selectedLoan = 'Business Loan';
      if (loanParam === 'lap') selectedLoan = 'Loan Against Property';
      if (loanParam === 'vehicle') selectedLoan = 'Vehicle Loan';
      if (loanParam === 'property') selectedLoan = 'Property Inquiry';
    }

    const initialAmount = amountParam || formData.amount;
    const initialIncome = formData.monthlyIncome;
    const initialEmis = formData.existingEmis;

    setFormData((prev) => ({
      ...prev,
      amount: initialAmount,
      tenureYears: tenureParam || prev.tenureYears,
      loanType: selectedLoan,
      notes: notesText || prev.notes,
    }));

    // Update currency hook visual values as well
    if (initialAmount) amountInput.setValue(initialAmount);
    if (initialIncome) monthlyIncomeInput.setValue(initialIncome);
    if (initialEmis) existingEmisInput.setValue(initialEmis);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateStep = () => {
    let isValid = true;
    if (step === 1) {
      isValid = validateField('fullName') && isValid;
      isValid = validateField('phone') && isValid;
      isValid = validateField('location') && isValid;
    } else if (step === 2) {
      isValid = validateField('amount') && isValid;
      if (formData.loanType === 'Property Inquiry') {
        isValid = validateField('preferredDate') && isValid;
      }
    } else if (step === 3) {
      if (formData.loanType !== 'Property Inquiry') {
        isValid = validateField('monthlyIncome') && isValid;
      }
    }
    return isValid;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 2 && formData.loanType === 'Property Inquiry') {
        setStep(4);
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (step === 4 && formData.loanType === 'Property Inquiry') {
      setStep(2);
    } else {
      setStep((prev) => prev - 1);
    }
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
        location: formData.location,
        loanType: formData.loanType,
        amount: Number(formData.amount),
        tenureYears: formData.loanType === 'Property Inquiry' ? 1 : Number(formData.tenureYears),
        employmentType: formData.loanType === 'Property Inquiry' ? 'Salaried' : formData.employmentType,
        monthlyIncome: formData.loanType === 'Property Inquiry' ? 0 : Number(formData.monthlyIncome),
        existingEmis: formData.loanType === 'Property Inquiry' ? 0 : Number(formData.existingEmis || 0),
        notes: formData.loanType === 'Property Inquiry' && formData.preferredDate
          ? `[Preferred Site Visit Date: ${formData.preferredDate}] ${formData.notes}`
          : formData.notes,
      };
      
      await submitLead(payload);
      setIsSuccess(true);
    } catch (error) {
      setErrors({ apiError: error.message || 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step names & icons
  const stepsList = formData.loanType === 'Property Inquiry'
    ? [
        { number: 1, label: 'Personal Info', icon: <User className="w-5 h-5" /> },
        { number: 2, label: 'Property Specs', icon: <Landmark className="w-5 h-5" /> },
        { number: 4, label: 'Review Details', icon: <FileText className="w-5 h-5" /> },
      ]
    : [
        { number: 1, label: 'Personal Info', icon: <User className="w-5 h-5" /> },
        { number: 2, label: 'Loan Specs', icon: <Landmark className="w-5 h-5" /> },
        { number: 3, label: 'Financials', icon: <Briefcase className="w-5 h-5" /> },
        { number: 4, label: 'Review Details', icon: <FileText className="w-5 h-5" /> },
      ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <Helmet>
        <title>Apply for Property Inquiry & Auto/Business Finance | CS Properties</title>
        <meta name="description" content="Get professional advice and instant eligibility checks for loans and property inquiries in Goa. Standardized forms, zero commission." />
      </Helmet>
      
      {/* Title Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-brand-navy">Apply Now</h1>
        <p className="text-brand-text-muted text-sm max-w-md mx-auto">
          Complete our digital onboarding form. No application fee. No commission charges.
        </p>
      </header>

      {/* Steps Indicator Progress Bar */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 sm:p-6 shadow-sm flex justify-between items-center relative overflow-hidden">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block mx-12"></div>
        {/* Active Line Progress overlay */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-brand-gold -translate-y-1/2 z-0 hidden sm:block mx-12 transition-all duration-300"
          style={{ width: `${formData.loanType === 'Property Inquiry' 
            ? ((step === 4 ? 2 : step - 1) / 2) * 80 
            : ((step - 1) / 3) * 80}%` }}
        ></div>

        {stepsList.map((s) => {
          const stepNum = s.number;
          const displayNum = stepNum === 4 && formData.loanType === 'Property Inquiry' ? 3 : (stepNum === 4 ? 4 : stepNum);
          
          return (
            <div key={stepNum} className="relative z-10 flex flex-col items-center space-y-2 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  step === stepNum
                    ? 'bg-brand-navy border-brand-navy text-brand-gold font-bold ring-4 ring-blue-50'
                    : step > stepNum || (stepNum === 4 && step === 4)
                    ? 'bg-brand-navy border-brand-navy text-white'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                step === stepNum ? 'text-brand-navy' : 'text-brand-text-muted'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        
        {isSuccess ? (
          <div className="text-center py-10 space-y-6 max-w-md mx-auto">
            <CheckCircle2 className="w-16 h-16 text-brand-success mx-auto" />
            <h2 className="text-2xl font-bold text-brand-navy">Application Received!</h2>
            <p className="text-xs text-brand-text-muted leading-relaxed">
              Your submission has been successfully logged on Firestore. Our advisors will run audits and contact you within 24 hours.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setIsSuccess(false);
                setFormData({
                  fullName: '',
                  phone: '',
                  email: '',
                  location: '',
                  loanType: 'Business Loan',
                  amount: '',
                  tenureYears: '5',
                  employmentType: 'Salaried',
                  monthlyIncome: '',
                  existingEmis: '0',
                  preferredDate: '',
                  notes: '',
                });
              }}
              className="bg-brand-navy text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.apiError && (
              <div className="text-xs text-brand-error font-semibold bg-red-50 p-3.5 rounded-lg border border-red-100">
                {errors.apiError}
              </div>
            )}
            
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Contact Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="text-xs font-bold text-brand-navy">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() => validateField('fullName')}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                        errors.fullName ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                      }`}
                    />
                    {errors.fullName && <span className="text-[10px] text-brand-error font-semibold">{errors.fullName}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-brand-navy">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => validateField('phone')}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                        errors.phone ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                      }`}
                    />
                    {errors.phone && <span className="text-[10px] text-brand-error font-semibold">{errors.phone}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-brand-navy">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="location" className="text-xs font-bold text-brand-navy">Goa Residence Location *</label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={() => validateField('location')}
                      placeholder="e.g. Margao, Panaji"
                      className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                        errors.location ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                      }`}
                    />
                    {errors.location && <span className="text-[10px] text-brand-error font-semibold">{errors.location}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Requirements */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Requirement Specifications</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="loanType" className="text-xs font-bold text-brand-navy">Select Category</label>
                    <select
                      name="loanType"
                      id="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white font-semibold text-brand-navy focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                    >
                      <option value="Property Inquiry">Property Purchase Inquiry</option>
                      <option value="Business Loan">Business Loan</option>
                      <option value="Mortgage Loan">Mortgage/Home Loan</option>
                      <option value="Loan Against Property">Loan Against Property (LAP)</option>
                      <option value="Personal Loan">Personal Loan</option>
                      <option value="Vehicle Loan">Vehicle Loan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="amount" className="text-xs font-bold text-brand-navy">
                      {formData.loanType === 'Property Inquiry' ? 'Estimated Budget / Price *' : 'Required Loan Amount (INR) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2 text-sm font-bold text-brand-navy">₹</span>
                      <input
                        type="text"
                        name="amount"
                        id="amount"
                        value={amountInput.value}
                        onChange={amountInput.onChange}
                        onBlur={() => validateField('amount')}
                        placeholder={formData.loanType === 'Property Inquiry' ? 'e.g. 1,50,00,000' : 'e.g. 25,00,000'}
                        className={`w-full pl-8 pr-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.amount ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.amount && <span className="text-[10px] text-brand-error font-semibold">{errors.amount}</span>}
                  </div>
                </div>

                {formData.loanType === 'Property Inquiry' ? (
                  <div className="space-y-1.5">
                    <label htmlFor="preferredDate" className="text-xs font-bold text-brand-navy">Preferred Site Visit Date *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-brand-gold absolute left-3 top-3.5" />
                      <input
                        type="date"
                        name="preferredDate"
                        id="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        onBlur={() => validateField('preferredDate')}
                        className={`w-full pl-9 pr-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.preferredDate ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.preferredDate && <span className="text-[10px] text-brand-error font-semibold">{errors.preferredDate}</span>}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label htmlFor="tenureYears" className="text-xs font-bold text-brand-navy">Preferred Tenure (Years)</label>
                    <select
                      name="tenureYears"
                      id="tenureYears"
                      value={formData.tenureYears}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white font-semibold text-brand-navy focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                    >
                      {[1, 3, 5, 7, 10, 15, 20, 25, 30].map((yr) => (
                        <option key={yr} value={yr}>{yr} Years</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Financial Profile (Only visible if not property inquiry) */}
            {step === 3 && formData.loanType !== 'Property Inquiry' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Employment & Monthly Cashflows</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="employmentType" className="text-xs font-bold text-brand-navy">Employment Status</label>
                    <select
                      name="employmentType"
                      id="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white font-semibold text-brand-navy focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                    >
                      <option value="Salaried">Salaried Professional</option>
                      <option value="Self-Employed">Self-Employed Merchant</option>
                      <option value="Business Owner">Company Director / Business</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="monthlyIncome" className="text-xs font-bold text-brand-navy">Net Monthly Income (INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2 text-sm font-bold text-brand-navy">₹</span>
                      <input
                        type="text"
                        name="monthlyIncome"
                        id="monthlyIncome"
                        value={monthlyIncomeInput.value}
                        onChange={monthlyIncomeInput.onChange}
                        onBlur={() => validateField('monthlyIncome')}
                        placeholder="e.g. 60,000"
                        className={`w-full pl-8 pr-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.monthlyIncome ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.monthlyIncome && <span className="text-[10px] text-brand-error font-semibold">{errors.monthlyIncome}</span>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="existingEmis" className="text-xs font-bold text-brand-navy">Current Active Monthly EMIs (If any)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-sm font-bold text-brand-navy">₹</span>
                    <input
                      type="text"
                      name="existingEmis"
                      id="existingEmis"
                      value={existingEmisInput.value}
                      onChange={existingEmisInput.onChange}
                      onBlur={() => validateField('existingEmis')}
                      placeholder="Enter total monthly obligations"
                      className="w-full pl-8 pr-4 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review Details */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Final Review</h3>
                
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
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Location</span>
                    <span className="font-bold text-brand-navy">{formData.location}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Inquiry Type</span>
                    <span className="font-bold text-brand-navy">{formData.loanType}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">
                      {formData.loanType === 'Property Inquiry' ? 'Estimated Budget' : 'Loan Amount'}
                    </span>
                    <span className="font-bold text-brand-navy">{formatCurrency(formData.amount)}</span>
                  </div>
                  {formData.loanType === 'Property Inquiry' ? (
                    <div>
                      <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Preferred Visit Date</span>
                      <span className="font-bold text-brand-navy">{formData.preferredDate}</span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Tenure Preferred</span>
                        <span className="font-bold text-brand-navy">{formData.tenureYears} Years</span>
                      </div>
                      <div>
                        <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Employment</span>
                        <span className="font-bold text-brand-navy">{formData.employmentType}</span>
                      </div>
                      <div>
                        <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Monthly Income</span>
                        <span className="font-bold text-brand-navy">{formatCurrency(formData.monthlyIncome)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-xs font-bold text-brand-navy">Additional Details (Optional)</label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Provide property details, vehicle descriptions or target loan parameters..."
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-row gap-4 justify-between items-center pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 sm:flex-initial px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-brand-navy hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : null}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 sm:flex-initial bg-brand-navy text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold px-6 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>

          </form>
        )}
      </div>

    </main>
  );
}

export default ApplyNow;
