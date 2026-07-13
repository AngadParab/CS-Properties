import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home as HomeIcon, FileText, User, ArrowRight, CheckCircle2, ShieldAlert, BadgePercent, Landmark } from 'lucide-react';

function Home() {
  const serviceCards = [
    {
      title: 'Business Loans',
      desc: 'Fuel your startup or grow your local enterprise. Secure working capital or equipment financing.',
      icon: <Building2 className="w-8 h-8 text-brand-navy" />,
      link: '/services',
    },
    {
      title: 'Mortgage / Home Loans',
      desc: 'Build or buy your dream home in Goa with interest rates directly from 30+ top partner banks.',
      icon: <HomeIcon className="w-8 h-8 text-brand-navy" />,
      link: '/services',
    },
    {
      title: 'Loan Against Property',
      desc: 'Unlock the hidden equity in your residential or commercial real estate for any financial need.',
      icon: <FileText className="w-8 h-8 text-brand-navy" />,
      link: '/services',
    },
    {
      title: 'Personal Loans',
      desc: 'Immediate unsecured personal credit for travel, education, medical, or urgent expenses.',
      icon: <User className="w-8 h-8 text-brand-navy" />,
      link: '/services',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Quick Analysis',
      desc: 'Complete our eligibility quiz or fill out the application details in under 2 minutes.',
    },
    {
      num: '02',
      title: 'Document Collect',
      desc: 'Our financial advisors review your documents and select the best bank products.',
    },
    {
      num: '03',
      title: 'Direct Disbursement',
      desc: 'Get the loan amount credited directly into your account with 0% extra commission.',
    },
  ];

  const trustMetrics = [
    { value: '30+', label: 'Partner Banks & NBFCs', icon: <Landmark className="w-6 h-6 text-brand-gold" /> },
    { value: '0%', label: 'Advisor Commission Fee', icon: <BadgePercent className="w-6 h-6 text-brand-gold" /> },
    { value: '₹500Cr+', label: 'Accumulated Disbursements', icon: <CheckCircle2 className="w-6 h-6 text-brand-gold" /> },
    { value: '100%', label: 'Transparency Guarantee', icon: <ShieldAlert className="w-6 h-6 text-brand-gold" /> },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative bg-brand-navy text-white py-24 px-4 overflow-hidden border-b border-blue-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-brand-gold text-brand-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-2 uppercase tracking-wide">
            <span>Direct Bank Rates</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>
            <span>Zero Brokerage Fees</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Get the Best Loan Deal in Goa, <br className="hidden sm:inline" />
            <span className="text-brand-gold">With 0% Commission.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            We partner with 30+ leading public & private banks to secure your personal, home, or business finance. No hidden fees. Just transparent advising.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/apply"
              className="w-full sm:w-auto bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-8 py-4 rounded-md shadow-lg transition-colors flex items-center justify-center space-x-2 text-base"
            >
              <span>Start Free Eligibility Check</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/calculator"
              className="w-full sm:w-auto border border-gray-400 hover:border-white font-semibold px-8 py-4 rounded-md transition-colors text-base"
            >
              Calculate Loan EMI
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Trust Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-xl shadow-md border border-slate-100">
          {trustMetrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-blue-50 rounded-full">
                {metric.icon}
              </div>
              <span className="text-3xl font-extrabold text-brand-navy">{metric.value}</span>
              <span className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Reusable Loan Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-brand-navy">Structured Loan Solutions</h2>
          <p className="max-w-xl mx-auto text-brand-text-muted">
            Tailored loan products crafted by professional advisors to match your cash flows and investment schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 w-fit rounded-lg group-hover:bg-blue-50 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-navy">{card.title}</h3>
                <p className="text-sm text-brand-text-muted leading-relaxed">{card.desc}</p>
              </div>
              
              <Link
                to={card.link}
                className="mt-6 text-sm font-semibold text-brand-navy hover:text-brand-gold flex items-center space-x-1.5 focus:outline-none"
              >
                <span>Read Requirements</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 3-Step Onboarding Pipeline */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-brand-navy">How it Works</h2>
            <p className="max-w-xl mx-auto text-brand-text-muted">
              Getting loan approvals shouldn't be a maze. We've simplified the entire pipeline into 3 clear phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <span className="absolute -top-6 text-5xl font-black text-slate-100 font-mono tracking-tight select-none">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-brand-navy pt-2">{step.title}</h3>
                <p className="text-sm text-brand-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call To Action (Bottom Widget) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-brand-navy text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#F59E0B_10%,transparent_100%)]"></div>
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Secure Your Finance?</h2>
          <p className="max-w-xl mx-auto text-gray-300 text-sm sm:text-base">
            Consulting our loan advisors is completely free. We collect documents locally and handle banking discussions on your behalf.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/apply"
              className="bg-brand-gold text-brand-navy font-bold px-8 py-3 rounded-md hover:bg-yellow-500 transition-colors inline-block shadow-md text-sm"
            >
              Apply Online Now
            </Link>
            <Link
              to="/contact"
              className="border border-gray-400 hover:border-white font-semibold px-8 py-3 rounded-md transition-colors inline-block text-sm"
            >
              Get Office Location
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
