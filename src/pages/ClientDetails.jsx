import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "./clientStore";

export default function ClientDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const client = getClientById(id);

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

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      {/* ─── Breadcrumbs & Header ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-indigo-700">Customer Details</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-2">
          <button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 bg-transparent border-none p-0 cursor-pointer">Dashboard</button>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Lead Management</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <button onClick={() => navigate("/clients")} className="hover:text-indigo-600 bg-transparent border-none p-0 cursor-pointer">Customers</button>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-indigo-600">Customer Details</span>
        </div>
      </div>

      {/* ─── Details Main Card ─── */}
      <div className="bg-[#F3F4FC] rounded-3xl p-8 shadow-sm border border-white/50">
        
        {/* Profile Info Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200/50 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {client.avatar ? (
              <img src={client.avatar} alt={client.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#2B4282] shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 text-3xl font-bold flex items-center justify-center border-4 border-indigo-100 shadow-sm">
                {client.initials || client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-gray-850 leading-tight">{client.name}</h2>
              <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mt-2">
                Customer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/clients/${client.id}/edit`)}
              className="bg-white hover:bg-gray-150 text-indigo-600 border border-indigo-200 text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer"
            >
              Edit Details
            </button>
            <button
              onClick={() => navigate(`/clients/${client.id}/loans`)}
              className="bg-[#2B4282] hover:bg-[#0fa6b2] text-white text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer border-none"
            >
              Loan History
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Gender */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-3 border border-gray-100">
            <div className="text-teal-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400">Gender</span>
              <span className="text-base font-extrabold text-gray-700">{client.gender || "—"}</span>
            </div>
          </div>

          {/* Date Of Birth */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-3 border border-gray-100">
            <div className="text-teal-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400">Date Of Birth</span>
              <span className="text-base font-extrabold text-gray-700">{client.dob || "—"}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-3 border border-gray-100">
            <div className="text-teal-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 7.6 7.6l.96-.96a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400">Phone</span>
              <span className="text-base font-extrabold text-gray-700">{client.phone || "—"}</span>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-3 border border-gray-100">
            <div className="text-teal-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400">Email</span>
              <span className="text-base font-extrabold text-gray-700">{client.email || "—"}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-5 flex items-start gap-3 border border-gray-100 mb-6">
          <div className="text-teal-500 mt-0.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400">Address</span>
            <span className="text-base font-extrabold text-gray-700">{client.address || "—"}</span>
          </div>
        </div>

        <hr className="border-gray-200/50 mb-6" />

        {/* Registered On */}
        <div className="bg-white rounded-2xl p-5 flex items-center gap-3 border border-gray-100 max-w-sm">
          <div className="text-teal-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400">Registered On</span>
            <span className="text-base font-extrabold text-gray-700">{client.registeredOn || "—"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
