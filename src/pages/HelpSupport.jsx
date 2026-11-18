import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function HelpSupport() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 animate-[wh-slide-up_0.22s_ease]">
      {/* Page Title & Breadcrumbs Bar */}
      <div className="bg-white rounded-2xl border border-[#eef2f1] p-6 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#2B4282] m-0">Help & Support</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <span>Dashboard</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Settings</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
            <span className="text-[#2B4282]">Help & Support</span>
          </div>
        </div>
      </div>

      {/* Subtitle Message */}
      <p className="text-[#4b5563] text-[16px] font-semibold leading-relaxed px-1">
        Don’t hesitate to contact us whether you have a suggestion on our improvement, a complain to discuss or an issue to solve.
      </p>

      {/* Grid / Layout of Support Cards: 2 on top row, 1 centered on bottom row */}
      <div className="flex flex-col gap-6">
        {/* Row 1: Call Us & Email Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Call Us */}
          <div className="bg-[#eefcf5] border border-[#d3f5e5] rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#2B4282] text-white flex items-center justify-center shadow-md shadow-[#2B4282]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span className="text-[#527063] text-sm font-medium mt-1">8080494923</span>
            <h2 className="text-xl font-bold text-[#2B4282] m-0">Call us</h2>
            <div className="flex flex-col text-xs text-gray-500 font-semibold gap-0.5 mt-1">
              <span>Our team is on the line</span>
              <span>Mon-Fri • 10-8</span>
            </div>
          </div>

          {/* Card 2: Email Us */}
          <div className="bg-[#eefcf5] border border-[#d3f5e5] rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#2B4282] text-white flex items-center justify-center shadow-md shadow-[#2B4282]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span className="text-[#527063] text-sm font-medium mt-1">info@advitacredit.in</span>
            <h2 className="text-xl font-bold text-[#2B4282] m-0">Email us</h2>
            <div className="flex flex-col text-xs text-gray-500 font-semibold gap-0.5 mt-1">
              <span>Our team is online</span>
              <span>Mon-Fri • 10-8</span>
            </div>
          </div>
        </div>

        {/* Row 2: Chat With Admin (Centered) */}
        <div className="flex justify-center">
          <div className="w-full md:w-[calc(50%-12px)] bg-[#eefcf5] border border-[#d3f5e5] rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#2B4282] text-white flex items-center justify-center shadow-md shadow-[#2B4282]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-[#527063] text-sm font-medium mt-1">Chat Support</span>
            <h2 className="text-xl font-bold text-[#2B4282] m-0">Chat With Admin</h2>
            <div className="flex flex-col text-xs text-gray-500 font-semibold gap-0.5 mt-1">
              <span>Our team is on the line</span>
              <span>Mon-Fri • 10-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
