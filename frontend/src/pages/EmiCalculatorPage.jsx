import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Landmark, ShieldCheck, HelpCircle } from 'lucide-react';

function EmiCalculatorPage() {
  const [principal, setPrincipal] = useState(5000000); // Default ₹50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%
  const [tenureYears, setTenureYears] = useState(15); // Default 15 Years
  
  const [principalInput, setPrincipalInput] = useState(principal.toLocaleString('en-IN'));
  const [principalError, setPrincipalError] = useState('');

  const calculations = useMemo(() => {
    const P = principal;
    const annualR = interestRate;
    const r = annualR / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total months

    if (r === 0) {
      const emi = P / n;
      const totalPayment = P;
      return {
        monthlyEmi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterest: 0,
        principalPercent: 100,
        interestPercent: 0,
      };
    }

    const emiFactor = Math.pow(1 + r, n);
    const emi = (P * r * emiFactor) / (emiFactor - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const principalPercent = (P / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    return {
      monthlyEmi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principalPercent,
      interestPercent,
    };
  }, [principal, interestRate, tenureYears]);

  // Sync range slider updates to text input visual representation
  useEffect(() => {
    setPrincipalInput(principal.toLocaleString('en-IN'));
    setPrincipalError('');
  }, [principal]);

  const handlePrincipalTextChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (!rawVal) {
      setPrincipalInput('');
      setPrincipalError('Principal amount is required.');
      return;
    }
    const num = Number(rawVal);
    setPrincipalInput(num.toLocaleString('en-IN'));
    
    // Validate range bounds
    if (num < 100000) {
      setPrincipalError('Min amount is ₹1 Lakh');
    } else if (num > 50000000) {
      setPrincipalError('Max amount is ₹5 Crores');
    } else {
      setPrincipalError('');
      setPrincipal(num); // update calculations principal
    }
  };

  // SVG Donut Chart Logic
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const interestStrokeDash = (calculations.interestPercent / 100) * circumference;
  const principalStrokeDash = circumference - interestStrokeDash;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">EMI Interest Calculator</h1>
        <p className="max-w-2xl mx-auto text-brand-text-muted">
          Plan your financial timeline. Adjust the parameters below to compute monthly installments and see the exact breakdown of interest and principal balances.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sliders Input */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-8">
          
          {/* Slider 1: Loan Amount */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-brand-navy">Loan Principal Amount</label>
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-bold text-brand-navy">₹</span>
                  <input
                    type="text"
                    value={principalInput}
                    onChange={handlePrincipalTextChange}
                    className={`bg-slate-50 text-right font-bold text-brand-navy px-3 py-1.5 rounded-lg border text-sm focus:outline-none w-36 sm:w-44 ${
                      principalError ? 'border-red-400 focus:ring-1 focus:ring-red-300' : 'border-slate-100 focus:ring-1 focus:ring-brand-gold'
                    }`}
                  />
                </div>
                {principalError && (
                  <span className="text-[10px] text-red-500 font-semibold">{principalError}</span>
                )}
              </div>
            </div>
            <input
              type="range"
              min={100000} // 1 Lakh
              max={50000000} // 5 Crores
              step={100000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-brand-navy cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-brand-text-muted">
              <span>₹1 Lakh</span>
              <span>₹5 Crores</span>
            </div>
          </div>

          {/* Slider 2: Interest Rate */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-brand-navy">Interest Rate (p.a.)</label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="0.05"
                  min="5"
                  max="20"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.min(20, Math.max(0, Number(e.target.value))))}
                  className="bg-slate-50 text-right font-bold text-brand-navy px-3 py-1.5 rounded-lg border border-slate-100 text-sm focus:outline-none w-20"
                />
                <span className="text-sm font-bold text-brand-navy">%</span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={0.05}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-brand-navy cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-brand-text-muted">
              <span>5.0%</span>
              <span>20.0%</span>
            </div>
          </div>

          {/* Slider 3: Loan Tenure */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-brand-navy">Loan Tenure / Duration</label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Math.min(30, Math.max(1, Number(e.target.value))))}
                  className="bg-slate-50 text-right font-bold text-brand-navy px-3 py-1.5 rounded-lg border border-slate-100 text-sm focus:outline-none w-20"
                />
                <span className="text-sm font-bold text-brand-navy">Years</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-brand-navy cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-brand-text-muted">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

        </div>

        {/* Right Side: Calculation Summary & SVG Donut Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-brand-navy pb-3 border-b border-slate-100">
            Installment Breakdown
          </h2>

          <div className="text-center py-4 bg-slate-50 rounded-xl">
            <span className="block text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
              Monthly Payable EMI
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
              {formatCurrency(calculations.monthlyEmi)}
            </span>
          </div>

          {/* Metrics List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-brand-text-muted flex items-center space-x-2">
                <span className="w-3 h-3 bg-brand-navy rounded"></span>
                <span>Principal Amount</span>
              </span>
              <span className="text-brand-navy font-bold">{formatCurrency(principal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-brand-text-muted flex items-center space-x-2">
                <span className="w-3 h-3 bg-brand-gold rounded"></span>
                <span>Interest Payable</span>
              </span>
              <span className="text-brand-navy font-bold">{formatCurrency(calculations.totalInterest)}</span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-brand-navy">Total Cost of Loan</span>
              <span className="text-brand-navy">{formatCurrency(calculations.totalPayment)}</span>
            </div>
          </div>

          {/* SVG Pie/Donut Chart */}
          <div className="flex justify-center items-center py-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="fill-transparent stroke-slate-100"
                  strokeWidth="20"
                />
                {/* Principal Portion (Navy) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="fill-transparent stroke-brand-navy transition-all duration-300"
                  strokeWidth="20"
                  strokeDasharray={`${principalStrokeDash} ${interestStrokeDash}`}
                />
                {/* Interest Portion (Gold) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="fill-transparent stroke-brand-gold transition-all duration-300"
                  strokeWidth="20"
                  strokeDasharray={`${interestStrokeDash} ${principalStrokeDash}`}
                  strokeDashoffset={-principalStrokeDash}
                />
              </svg>
              {/* Inner Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-bold text-brand-text-muted tracking-wider">Interest Ratio</span>
                <span className="text-sm font-bold text-brand-navy">
                  {calculations.interestPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <Link
              to={`/apply?amount=${principal}&tenure=${tenureYears}`}
              className="block w-full bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-3.5 rounded-md text-center shadow-md transition-colors text-sm"
            >
              Apply With This Calculation
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EmiCalculatorPage;
