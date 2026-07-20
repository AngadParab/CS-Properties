import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Building, CheckCircle2, ChevronRight, ChevronLeft, Calendar, Loader2 } from 'lucide-react';
import { submitInquiry } from '../services/api';
import { useCurrencyInput } from '../hooks/useCurrencyInput';

// Zod schema definition for real estate site visit & property inquiry
const applyFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full Name is required.'),
  phone: z.string().trim().min(1, 'Mobile number is required.').regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  email: z.string().trim().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address.'),
  location: z.string().trim().min(1, 'District location is required.'),
  assetClass: z.string().default('Residential Real Estate (Living spaces)'),
  amount: z.string().trim().min(1, 'Target budget is required.').refine((val) => {
    const raw = Number(val.replace(/[^0-9]/g, ''));
    return !isNaN(raw) && raw > 0;
  }, 'Please enter a valid positive budget amount.'),
  preferredDate: z.string().trim().min(1, 'Please select a preferred site visit date.'),
  notes: z.string().optional(),
});

function ApplyNow() {
  const query = new URLSearchParams(useLocation().search);
  
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(applyFormSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      location: 'South Goa District',
      assetClass: 'Residential Real Estate (Living spaces)',
      amount: '',
      preferredDate: '',
      notes: '',
    }
  });

  const watchAssetClass = watch('assetClass');
  const watchAmount = watch('amount');
  const watchFullName = watch('fullName');
  const watchPhone = watch('phone');
  const watchLocation = watch('location');
  const watchPreferredDate = watch('preferredDate');

  // Currency input hook for Indian comma formatting
  const amountInput = useCurrencyInput(watchAmount, (val) => {
    setValue('amount', val, { shouldValidate: true });
  });

  // Pre-fill from URL params
  useEffect(() => {
    const propertyParam = query.get('property');
    const typeParam = query.get('type');
    const locationParam = query.get('location');

    let notesText = '';
    if (propertyParam) {
      notesText += `Interested in property: ${propertyParam}. `;
    }

    if (typeParam) setValue('assetClass', typeParam);
    if (locationParam) setValue('location', locationParam);
    if (notesText) setValue('notes', notesText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateCurrentStep = async () => {
    if (step === 1) {
      return await trigger(['fullName', 'phone', 'location']);
    } else if (step === 2) {
      return await trigger(['amount', 'preferredDate']);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');

    try {
      const rawAmount = Number(data.amount.replace(/[^0-9]/g, ''));

      const inquiryPayload = {
        name: data.fullName,
        phone: data.phone,
        email: data.email || '',
        location: data.location,
        type: data.assetClass,
        budget: rawAmount,
        preferredDate: data.preferredDate,
        message: data.notes || `Inquiry for ${data.assetClass} in ${data.location}`,
      };

      await submitInquiry(inquiryPayload);
      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message || 'Failed to submit property inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndicators = [
    { title: 'Contact Specs', icon: <User className="w-5.5 h-5.5" /> },
    { title: 'Property Preferences', icon: <Building className="w-5.5 h-5.5" /> },
    { title: 'Review & Schedule', icon: <CheckCircle2 className="w-5.5 h-5.5" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans selection:bg-brand-gold/30">
      <Helmet>
        <title>Schedule Property Visit & Advisory | CS Properties Goa</title>
        <meta name="description" content="Book a private site visit or consultation for verified luxury villas, coastal plots, and commercial spaces in Goa with CS Properties." />
      </Helmet>

      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Schedule <span className="font-light italic font-syne text-brand-goldDark">a Property Advisory & Site Visit</span>
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-brand-text-muted leading-relaxed">
          Submit your real estate requirements below. Our legal and property desk will schedule a guided site visit and title audit review.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white border border-brand-sandDark p-8 sm:p-12 rounded-[30px] shadow-sm text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">Property Inquiry Received!</h2>
            <p className="text-xs sm:text-sm text-brand-text-muted max-w-md mx-auto">
              Thank you, <strong className="text-brand-navy">{watchFullName}</strong>. Your inquiry for <strong>{watchAssetClass}</strong> in <strong>{watchLocation}</strong> has been logged. Our advisory team will contact you within 24 hours.
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/properties"
              className="bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-6 py-3 rounded-xl transition-colors text-xs"
            >
              Browse All Listings
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                reset();
              }}
              className="border border-brand-sandDark text-brand-navy hover:bg-brand-bg font-bold px-6 py-3 rounded-xl transition-colors text-xs"
            >
              New Inquiry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-brand-sandDark rounded-[30px] p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-2 border-b border-brand-sandDark pb-8">
            {stepIndicators.map((s, idx) => {
              const stepNum = idx + 1;
              const isCurrent = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent ? 'bg-brand-navy text-brand-gold shadow-md font-bold' :
                    isDone ? 'bg-brand-gold/20 text-brand-goldDark font-bold' :
                    'bg-brand-bg text-brand-text-muted border border-brand-sandDark'
                  }`}>
                    {s.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-wider uppercase hidden sm:block ${
                    isCurrent ? 'text-brand-navy' : 'text-brand-text-muted'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-brand-error font-bold">
                {apiError}
              </div>
            )}

            {/* STEP 1: CONTACT DETAILS */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark ${
                      errors.fullName ? 'border-brand-error' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-[10px] text-brand-error font-semibold">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">10-Digit Mobile Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    maxLength={10}
                    {...register('phone')}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark ${
                      errors.phone ? 'border-brand-error' : 'border-slate-300'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-brand-error font-semibold">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Email Address (Optional)</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    placeholder="e.g. rahul@domain.com"
                    className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark ${
                      errors.email ? 'border-brand-error' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-brand-error font-semibold">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Preferred District *</label>
                  <select
                    id="location"
                    {...register('location')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark"
                  >
                    <option value="South Goa District">South Goa District</option>
                    <option value="North Goa District">North Goa District</option>
                    <option value="Kushawati District">Kushawati District</option>
                  </select>
                  {errors.location && <p className="text-[10px] text-brand-error font-semibold">{errors.location.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY PREFERENCES */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="assetClass" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Asset Class *</label>
                  <select
                    id="assetClass"
                    {...register('assetClass')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark"
                  >
                    <option value="Residential Real Estate (Living spaces)">Residential Real Estate (Living spaces)</option>
                    <option value="Commercial Real Estate (Business & income generation)">Commercial Real Estate (Business & income generation)</option>
                    <option value="Industrial Real Estate (Production, storage, logistics)">Industrial Real Estate (Production, storage, logistics)</option>
                    <option value="Land / Plots (Raw, subdivided, or agricultural)">Land / Plots (Raw, subdivided, or agricultural)</option>
                    <option value="Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)">Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Target Budget Range (₹) *</label>
                  <input
                    type="text"
                    id="amount"
                    value={amountInput.formattedValue}
                    onChange={amountInput.handleChange}
                    placeholder="e.g. 1,50,00,000"
                    className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark ${
                      errors.amount ? 'border-brand-error' : 'border-slate-300'
                    }`}
                  />
                  {errors.amount && <p className="text-[10px] text-brand-error font-semibold">{errors.amount.message}</p>}
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label htmlFor="preferredDate" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Preferred Site Visit Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-brand-goldDark absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      id="preferredDate"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('preferredDate')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark ${
                        errors.preferredDate ? 'border-brand-error' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.preferredDate && <p className="text-[10px] text-brand-error font-semibold">{errors.preferredDate.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & NOTES */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-brand-bg rounded-2xl p-6 border border-brand-sandDark grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div><strong className="text-brand-navy">Name:</strong> {watchFullName}</div>
                  <div><strong className="text-brand-navy">Phone:</strong> {watchPhone}</div>
                  <div><strong className="text-brand-navy">District:</strong> {watchLocation}</div>
                  <div><strong className="text-brand-navy">Asset Class:</strong> {watchAssetClass}</div>
                  <div><strong className="text-brand-navy">Target Budget:</strong> ₹{watchAmount}</div>
                  <div><strong className="text-brand-navy">Site Visit Date:</strong> {watchPreferredDate}</div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Specific Property Notes / Amenities</label>
                  <textarea
                    id="notes"
                    rows="3"
                    {...register('notes')}
                    placeholder="Specify preferred sea distance, BHK config, road width, or title deed requirements..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex flex-row justify-between items-center pt-6 border-t border-brand-sandDark">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors outline-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-1 text-xs outline-none"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-1 text-xs outline-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </span>
                  ) : (
                    <span>Submit Inquiry & Visit Request</span>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>
      )}
    </div>
  );
}

export default ApplyNow;
