import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById } from "./clientStore";

export default function ClientLoans() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = getClientById(id);
  const [activeTab, setActiveTab] = useState("All");

  if (!client) {
    return (
      <div className="p-8 text-center text-gray-500">
        Customer not found.{" "}
        <button onClick={() => navigate("/clients")} className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
          Go back to Customers
        </button>
      </div>
    );
  }

  // Filter loans based on active tab
  const filteredLoans = client.loans.filter((loan) => {
    if (activeTab === "All") return true;
    if (activeTab === "New Application") return loan.status === "New";
    if (activeTab === "Active Loans") return loan.status === "Active";
    if (activeTab === "Completed Loans") return loan.status === "Completed";
    if (activeTab === "Rejected Applications") return loan.status === "Rejected";
    return true;
  });

  return (
    <div className="w-full">
      {/* ─── Breadcrumbs & Header Title ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-[#16221f]">Loan History</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-2">
          <span className="hover:text-teal-600 cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Lead Management</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="hover:text-teal-600 cursor-pointer" onClick={() => navigate("/clients")}>Customers</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-teal-600">Loan History</span>
        </div>
      </div>

      {/* ─── Outstanding Overview Card ─── */}
      <div className="bg-[#eaf9f5] border border-teal-100 rounded-3xl p-8 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-5 relative z-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Total Outstanding</span>
            <h2 className="text-4xl font-extrabold text-[#5150e4] mt-1">₹51,500</h2>
            <span className="inline-block bg-[#2B4282] text-white text-[11px] font-extrabold px-3 py-1 rounded-full mt-2 shadow-sm">
              2 Active Loans
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Loan Amount</span>
            <p className="text-xl font-bold text-gray-800 mt-0.5">₹1,03,000</p>
          </div>
        </div>

        {/* Custom High-Fidelity SVG Wallet Illustration */}
        <div className="w-[180px] h-[140px] flex items-center justify-center flex-shrink-0 relative z-10">
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            {/* Green Dollar Bills */}
            <rect x="35" y="10" width="70" height="50" rx="4" transform="rotate(-12 35 10)" fill="#4ADE80" stroke="#22C55E" strokeWidth="2" />
            <path d="M40 32C46 31 52 35 55 41" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
            <rect x="55" y="8" width="70" height="50" rx="4" transform="rotate(-4 55 8)" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
            <circle cx="90" cy="33" r="8" fill="#15803D" opacity="0.3" />

            {/* Wallet Back Panel */}
            <rect x="30" y="45" width="120" height="80" rx="16" fill="#4b3be3" />

            {/* Wallet Front Panel flap */}
            <path d="M30 65C30 53.9543 38.9543 45 50 45H130C141.046 45 150 53.9543 150 65V109C150 120.046 141.046 129 130 129H50C38.9543 129 30 120.046 30 109V65Z" fill="#6d5ce8" />
            <path d="M120 70H150V95H120C113.373 95 108 89.6274 108 83C108 76.3726 113.373 70 120 70Z" fill="#4b3be3" />

            {/* Snap Button */}
            <circle cx="122" cy="82.5" r="7.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="122" cy="82.5" r="3" fill="#D97706" />

            {/* Gold Coins in front */}
            <circle cx="28" cy="115" r="16" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="28" cy="115" r="11" fill="#F59E0B" />
            <path d="M28 108V122M25 111H31" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />

            <circle cx="48" cy="120" r="16" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="48" cy="120" r="11" fill="#D97706" />
            <path d="M48 113V127M45 116H51" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ─── Segmented Tabs ─── */}
      <div className="bg-[#EEF0FA] rounded-2xl p-1.5 mb-6 flex flex-wrap gap-1 shadow-inner max-w-fit">
        {["All", "New Application", "Active Loans", "Completed Loans", "Rejected Applications"].map((tab) => {
          const isActive = activeTab === (tab === "All" ? "All" : tab);
          return (
            <button
              key={tab}
              id={`loan-tab-${tab.replace(/\s+/g, "").toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                isActive
                  ? "bg-[#2B4282] text-white shadow-md"
                  : "text-gray-600 hover:text-indigo-650 hover:bg-white/40"
              }`}
            >
              {tab === "All" ? "All Loans" : tab}
            </button>
          );
        })}
      </div>

      {/* ─── Loan List Cards ─── */}
      <div className="flex flex-col gap-4">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => {
            const isActive = loan.status === "Active";
            return (
              <div
                key={loan.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-6"
              >
                {/* Upper row: thumbnail and primary description */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Device Thumbnail Mockup (Green Phone) */}
                    <div className="w-16 h-16 rounded-2xl bg-[#EEFDF6] border border-[#d2f4e3] flex items-center justify-center flex-shrink-0 p-1.5">
                      <svg width="42" height="54" viewBox="0 0 42 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="38" height="50" rx="8" fill="#FFFFFF" stroke="#34D399" strokeWidth="2.5" />
                        <rect x="5" y="5" width="32" height="40" rx="5" fill="#34D399" />
                        <rect x="16" y="2.5" width="10" height="1.5" rx="0.75" fill="#34D399" />
                        <circle cx="12" cy="3.25" r="0.75" fill="#34D399" />
                        <path d="M12 28L18 20L25 27L30 22L34 29" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-400">
                        Application Number: <span className="text-gray-500 font-semibold">{loan.applicationNumber}</span>
                      </span>
                      <h3 className="text-base font-extrabold text-gray-800 mt-0.5">{loan.productName}</h3>
                      <span className="text-xs font-medium text-gray-500">
                        {isActive ? `Disbursed On: ${loan.disbursedOn}` : `Applied On: ${loan.appliedOn}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-lg text-xs font-bold border ${
                      loan.status === "New"
                        ? "bg-white text-gray-755 border-gray-300"
                        : loan.status === "Active"
                        ? "bg-[#f2f1fe] text-[#6d5ce8] border-[#dfdcfd]"
                        : loan.status === "Completed"
                        ? "bg-[#eafaf1] text-[#22c55e] border-[#d1f5e0]"
                        : "bg-[#fdf2f2] text-[#ef4444] border-[#fcd4d4]"
                    }`}>
                      {loan.status}
                    </span>

                    <button
                      id={`view-details-loan-${loan.id}`}
                      onClick={() => navigate(`/clients/${id}/loans/${loan.id}`)}
                      className="text-[#2B4282] hover:text-[#0fa6b2] font-bold text-sm bg-transparent border-none cursor-pointer hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Lower row details if active loan */}
                {isActive && (
                  <div className="border-t border-gray-100 pt-6">
                    {/* Key stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Loan Amount</span>
                        <span className="text-base font-extrabold text-gray-850">₹{loan.loanAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Outstanding</span>
                        <span className="text-base font-extrabold text-gray-850">₹{loan.outstanding.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">EMI Amount</span>
                        <span className="text-base font-extrabold text-gray-850">₹{loan.emiAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Next EMI Due Date</span>
                        <span className="text-base font-extrabold text-gray-850">{loan.nextEmiDate}</span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>Loan Progress</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#6d5ce8]">{loan.percentCompleted}% Completed</span>
                          <span className="text-gray-400">|</span>
                          <span>{loan.emisPaid} of {loan.emisTotal} EMI's paid</span>
                        </div>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6d5ce8] rounded-full transition-all duration-500"
                          style={{ width: `${loan.percentCompleted}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-sm font-semibold text-gray-400 shadow-sm">
            No loans found matching the status "{activeTab === "All" ? "All Loans" : activeTab}".
          </div>
        )}
      </div>
    </div>
  );
}
