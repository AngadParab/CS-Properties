import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError('Please fill in all mandatory fields (*).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: 'Margao (Office Entry)',
        loanType: 'Personal Loan',
        amount: 0,
        tenureYears: 1,
        employmentType: 'Salaried',
        monthlyIncome: 0,
        notes: `[Contact Form - Subject: ${formData.subject}] ${formData.message}`
      };
      
      await submitLead(payload);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">Contact Our Advisors</h1>
        <p className="max-w-2xl mx-auto text-brand-text-muted">
          Have queries about interest rates, documentation, or eligibility? Get in touch with us. Drop a message or visit our Margao branch.
        </p>
      </div>

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
                  <span className="block font-bold text-brand-navy">Operating Hours</span>
                  <span>Monday - Saturday: 9:30 AM - 6:30 PM <br />Sunday: Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Iframe */}
          <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm h-64 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m10!1m3!1d3848.243543958933!2d73.9575!3d15.275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDE2JzMwLjAiTiA3M8KwNTcnMjcuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              className="border-0 rounded-xl"
              allowFullScreen=""
              loading="lazy"
              title="Margao Office Map"
            ></iframe>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-brand-navy pb-3 border-b border-slate-100 mb-6">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 text-brand-success p-6 rounded-xl text-center space-y-4 border border-emerald-100">
              <CheckCircle2 className="w-12 h-12 mx-auto" />
              <h3 className="text-lg font-bold text-brand-navy">Message Sent Successfully!</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Thank you for contacting Credit Solutions Goa. One of our financial advisors will get back to you shortly on your provided contact details.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-brand-navy text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-blue-900 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-xs text-brand-error font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Business Loan Setup">Business Loan Setup</option>
                  <option value="Mortgage Interest rates">Mortgage Interest rates</option>
                  <option value="Real Estate Listing Enquiry">Real Estate Listing Enquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Message / Query Details *</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Explain your query in detail..."
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow shadow-yellow-100 text-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}

export default Contact;
