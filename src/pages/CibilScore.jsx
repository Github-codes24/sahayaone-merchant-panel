import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Calendar, CheckCircle } from 'lucide-react';

export default function CibilScore() {
  const navigate = useNavigate();
  const dobRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    panNumber: '',
    dob: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      panNumber: '',
      dob: ''
    });
  };

  const handleFetch = (e) => {
    e.preventDefault();
    console.log("Fetching CIBIL Score for:", formData);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F7FB] p-6 relative">
      {/* Hide native date picker icon completely across browsers */}
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none;
            -webkit-appearance: none;
          }
          input[type="date"]::-webkit-inner-spin-button {
            display: none;
          }
        `}
      </style>

      {/* Header and Breadcrumb */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-5 mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold text-[#225091] mb-1">CIBIL Score & Report</h1>
          <div className="text-[13px] text-[#64748B] flex items-center gap-2">
            <span className="hover:text-[#225091] cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span>›</span>
            <span>Verification</span>
            <span>›</span>
            <span className="text-[#225091] font-semibold">Check Score</span>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        {/* Box Header */}
        <div className="bg-[#F0F7F9] px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-[16px] font-bold text-[#225091]">Applicant Information</h2>
        </div>

        {/* Box Body */}
        <div className="p-6">
          <form onSubmit={handleFetch}>
            
            {/* Form Grid - 4 Columns on large screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full h-[42px] px-3 rounded-lg border border-[#E5E7EB] text-[14px] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] transition-all"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#64748B] text-[14px] font-medium">+91</span>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    className="w-full h-[42px] pl-10 pr-3 rounded-lg border border-[#E5E7EB] text-[14px] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] transition-all"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* PAN Card Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  PAN Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  className="w-full h-[42px] px-3 rounded-lg border border-[#E5E7EB] text-[14px] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] uppercase transition-all"
                  maxLength={10}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  Date Of Birth <span className="text-red-500">*</span>
                </label>
                <div 
                  className="relative flex items-center w-full h-[42px] rounded-lg border border-[#E5E7EB] bg-white overflow-hidden group focus-within:border-[#225091] focus-within:ring-1 focus-within:ring-[#225091] transition-all"
                >
                  <div 
                    className="flex items-center justify-center pl-3 pr-2 h-full cursor-pointer"
                    onClick={() => {
                      if (dobRef.current) {
                        dobRef.current.type = 'date';
                        dobRef.current.focus();
                        try {
                          if (dobRef.current.showPicker) dobRef.current.showPicker();
                        } catch(e) {}
                      }
                    }}
                  >
                    <Calendar size={18} className="text-[#64748B] group-focus-within:text-[#225091] transition-colors" strokeWidth={2} />
                  </div>
                  <input
                    ref={dobRef}
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    placeholder="DD - MM - YYYY"
                    className="w-full h-full pr-3 bg-transparent text-[14px] outline-none cursor-pointer text-[#1E293B]"
                    onFocus={(e) => {
                      e.target.type = 'date';
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.type = 'text';
                      }
                    }}
                    onClick={(e) => {
                      e.target.type = 'date';
                      try {
                        if (e.target.showPicker) e.target.showPicker();
                      } catch(err) {}
                    }}
                    required
                  />
                </div>
              </div>

            </div>

            {/* Cache Protection Alert */}
            <div className="bg-[#F0F7F9] border border-[#D6E6E9] rounded-lg p-3 flex items-center gap-3 mb-8">
              <CheckCircle size={18} className="text-[#225091] flex-shrink-0" strokeWidth={2.5} />
              <p className="text-[13.5px] text-[#225091] font-medium m-0">
                <strong className="font-bold">30-Day Cache Protection:</strong> Credit Bureau profiles queried in the past 30 days are loaded from cached bureau data.
              </p>
            </div>

            <div className="h-px w-full bg-[#E5E7EB] mb-6"></div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-2.5 rounded-full border border-[#225091] text-[#225091] font-semibold text-[14px] hover:bg-[#F0F7F9] transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#225091] text-white font-semibold text-[14px] hover:bg-[#1a3f75] transition-colors shadow-md"
              >
                <ShieldCheck size={18} strokeWidth={2} />
                Fetch CIBIL Score
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
