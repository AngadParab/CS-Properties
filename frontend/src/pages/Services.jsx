import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home as HomeIcon, FileText, User, CheckCircle, FileCheck, Info } from 'lucide-react';
import servicesDataRaw from '../data/services.json';

function Services() {
  const [activeTab, setActiveTab] = useState('business');

  const servicesData = {
    business: {
      ...servicesDataRaw.business,
      icon: <Building2 className="w-6 h-6" />
    },
    mortgage: {
      ...servicesDataRaw.mortgage,
      icon: <HomeIcon className="w-6 h-6" />
    },
    lap: {
      ...servicesDataRaw.lap,
      icon: <FileText className="w-6 h-6" />
    },
    personal: {
      ...servicesDataRaw.personal,
      icon: <User className="w-6 h-6" />
    }
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
                <CheckCircle className="w-5 h-5 text-brand-goldDark" />
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
                <FileCheck className="w-5 h-5 text-brand-goldDark" />
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
