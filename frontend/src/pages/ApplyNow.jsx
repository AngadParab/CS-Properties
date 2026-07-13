import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Landmark, Briefcase, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { submitLead } from '../services/api';

function ApplyNow() {
  const query = new URLSearchParams(useLocation().search);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      selectedLoan = 'Mortgage Loan';
    }
    if (vehicleParam) {
      notesText += `Interested in vehicle: ${vehicleParam}. `;
      selectedLoan = 'Personal Loan';
    }
    if (loanParam) {
      if (loanParam === 'mortgage') selectedLoan = 'Mortgage Loan';
      if (loanParam === 'personal') selectedLoan = 'Personal Loan';
      if (loanParam === 'business') selectedLoan = 'Business Loan';
      if (loanParam === 'lap') selectedLoan = 'Loan Against Property';
    }

    setFormData((prev) => ({
      ...prev,
      amount: amountParam || prev.amount,
      tenureYears: tenureParam || prev.tenureYears,
      loanType: selectedLoan,
      notes: notesText || prev.notes,
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
      if (!formData.location.trim()) stepErrors.location = 'Goa Location is required.';
    } else if (step === 2) {
      if (!formData.amount || Number(formData.amount) <= 0) {
        stepErrors.amount = 'Please enter a valid positive loan amount.';
      }
    } else if (step === 3) {
      if (!formData.monthlyIncome || Number(formData.monthlyIncome) <= 0) {
        stepErrors.monthlyIncome = 'Monthly income is required.';
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
      await submitLead(formData);
      setIsSuccess(true);
    } catch (error) {
      setErrors({ apiError: error.message || 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step names & icons
  const stepsList = [
    { number: 1, label: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { number: 2, label: 'Loan Specs', icon: <Landmark className="w-5 h-5" /> },
    { number: 3, label: 'Financials', icon: <Briefcase className="w-5 h-5" /> },
    { number: 4, label: 'Review', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-brand-navy">Apply for Direct Loan</h1>
        <p className="text-brand-text-muted text-sm max-w-md mx-auto">
          Complete our 4-step digital onboarding form. No application fee. No commission charges.
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
            <h2 className="text-2xl font-bold text-brand-navy">Application Received!</h2>
            <p className="text-xs text-brand-text-muted leading-relaxed">
              Your inquiry has been successfully logged. Our Goa branch advisors are running initial checks with our bank network and will reach out within 24 hours.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setIsSuccess(false);
              }}
              className="bg-brand-navy text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
            >
              Apply for another Loan
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
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Applicant Contact Information</h3>
                
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Goa Residence Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Margao, Panaji"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.location ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.location && <span className="text-[10px] text-brand-error font-semibold">{errors.location}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Loan Specs */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Loan Selection & Requirements</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Select Loan Category</label>
                    <select
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="Business Loan">Business Loan</option>
                      <option value="Mortgage Loan">Mortgage/Home Loan</option>
                      <option value="Loan Against Property">Loan Against Property (LAP)</option>
                      <option value="Personal Loan">Personal Loan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Required Loan Amount (INR) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="e.g. 1500000"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.amount ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.amount && <span className="text-[10px] text-brand-error font-semibold">{errors.amount}</span>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy">Preferred Tenure (Years)</label>
                  <select
                    name="tenureYears"
                    value={formData.tenureYears}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    {[1, 3, 5, 7, 10, 15, 20, 25, 30].map((yr) => (
                      <option key={yr} value={yr}>{yr} Years</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: Financials */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Employment & Monthly Cashflows</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Employment Status</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="Salaried">Salaried Professional</option>
                      <option value="Self-Employed">Self-Employed Merchant</option>
                      <option value="Business Owner">Company Director / Business</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Net Monthly Income (INR) *</label>
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 outline-none bg-white ${
                        errors.monthlyIncome ? 'border-brand-error focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.monthlyIncome && <span className="text-[10px] text-brand-error font-semibold">{errors.monthlyIncome}</span>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy">Current Active Monthly EMIs (If any)</label>
                  <input
                    type="number"
                    name="existingEmis"
                    value={formData.existingEmis}
                    onChange={handleChange}
                    placeholder="Enter total monthly obligations"
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Review Details */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-slate-50 pb-2">Final Review</h3>
                
                <div className="bg-slate-50 p-5 rounded-xl text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Applicant Name</span>
                    <span className="font-bold text-brand-navy">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-bold text-brand-navy">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Goa Location</span>
                    <span className="font-bold text-brand-navy">{formData.location}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Requested Loan</span>
                    <span className="font-bold text-brand-navy">{formData.loanType}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Requested Amount</span>
                    <span className="font-bold text-brand-navy">₹{Number(formData.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Loan Tenure</span>
                    <span className="font-bold text-brand-navy">{formData.tenureYears} Years</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Employment Type</span>
                    <span className="font-bold text-brand-navy">{formData.employmentType}</span>
                  </div>
                  <div>
                    <span className="block text-brand-text-muted text-[10px] uppercase font-bold">Monthly Income</span>
                    <span className="font-bold text-brand-navy">₹{Number(formData.monthlyIncome).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy">Additional Details (Optional)</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter property details, target bank preferences or special conditions..."
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  ></textarea>
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
                  className="bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold px-6 py-2.5 rounded-lg text-xs transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
