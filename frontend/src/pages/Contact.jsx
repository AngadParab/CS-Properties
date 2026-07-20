import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { submitInquiry } from '../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = '';
    const val = value !== undefined ? value : formData[name];

    if (name === 'name') {
      if (!val.trim()) errorMsg = 'Full Name is required.';
    } else if (name === 'phone') {
      if (!val.trim()) {
        errorMsg = 'Phone number is required.';
      } else if (!/^\d{10}$/.test(val.trim())) {
        errorMsg = 'Please enter a valid 10-digit phone number.';
      }
    } else if (name === 'email') {
      if (val.trim() && !/\S+@\S+\.\S+/.test(val.trim())) {
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (name === 'message') {
      if (!val.trim()) errorMsg = 'Message details are required.';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField('name');
    const isPhoneValid = validateField('phone');
    const isEmailValid = validateField('email');
    const isMessageValid = validateField('message');

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
      setErrors((prev) => ({ ...prev, formError: 'Please correct the validation errors below.' }));
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const payload = {
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        subject: formData.subject,
        message: formData.message,
        source: 'Contact Page',
      };
      
      await submitInquiry(payload);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setErrors({ formError: err.message || 'Failed to submit inquiry to Firestore. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Helmet>
        <title>Contact Our Advisors | CS Properties Goa</title>
        <meta name="description" content="Get in touch with CS Properties in Margao. Inquire about document verification, property title check, loan eligibility, or visit our branch." />
      </Helmet>
      
      {/* Title Header */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">Contact Our Advisors</h1>
        <p className="max-w-2xl mx-auto text-brand-text-muted">
          Have queries about interest rates, documentation, or eligibility? Get in touch with us. Drop a message or visit our Margao branch.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-brand-navy pb-3 border-b border-slate-100">
              Margao Head Office
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-brand-text-muted">
                <MapPin className="w-5.5 h-5.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-navy">Address</span>
                  <span>Shop No. 12, Grace Towers, Near Jose Building, Margao, Goa - 403601</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-brand-text-muted">
                <Phone className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-navy">Call Support</span>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-brand-text-muted">
                <Mail className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-navy">Email</span>
                  <span>info@creditsolutionsgoa.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-brand-text-muted">
                <Clock className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-navy">Working Hours</span>
                  <span>Mon - Sat: 9:30 AM - 6:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Badge */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-brand-navy text-sm">Legal Title Checks & Consultations</h3>
            <p className="text-xs text-brand-text-muted leading-relaxed">
              Visiting in person? Bring physical property title deeds or Bank NOC copies for immediate evaluation by our legal desk.
            </p>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-brand-success mx-auto" />
              <h2 className="text-2xl font-bold text-brand-navy">Message Logged to Firestore!</h2>
              <p className="text-xs text-brand-text-muted max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. Your inquiry record has been written to our Firestore database. An advisor will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-brand-navy text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-brand-navy pb-3 border-b border-slate-100">
                Send an Online Inquiry
              </h2>

              {errors.formError && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-brand-error text-xs font-semibold rounded-lg">
                  {errors.formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-brand-navy">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => validateField('name')}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                      errors.name ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                    }`}
                  />
                  {errors.name && <span className="text-[10px] text-brand-error font-semibold">{errors.name}</span>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-brand-navy">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => validateField('phone')}
                    placeholder="Enter your contact number"
                    className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                      errors.phone ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                    }`}
                  />
                  {errors.phone && <span className="text-[10px] text-brand-error font-semibold">{errors.phone}</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-brand-navy">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateField('email')}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                    errors.email ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                  }`}
                />
                {errors.email && <span className="text-[10px] text-brand-error font-semibold">{errors.email}</span>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-brand-navy">Subject</label>
                <select
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Business Loan Setup">Business Loan Setup</option>
                  <option value="Mortgage Interest rates">Mortgage Interest rates</option>
                  <option value="Real Estate Listing Enquiry">Real Estate Listing Enquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-brand-navy">Message / Query Details *</label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => validateField('message')}
                  placeholder="Explain your query in detail..."
                  className={`w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-brand-goldDark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-goldDark focus-visible:outline-none ${
                    errors.message ? 'border-brand-error focus:ring-red-200' : 'border-slate-300'
                  }`}
                ></textarea>
                {errors.message && <span className="text-[10px] text-brand-error font-semibold">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow shadow-yellow-100 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting to Firestore...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </main>
  );
}

export default Contact;
