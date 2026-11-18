import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, FileText } from 'lucide-react';

export default function Verification() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('aadhaar'); // 'aadhaar' or 'pan'

  const [aadhaar1, setAadhaar1] = useState('');
  const [aadhaar2, setAadhaar2] = useState('');
  const [aadhaar3, setAadhaar3] = useState('');
  const [consentAadhaar, setConsentAadhaar] = useState(false);

  const [panNumber, setPanNumber] = useState('');
  const [consentPan, setConsentPan] = useState(false);

  const handleResetAadhaar = () => {
    setAadhaar1('');
    setAadhaar2('');
    setAadhaar3('');
    setConsentAadhaar(false);
  };

  const handleResetPan = () => {
    setPanNumber('');
    setConsentPan(false);
  };

  const handleAadhaarVerify = (e) => {
    e.preventDefault();
    console.log("Verifying Aadhaar:", `${aadhaar1}${aadhaar2}${aadhaar3}`);
  };

  const handlePanVerify = (e) => {
    e.preventDefault();
    console.log("Verifying PAN:", panNumber);
  };

  const getAadhaarLength = () => {
    return aadhaar1.length + aadhaar2.length + aadhaar3.length;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F7FB] p-6 relative">
      
      {/* Header and Breadcrumb */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-5 mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold text-[#225091] mb-1">KYC Verification</h1>
          <div className="text-[13px] text-[#64748B] flex items-center gap-2">
            <span className="hover:text-[#225091] cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span>›</span>
            <span>Verification</span>
            <span>›</span>
            <span className="text-[#225091] font-semibold">KYC Verification</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('aadhaar')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-t-xl font-semibold text-[14px] transition-all border-b-2 ${
            activeTab === 'aadhaar' 
              ? 'bg-[#EBF3FE] text-[#225091] border-[#225091]' 
              : 'bg-transparent text-[#64748B] border-transparent hover:bg-gray-100 hover:text-[#225091]'
          }`}
        >
          <CreditCard size={18} strokeWidth={2} />
          Aadhaar Verification
        </button>
        
        <button
          onClick={() => setActiveTab('pan')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-t-xl font-semibold text-[14px] transition-all border-b-2 ${
            activeTab === 'pan' 
              ? 'bg-[#EBF3FE] text-[#225091] border-[#225091]' 
              : 'bg-transparent text-[#64748B] border-transparent hover:bg-gray-100 hover:text-[#225091]'
          }`}
        >
          <FileText size={18} strokeWidth={2} />
          PAN Verification
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        
        {/* Box Header */}
        <div className="bg-[#F0F7F9] px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-[16px] font-bold text-[#225091]">
            {activeTab === 'aadhaar' ? 'Aadhaar Verification' : 'PAN Verification'}
          </h2>
        </div>

        {/* Box Body */}
        <div className="p-6">
          
          {activeTab === 'aadhaar' && (
            <form onSubmit={handleAadhaarVerify}>
              
              <div className="flex items-center justify-between mb-2 max-w-[400px]">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  Aadhaar Number (4-4-4 Digits) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#94A3B8] font-mono tracking-wider">
                  {getAadhaarLength()}/12 digits
                </span>
              </div>

              {/* Aadhaar Input Boxes */}
              <div className="flex items-center gap-3 mb-8 max-w-[400px]">
                <input
                  type="text"
                  value={aadhaar1}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAadhaar1(val);
                    if (val.length === 4) document.getElementById('aadhaar2').focus();
                  }}
                  id="aadhaar1"
                  placeholder="1234"
                  maxLength={4}
                  className="w-full h-[46px] text-center text-[16px] tracking-[4px] rounded-lg border border-[#E5E7EB] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] transition-all"
                  required
                />
                <span className="text-[#94A3B8] font-bold">-</span>
                <input
                  type="text"
                  value={aadhaar2}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAadhaar2(val);
                    if (val.length === 4) document.getElementById('aadhaar3').focus();
                    if (val.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') document.getElementById('aadhaar1').focus();
                  }}
                  id="aadhaar2"
                  placeholder="5678"
                  maxLength={4}
                  className="w-full h-[46px] text-center text-[16px] tracking-[4px] rounded-lg border border-[#E5E7EB] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] transition-all"
                  required
                />
                <span className="text-[#94A3B8] font-bold">-</span>
                <input
                  type="text"
                  value={aadhaar3}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAadhaar3(val);
                    if (val.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') document.getElementById('aadhaar2').focus();
                  }}
                  id="aadhaar3"
                  placeholder="9012"
                  maxLength={4}
                  className="w-full h-[46px] text-center text-[16px] tracking-[4px] rounded-lg border border-[#E5E7EB] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] transition-all"
                  required
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 mb-10">
                <input
                  type="checkbox"
                  id="consentAadhaar"
                  checked={consentAadhaar}
                  onChange={(e) => setConsentAadhaar(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#225091] focus:ring-[#225091] cursor-pointer"
                  required
                />
                <label htmlFor="consentAadhaar" className="text-[14px] text-[#475569] cursor-pointer leading-relaxed">
                  I consent to verify my identity securely using DigiLocker.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-6 border-t border-[#E5E7EB] pt-6">
                <button
                  type="button"
                  onClick={handleResetAadhaar}
                  className="px-8 py-2.5 rounded-full border border-[#225091] text-[#225091] font-semibold text-[14px] hover:bg-[#F0F7F9] transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-[#829EBE] text-white font-semibold text-[14px] hover:bg-[#225091] transition-colors shadow-sm"
                >
                  Verify with DigiLocker
                </button>
              </div>
            </form>
          )}

          {activeTab === 'pan' && (
            <form onSubmit={handlePanVerify}>
              
              <div className="flex items-center justify-between mb-2 max-w-[400px]">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#94A3B8] font-mono tracking-wider">
                  {panNumber.length}/10 chars
                </span>
              </div>

              {/* PAN Input Box */}
              <div className="mb-2 max-w-[400px]">
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ENTER 10-CHAR PAN (E.G. ABCDE1234F)"
                  maxLength={10}
                  className="w-full h-[46px] px-4 text-[14px] tracking-wide rounded-lg border border-[#E5E7EB] outline-none focus:border-[#225091] focus:ring-1 focus:ring-[#225091] uppercase transition-all placeholder:normal-case placeholder:tracking-normal"
                  required
                />
              </div>
              <p className="text-[11px] text-[#64748B] mb-8">
                Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F).
              </p>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 mb-10">
                <input
                  type="checkbox"
                  id="consentPan"
                  checked={consentPan}
                  onChange={(e) => setConsentPan(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#225091] focus:ring-[#225091] cursor-pointer"
                  required
                />
                <label htmlFor="consentPan" className="text-[14px] text-[#475569] cursor-pointer leading-relaxed">
                  I consent to verify my identity securely using DigiLocker.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-6 border-t border-[#E5E7EB] pt-6">
                <button
                  type="button"
                  onClick={handleResetPan}
                  className="px-8 py-2.5 rounded-full border border-[#225091] text-[#225091] font-semibold text-[14px] hover:bg-[#F0F7F9] transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-[#829EBE] text-white font-semibold text-[14px] hover:bg-[#225091] transition-colors shadow-sm"
                >
                  Verify with DigiLocker
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
