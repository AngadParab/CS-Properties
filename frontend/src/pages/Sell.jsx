import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Building, DollarSign, Layers, FileText, CheckCircle2, ChevronRight, ChevronLeft, UploadCloud } from 'lucide-react';
import { submitPropertyListing } from '../services/api';

function Sell() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    sellerRole: 'Owner', // Owner / Broker
    propertyTitle: '',
    propertyType: 'Residential Real Estate (Living spaces)',
    location: 'South Goa District',
    sizeSqFt: '',
    expectedPrice: '',
    propertyCondition: 'Ready to Move',
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const locationsList = ['South Goa District', 'North Goa District', 'Kushawati District'];

  const validateStep = (currentStep) => {
    const tempErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required';
      if (!formData.phone.trim()) {
        tempErrors.phone = 'Phone number is required';
      } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone)) {
        tempErrors.phone = 'Enter a valid phone number';
      }
      if (!formData.email.trim()) {
        tempErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Enter a valid email address';
      }
    } else if (currentStep === 2) {
      if (!formData.propertyTitle.trim()) tempErrors.propertyTitle = 'Property title is required';
      if (!formData.sizeSqFt || Number(formData.sizeSqFt) <= 0) {
        tempErrors.sizeSqFt = 'Enter a valid size area';
      }
      if (!formData.expectedPrice || Number(formData.expectedPrice) <= 0) {
        tempErrors.expectedPrice = 'Enter a valid listing price';
      }
    } else if (currentStep === 3) {
      if (!formData.description.trim()) tempErrors.description = 'Provide a brief property description';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        sellerRole: formData.sellerRole,
        propertyTitle: formData.propertyTitle,
        propertyType: formData.propertyType,
        location: formData.location,
        sizeSqFt: Number(formData.sizeSqFt),
        expectedPrice: Number(formData.expectedPrice),
        propertyCondition: formData.propertyCondition,
        description: formData.description,
        notes: formData.notes,
      };

      await submitPropertyListing(payload);
      setIsSuccess(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to post property listing' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (val) => {
    if (!val) return '₹0';
    const num = Number(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Crores`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakhs`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Step Icons
  const stepIndicators = [
    { title: 'Contact Details', icon: <User className="w-5.5 h-5.5" /> },
    { title: 'Specs & Location', icon: <Building className="w-5.5 h-5.5" /> },
    { title: 'Details & Photos', icon: <FileText className="w-5.5 h-5.5" /> },
    { title: 'Review & Post', icon: <CheckCircle2 className="w-5.5 h-5.5" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans selection:bg-brand-gold/30">
      <Helmet>
        <title>List & Sell Property in Goa | CS Properties Real Estate Agency</title>
        <meta name="description" content="Sell your villa, apartment, or land plot in Goa with CS Properties. Direct buyer matching, legal title audits, and zero upfront fee." />
        <meta property="og:title" content="List & Sell Property in Goa | CS Properties" />
        <meta property="og:description" content="Sell your property in Goa with professional real estate advisors and legal verification." />
      </Helmet>
      
      {/* Title Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Sell your property <span className="font-light italic font-syne text-brand-goldDark">with the experts</span> in Goa
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-brand-text-muted leading-relaxed">
          Fill in your property specs below. Our valuation and legal teams will review the details to list your property on the main CS catalog.
        </p>
      </div>

      {/* Success View Screen */}
      {isSuccess ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border border-brand-sandDark p-8 sm:p-12 rounded-[30px] shadow-sm text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">Property Listing Submitted!</h2>
            <p className="text-xs sm:text-sm text-brand-text-muted max-w-md mx-auto">
              Thank you, {formData.fullName}. Your property **"{formData.propertyTitle}"** has been logged. Our Goa real estate desk will contact you within 24 hours for document verification.
            </p>
          </div>
          <button
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              setFormData({
                fullName: '',
                phone: '',
                email: '',
                sellerRole: 'Owner',
                propertyTitle: '',
                propertyType: 'Residential Real Estate (Living spaces)',
                location: 'South Goa District',
                sizeSqFt: '',
                expectedPrice: '',
                propertyCondition: 'Ready to Move',
                description: '',
                notes: '',
              });
            }}
            className="bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-6 py-3 rounded-xl transition-colors text-xs"
          >
            Post Another Property
          </button>
        </motion.div>
      ) : (
        /* Multi-step Form Wizard */
        <div className="bg-white border border-brand-sandDark rounded-[30px] p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Progress Indicators Bar */}
          <div className="grid grid-cols-4 gap-2 border-b border-brand-sandDark pb-8">
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

          {/* Form Content body */}
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-brand-error font-bold">
                {errors.submit}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                
                {/* STEP 1: CONTACT DETAILS */}
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.fullName ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                      {errors.fullName && <p className="text-[10px] text-brand-error font-semibold">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="sellerRole" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Your Role *</label>
                      <select
                        name="sellerRole"
                        id="sellerRole"
                        value={formData.sellerRole}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                      >
                        <option value="Owner">Property Owner</option>
                        <option value="Broker">Authorized Real Estate Broker</option>
                        <option value="Builder">Builder / Developer Representative</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 9876543210"
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.phone ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] text-brand-error font-semibold">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. john@domain.com"
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.email ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-brand-error font-semibold">{errors.email}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 2: PROPERTY SPECS */}
                {step === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2 space-y-2">
                      <label htmlFor="propertyTitle" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Property Title *</label>
                      <input
                        type="text"
                        name="propertyTitle"
                        id="propertyTitle"
                        value={formData.propertyTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. Heritage 3 BHK Villa in South Goa"
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                          errors.propertyTitle ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                        }`}
                      />
                      {errors.propertyTitle && <p className="text-[10px] text-brand-error font-semibold">{errors.propertyTitle}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="propertyType" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Asset Class *</label>
                      <select
                        name="propertyType"
                        id="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                      >
                        <option value="Residential Real Estate (Living spaces)">Residential Real Estate (Living spaces)</option>
                        <option value="Commercial Real Estate (Business & income generation)">Commercial Real Estate (Business & income generation)</option>
                        <option value="Industrial Real Estate (Production, storage, logistics)">Industrial Real Estate (Production, storage, logistics)</option>
                        <option value="Land / Plots (Raw, subdivided, or agricultural)">Land / Plots (Raw, subdivided, or agricultural)</option>
                        <option value="Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)">Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">District Location *</label>
                      <select
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                      >
                        {locationsList.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="sizeSqFt" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Size / Built-up Area (Sq.Ft) *</label>
                      <div className="relative">
                        <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="number"
                          name="sizeSqFt"
                          id="sizeSqFt"
                          value={formData.sizeSqFt}
                          onChange={handleInputChange}
                          placeholder="e.g. 2400"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-brand-goldDark ${
                            errors.sizeSqFt ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                          }`}
                        />
                      </div>
                      {errors.sizeSqFt && <p className="text-[10px] text-brand-error font-semibold">{errors.sizeSqFt}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="expectedPrice" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Expected Asking Price (₹) *</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-brand-goldDark absolute left-3.5 top-3.5" />
                        <input
                          type="number"
                          name="expectedPrice"
                          id="expectedPrice"
                          value={formData.expectedPrice}
                          onChange={handleInputChange}
                          placeholder="e.g. 12000000"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-brand-goldDark ${
                            errors.expectedPrice ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                          }`}
                        />
                      </div>
                      {errors.expectedPrice ? (
                        <p className="text-[10px] text-brand-error font-semibold">{errors.expectedPrice}</p>
                      ) : (
                        <p className="text-[10px] text-brand-goldDark font-bold">{formatPrice(formData.expectedPrice)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: DETAILS & PHOTOS */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="propertyCondition" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Construction Status</label>
                        <select
                          name="propertyCondition"
                          id="propertyCondition"
                          value={formData.propertyCondition}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-brand-goldDark"
                        >
                          <option value="Ready to Move">Ready to Move</option>
                          <option value="Under Construction">Under Construction</option>
                          <option value="Resale">Resale / Heritage</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Listing Description *</label>
                      <textarea
                        name="description"
                        id="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Outline rooms, amenities, road access, distance to beach, or commercial viability details..."
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-brand-goldDark ${
                          errors.description ? 'border-brand-error' : 'border-slate-300'
                        }`}
                      ></textarea>
                      {errors.description && <p className="text-[10px] text-brand-error font-semibold">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Upload Photos & Legal Mutat Documents</label>
                      <div className="border-2 border-dashed border-brand-sandDark rounded-2xl p-6 text-center bg-brand-bg/50 hover:bg-brand-bg hover:border-brand-goldDark transition-colors cursor-pointer select-none">
                        <UploadCloud className="w-8 h-8 text-brand-goldDark mx-auto mb-2 animate-bounce" />
                        <span className="block text-xs font-bold text-brand-navy">Drag & drop photos or PDF title deed here</span>
                        <span className="text-[10px] text-brand-text-muted">Supports JPG, PNG, PDF up to 10MB</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & POST */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="bg-brand-bg rounded-2xl p-6 border border-brand-sandDark grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-brand-gold uppercase tracking-wider border-b border-brand-sandDark pb-1.5">Seller Profile</h4>
                        <p><strong className="text-brand-navy">Name:</strong> {formData.fullName}</p>
                        <p><strong className="text-brand-navy">Role:</strong> {formData.sellerRole}</p>
                        <p><strong className="text-brand-navy">Phone:</strong> {formData.phone}</p>
                        <p><strong className="text-brand-navy">Email:</strong> {formData.email}</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-extrabold text-brand-gold uppercase tracking-wider border-b border-brand-sandDark pb-1.5">Property Specs</h4>
                        <p><strong className="text-brand-navy">Title:</strong> {formData.propertyTitle}</p>
                        <p><strong className="text-brand-navy">Type:</strong> {formData.propertyType} ({formData.propertyCondition})</p>
                        <p><strong className="text-brand-navy">Location:</strong> {formData.location}, Goa</p>
                        <p><strong className="text-brand-navy">Expected Price:</strong> {formatPrice(formData.expectedPrice)}</p>
                        <p><strong className="text-brand-navy">Size:</strong> {formData.sizeSqFt} Sq.Ft</p>
                      </div>

                      <div className="sm:col-span-2 space-y-3">
                        <h4 className="font-extrabold text-brand-gold uppercase tracking-wider border-b border-brand-sandDark pb-1.5">Description</h4>
                        <p className="text-slate-600 italic">"{formData.description}"</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Internal Agent Notes (Optional)</label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows="2"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Add preferred contact time or specific pricing details..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-goldDark focus:border-brand-goldDark focus-visible:ring-2 focus-visible:ring-brand-goldDark"
                      ></textarea>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation Buttons */}
            <div className="flex flex-row gap-4 justify-between items-center pt-6 border-t border-brand-sandDark mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors outline-none border border-brand-sandDark py-2.5 rounded-xl sm:border-none sm:py-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>
              ) : null}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-initial bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 text-xs outline-none"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 text-xs outline-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Listing...</span>
                  ) : (
                    <>
                      <span>Post Listing</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
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

export default Sell;
