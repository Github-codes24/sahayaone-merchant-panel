import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

export default function SIPComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
      {/* Container */}
      <div className="bg-white rounded-3xl border border-gray-100 p-10 md:p-16 max-w-2xl w-full text-center shadow-xl shadow-teal-500/5 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-50 to-[#EBF3FE] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#EBF3FE] to-purple-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/3"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#2B4282] to-[#0fa6b2] rounded-full flex items-center justify-center shadow-lg shadow-[#0fa6b2]/20 mb-8 relative">
            <Clock className="w-10 h-10 text-white absolute" />
            <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-[11px] font-black uppercase tracking-widest mb-4 border border-teal-100 shadow-sm">
            Future Feature
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight mb-4">
            SIP - Pigmy - Daily Savings
          </h1>
          
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2B4282] to-[#0fa6b2] mb-6">
            Coming Soon!
          </h2>

          <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed max-w-lg mb-10">
            We are actively building a powerful new module for managing SIPs, Pigmy, and Daily Savings seamlessly. Stay tuned for updates!
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
