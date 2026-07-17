import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building, MapPin, DollarSign, Layers, FileText, CheckCircle2, ChevronRight, ChevronLeft, UploadCloud } from 'lucide-react';
import { submitPropertyListing } from '../services/api';

function Sell() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    sellerRole: 'Owner', // Owner / Broker
    propertyTitle: '',
    propertyType: 'Villa', // Villa / Apartment / Commercial / Plot
    location: 'Panaji',
    sizeSqFt: '',
    expectedPrice: '',
    propertyCondition: 'Ready to Move',
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const locationsList = ['Panaji', 'Margao', 'Calangute', 'Candolim', 'Mapusa', 'Vasco', 'Porvorim', 'Other'];

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

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
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
        title: formData.propertyTitle,
        type: formData.propertyType,
        location: formData.location,
        size: Number(formData.sizeSqFt),
        price: Number(formData.expectedPrice),
        condition: formData.propertyCondition,
        description: formData.description,
        notes: formData.notes,
      };

      await submitPropertyListing(payload);
      setIsSuccess(true);
    } catch (error) {
      alert(error.message || 'Failed to submit property listing');
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
      
      {/* Title Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Sell your property <span className="font-light italic font-syne text-brand-gold">with the experts</span> in Goa
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-brand-text-muted leading-relaxed">
          Fill in your property specs below. Our valuation and legal teams will review the details to list your property on the main CS catalog.
        </p>
      </div>

      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
                propertyType: 'Villa',
                location: 'Panaji',
                sizeSqFt: '',
                expectedPrice: '',
                propertyCondition: 'Ready to Move',
                description: '',
                notes: '',
              });
            }}
            className="bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-6 py-3 rounded-xl transition-colors text-xs"
          >
            List Another Property
          </button>
        </motion.div>
      ) : (
        <div className="bg-white border border-brand-sandDark rounded-[30px] shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Progress Indicators */}
          <div className="hidden sm:flex justify-between items-center relative pb-6 border-b border-brand-sandDark">
            {stepIndicators.map((si, idx) => {
              const active = idx + 1 <= step;
              const current = idx + 1 === step;
              return (
                <div key={idx} className="flex items-center space-x-3 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    current 
                      ? 'bg-brand-navy text-brand-gold border-transparent shadow' 
                      : active 
                        ? 'bg-brand-bg text-brand-navy border-brand-sandDark' 
                        : 'bg-white text-slate-300 border-slate-200'
                  }`}>
                    {si.icon}
                  </div>
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Step 0{idx + 1}</span>
                    <span className={`text-xs font-bold ${current ? 'text-brand-navy' : 'text-slate-500'}`}>{si.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sm:hidden text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Step {step} of 4: {stepIndicators[step - 1].title}
          </div>

          {/* Form Content */}
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
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                        errors.fullName ? 'border-brand-error' : 'border-brand-sandDark'
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-brand-error font-semibold">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Your Role *</label>
                    <select
                      name="sellerRole"
                      value={formData.sellerRole}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-brand-sandDark rounded-xl outline-none text-xs font-semibold bg-brand-bg"
                    >
                      <option value="Owner">Property Owner</option>
                      <option value="Broker">Authorized Real Estate Broker</option>
                      <option value="Builder">Builder / Developer Representative</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9876543210"
                      className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                        errors.phone ? 'border-brand-error' : 'border-brand-sandDark'
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-brand-error font-semibold">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john@domain.com"
                      className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                        errors.email ? 'border-brand-error' : 'border-brand-sandDark'
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
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Property Title *</label>
                    <input
                      type="text"
                      name="propertyTitle"
                      value={formData.propertyTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Heritage 3 BHK Villa in South Goa"
                      className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                        errors.propertyTitle ? 'border-brand-error' : 'border-brand-sandDark'
                      }`}
                    />
                    {errors.propertyTitle && <p className="text-[10px] text-brand-error font-semibold">{errors.propertyTitle}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Property Type *</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-brand-sandDark rounded-xl outline-none text-xs font-semibold bg-brand-bg"
                    >
                      <option value="Villa">Villa / Bungalow</option>
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Plot">Land / Plot</option>
                      <option value="Commercial">Commercial Office/Shop</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Location in Goa *</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-brand-sandDark rounded-xl outline-none text-xs font-semibold bg-brand-bg"
                    >
                      {locationsList.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Size / Built-up Area (Sq.Ft) *</label>
                    <div className="relative">
                      <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="number"
                        name="sizeSqFt"
                        value={formData.sizeSqFt}
                        onChange={handleInputChange}
                        placeholder="e.g. 2400"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                          errors.sizeSqFt ? 'border-brand-error' : 'border-brand-sandDark'
                        }`}
                      />
                    </div>
                    {errors.sizeSqFt && <p className="text-[10px] text-brand-error font-semibold">{errors.sizeSqFt}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Expected Asking Price (₹) *</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-brand-gold absolute left-3.5 top-3.5" />
                      <input
                        type="number"
                        name="expectedPrice"
                        value={formData.expectedPrice}
                        onChange={handleInputChange}
                        placeholder="e.g. 12000000"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                          errors.expectedPrice ? 'border-brand-error' : 'border-brand-sandDark'
                        }`}
                      />
                    </div>
                    {errors.expectedPrice ? (
                      <p className="text-[10px] text-brand-error font-semibold">{errors.expectedPrice}</p>
                    ) : (
                      <p className="text-[10px] text-brand-gold font-bold">{formatPrice(formData.expectedPrice)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS & PHOTOS */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Construction Status</label>
                      <select
                        name="propertyCondition"
                        value={formData.propertyCondition}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-brand-sandDark rounded-xl outline-none text-xs font-semibold bg-brand-bg"
                      >
                        <option value="Ready to Move">Ready to Move</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Resale">Resale / Heritage</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Listing Description *</label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Outline rooms, amenities, road access, distance to beach, or commercial viability details..."
                      className={`w-full px-4 py-3 border rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold ${
                        errors.description ? 'border-brand-error' : 'border-brand-sandDark'
                      }`}
                    ></textarea>
                    {errors.description && <p className="text-[10px] text-brand-error font-semibold">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Upload Photos & Legal Mutat Documents</label>
                    <div className="border-2 border-dashed border-brand-sandDark rounded-2xl p-6 text-center bg-brand-bg/50 hover:bg-brand-bg hover:border-brand-gold transition-colors cursor-pointer select-none">
                      <UploadCloud className="w-8 h-8 text-brand-gold mx-auto mb-2 animate-bounce" />
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
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Internal Agent Notes (Optional)</label>
                    <textarea
                      name="notes"
                      rows="2"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add preferred contact time or specific pricing details..."
                      className="w-full px-4 py-3 border border-brand-sandDark rounded-xl outline-none text-xs font-semibold bg-brand-bg focus:ring-2 focus:ring-brand-gold"
                    ></textarea>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-brand-sandDark mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-1 text-xs outline-none disabled:opacity-50"
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

        </div>
      )}

    </div>
  );
}

export default Sell;
