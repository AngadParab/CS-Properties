import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home as HomeIcon, FileText, User, CheckCircle, FileCheck, Info } from 'lucide-react';

function Services() {
  const [activeTab, setActiveTab] = useState('business');

  const servicesData = {
    business: {
      id: 'business',
      title: 'Business Loans',
      icon: <Building2 className="w-6 h-6" />,
      desc: 'Ideal for local MSMEs, retail merchants, and startup projects in Goa seeking unsecured or secured working capital, expansion funds, or machinery financing.',
      interest: 'Starting from 9.5% p.a.',
      maxAmount: 'Up to ₹5 Crores',
      eligibility: [
        'Business must be registered and operating for at least 2 years in Goa.',
        'Annual turnover of ₹15 Lakhs or above.',
        'Min/Max Age: 21 to 65 years.',
        'Good credit rating/score (CIBIL of 700+ preferred).',
      ],
      documents: [
        'Company KYC (GST Registration, Trade License, Partnership Deed).',
        'Director/Owner identity & address proofs (Aadhaar, PAN).',
        'Last 12 months bank statements.',
        'Income Tax Returns (ITR) with balance sheets for the last 2 years.',
      ],
    },
    mortgage: {
      id: 'mortgage',
      title: 'Mortgage / Home Loans',
      icon: <HomeIcon className="w-6 h-6" />,
      desc: 'Purchase apartments, build villas, or buy land plots across Goa. We partner with public sector banks to secure lowest home interest rates.',
      interest: 'Starting from 8.35% p.a.',
      maxAmount: 'Up to ₹10 Crores (Based on Property Valuation)',
      eligibility: [
        'Salaried employees or self-employed individuals with stable income.',
        'Minimum monthly net salary of ₹25,000.',
        'Min/Max Age: 18 to 70 years.',
        'Clean title deeds of the property to be financed.',
      ],
      documents: [
        'Applicant KYC documents (PAN card is mandatory).',
        'Last 3 months salary slips & Form 16 (for salaried applicants).',
        'Last 6 months salary bank account statement.',
        'Property title documents, sanctioned construction plans, and builder NOC.',
      ],
    },
    lap: {
      id: 'lap',
      title: 'Loan Against Property',
      icon: <FileText className="w-6 h-6" />,
      desc: 'Unlocking liquidity from your existing residential, commercial, or ancestral properties. Utilize funds for children education, business growth, or family weddings.',
      interest: 'Starting from 9.0% p.a.',
      maxAmount: 'Up to 65% of Property Market Value',
      eligibility: [
        'Individuals owning clear property titles within Goa municipal limits.',
        'Assured repayment source (Business income or regular employment).',
        'CIBIL score of 680+.',
      ],
      documents: [
        'KYC files of all property co-owners.',
        'Property Ownership Documents (Sale Deed, Mutation Certificate, Land Tax receipts).',
        'Income statement verification documents (ITR or audited balance sheets).',
        'Valuation report and title search report (we assist in organizing these).',
      ],
    },
    personal: {
      id: 'personal',
      title: 'Personal Loans',
      icon: <User className="w-6 h-6" />,
      desc: 'Instant, collateral-free credit lines for immediate financial contingencies, medical bills, travel plans, or luxury purchases.',
      interest: 'Starting from 10.75% p.a.',
      maxAmount: 'Up to ₹25 Lakhs',
      eligibility: [
        'Salaried professionals employed in reputed companies or government offices in Goa.',
        'Minimum monthly net take-home of ₹30,000.',
        'Min/Max Age: 21 to 58 years.',
        'Excellent repayment history (No active defaults).',
      ],
      documents: [
        'Proof of Identity & Address (Aadhaar, Passport, Voter ID).',
        'PAN Card.',
        'Last 3 months salary slips.',
        'Last 6 months salary account bank statements.',
      ],
    },
  };

  const selectedService = servicesData[activeTab];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">Financial Portfolios</h1>
        <p className="max-w-2xl mx-auto text-brand-text-muted">
          Compare our primary lending products, check your eligibility thresholds, and prepare your initial paperwork before consulting our team.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Tabs Panel */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          {Object.values(servicesData).map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={`flex items-center space-x-4 p-4 rounded-xl text-left border transition-all duration-200 outline-none ${
                activeTab === service.id
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                  : 'bg-white text-brand-navy border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${activeTab === service.id ? 'bg-blue-800' : 'bg-slate-50'}`}>
                {service.icon}
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">{service.title}</h3>
                <span className={`text-xs ${activeTab === service.id ? 'text-brand-gold font-semibold' : 'text-brand-text-muted'}`}>
                  {service.interest}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Tab Details Display */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8">
          
          {/* Headline details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-navy">{selectedService.title} Details</h2>
            <p className="text-brand-text-muted leading-relaxed">{selectedService.desc}</p>
            
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-lg p-4 flex items-center space-x-3">
                <Info className="w-5 h-5 text-brand-navy shrink-0" />
                <div>
                  <span className="block text-xs text-brand-text-muted uppercase font-semibold">Interest Rate</span>
                  <span className="font-bold text-brand-navy text-sm sm:text-base">{selectedService.interest}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 flex items-center space-x-3">
                <FileCheck className="w-5 h-5 text-brand-navy shrink-0" />
                <div>
                  <span className="block text-xs text-brand-text-muted uppercase font-semibold">Max Finance Limit</span>
                  <span className="font-bold text-brand-navy text-sm sm:text-base">{selectedService.maxAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Guidelines Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Eligibility */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-brand-navy flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-brand-gold" />
                <span>Eligibility Standards</span>
              </h3>
              <ul className="space-y-2.5">
                {selectedService.eligibility.map((el, i) => (
                  <li key={i} className="text-sm text-brand-text-muted pl-1 list-disc list-inside leading-relaxed">
                    {el}
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-brand-navy flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-brand-gold" />
                <span>Required Documentation</span>
              </h3>
              <ul className="space-y-2.5">
                {selectedService.documents.map((doc, i) => (
                  <li key={i} className="text-sm text-brand-text-muted pl-1 list-disc list-inside leading-relaxed">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
            <span className="text-xs text-brand-text-muted font-medium italic">
              * Rates are indicative and depend on bank policies at the time of processing.
            </span>
            <Link
              to="/apply"
              className="w-full sm:w-auto bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-3 rounded-md transition-colors text-center text-sm shadow-sm"
            >
              Apply for {selectedService.title}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Services;
