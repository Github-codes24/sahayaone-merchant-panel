import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById, updateClient } from "./clientStore";

export default function LoanDetails() {
  const { id, loanId } = useParams();
  const navigate = useNavigate();
  const client = getClientById(id);
  
  // Find the specific loan
  const loan = client?.loans?.find((l) => l.id === Number(loanId));

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [tenure, setTenure] = useState("");
  const [interest, setInterest] = useState("");
  const [setupPrice, setSetupPrice] = useState(loan ? String(loan.price || 80000) : "80000");

  if (!client || !loan) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loan details not found.{" "}
        <button onClick={() => navigate("/clients")} className="text-[#2B4282] font-bold hover:underline bg-transparent border-none cursor-pointer">
          Go back to Customers
        </button>
      </div>
    );
  }

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (!tenure || !interest) return;

    const priceNum = parseFloat(setupPrice);
    const tenureMonths = parseInt(tenure);
    const interestPercent = parseFloat(interest);

    // Calculate mock EMI
    const totalInterest = (priceNum * (interestPercent / 100) * (tenureMonths / 12));
    const totalPayable = priceNum + totalInterest;
    const emi = Math.round(totalPayable / tenureMonths);

    // Update loan status in store to Active
    const updatedLoans = client.loans.map((l) => {
      if (l.id === loan.id) {
        return {
          ...l,
          status: "Active",
          disbursedOn: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          loanAmount: priceNum,
          outstanding: priceNum,
          emiAmount: emi,
          nextEmiDate: "1st " + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
          percentCompleted: 0,
          emisPaid: 0,
          emisTotal: tenureMonths,
        };
      }
      return l;
    });

    updateClient(client.id, { loans: updatedLoans });
    setShowSetupModal(false);
  };

  // Toggle status for easy simulation on click
  const handleBadgeClick = () => {
    if (loan.status === "New") {
      setShowSetupModal(true);
    } else if (loan.status === "Active") {
      // Transition to Completed
      const updatedLoans = client.loans.map((l) => {
        if (l.id === loan.id) return { ...l, status: "Completed" };
        return l;
      });
      updateClient(client.id, { loans: updatedLoans });
    } else if (loan.status === "Completed") {
      // Transition to Rejected
      const updatedLoans = client.loans.map((l) => {
        if (l.id === loan.id) return { ...l, status: "Rejected" };
        return l;
      });
      updateClient(client.id, { loans: updatedLoans });
    } else if (loan.status === "Rejected") {
      // Transition back to New
      const updatedLoans = client.loans.map((l) => {
        if (l.id === loan.id) return { ...l, status: "New" };
        return l;
      });
      updateClient(client.id, { loans: updatedLoans });
    }
  };

  // Get status color styling matching the Figma screenshots exactly (with rounded-md and correct color borders)
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "New":
        return "border border-[#d1d5db] text-[#374151] bg-[#f9fafb] hover:bg-gray-100";
      case "Active":
        return "border border-[#dfdcfd] text-[#6d5ce8] bg-[#f2f1fe] hover:opacity-90";
      case "Completed":
        return "border border-[#22c55e] text-[#22c55e] bg-white hover:opacity-90";
      case "Rejected":
        return "border border-[#ef4444] text-[#ef4444] bg-[#fff5f5] hover:opacity-90";
      default:
        return "border border-gray-300 text-gray-700 bg-white";
    }
  };

  return (
    <div className="w-full">
      {/* ─── Breadcrumbs & Header ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-[#16221f]">Loan History</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-2">
          <span className="hover:text-teal-650 cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Lead Management</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="hover:text-teal-650 cursor-pointer" onClick={() => navigate("/clients")}>Customers</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="hover:text-teal-650 cursor-pointer" onClick={() => navigate(`/clients/${client.id}/loans`)}>Loan History</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#6d5ce8]">Loan Details</span>
        </div>
      </div>

      <div className="text-sm font-bold text-[#6d5ce8] mb-6">
        Application Number: <span className="underline">{loan.applicationNumber}</span>
      </div>

      {/* ─── Customer Header Card ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {client.avatar ? (
            <img src={client.avatar} alt={client.name} className="w-16 h-16 rounded-full object-cover border-2 border-teal-100 shadow-sm" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 text-2xl font-bold flex items-center justify-center border-2 border-indigo-100 shadow-sm">
              {client.initials || "C"}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">{client.name}</h2>
            <span className="text-xs font-semibold text-gray-500 block mt-1">{client.phone}</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleBadgeClick}
            className={`px-5 py-1.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${getStatusBadgeStyle(loan.status)}`}
            title="Click to toggle or setup status"
          >
            {loan.status}
          </button>
        </div>
      </div>

      {/* ─── Personal Information ─── */}
      <div className="bg-[#f5f4fe] rounded-3xl p-8 mb-6 border border-gray-150/40 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Personal Information</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="font-bold inline-block w-40 text-gray-500">Date Of Birth:</span>
            <span className="font-bold text-gray-800">{client.dob || "10-7-1993"}</span>
          </div>
          <div>
            <span className="font-bold inline-block w-40 text-gray-500">Gender:</span>
            <span className="font-bold text-gray-800">{client.gender || "Male"}</span>
          </div>
          <div>
            <span className="font-bold inline-block w-40 text-gray-500">PAN Number:</span>
            <span className="font-bold text-gray-800 tracking-wider">{client.pan || "ABCDE1234F"}</span>
          </div>
          <div>
            <span className="font-bold inline-block w-40 text-gray-500">Aadhaar Number:</span>
            <span className="font-bold text-gray-800">{client.aadhaar || "1234 5678 9876"}</span>
          </div>
          <div>
            <span className="font-bold inline-block w-40 text-gray-500">Address:</span>
            <span className="font-bold text-gray-800 leading-relaxed">{client.address || "3517 W. Gray St. Utica, India 57867"}</span>
          </div>
        </div>
      </div>

      {/* ─── Documents Card ─── */}
      <div className="bg-[#f5f4fe] rounded-3xl p-8 border border-gray-150/40 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PAN Card Component */}
          <div className="bg-gradient-to-br from-[#A0E2FA] to-[#6EC5E9] rounded-2xl p-6 shadow-md border border-sky-300 relative text-sky-950 overflow-hidden font-serif w-full h-[240px] flex flex-col justify-between">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-900/10 rounded-full blur-lg pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-sky-900/10 pb-3">
              <div className="text-[10px] font-black uppercase leading-tight">
                आयकर विभाग <br />
                <span className="text-[9px] tracking-tight">INCOME TAX DEPARTMENT</span>
              </div>
              
              {/* National Emblem Visual */}
              <div className="flex flex-col items-center">
                <svg width="22" height="28" viewBox="0 0 24 30" fill="none" className="text-amber-800">
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.5-1 3-3 3.5v1.5h-2v-1.5c-2-.5-3-2-3-3.5a4 4 0 0 1 4-4Z" fill="currentColor" opacity="0.8" />
                  <rect x="10" y="12" width="4" height="12" rx="1" fill="currentColor" />
                  <circle cx="12" cy="26" r="2.5" fill="currentColor" />
                </svg>
                <span className="text-[6px] font-bold mt-0.5">सत्यमेव जयते</span>
              </div>

              <div className="text-[10px] font-black text-right uppercase leading-tight">
                भारत सरकार <br />
                <span className="text-[9px] tracking-tight">GOVT. OF INDIA</span>
              </div>
            </div>

            {/* Middle Content */}
            <div className="flex gap-4 items-center my-3 relative z-10">
              {/* User Image Mockup */}
              <div className="w-16 h-20 rounded border border-sky-400 bg-sky-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-sky-300">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 8h16c0-5.33-2.67-8-8-8Z" fill="currentColor" />
                </svg>
              </div>

              {/* PAN Details */}
              <div className="text-[10px] font-bold flex-grow flex flex-col gap-1.5 leading-none">
                <div>
                  <span className="text-[7px] text-sky-850 uppercase block font-semibold">Name</span>
                  <span className="uppercase text-sky-950 font-black">{client.name}</span>
                </div>
                <div>
                  <span className="text-[7px] text-sky-850 uppercase block font-semibold">Father's Name</span>
                  <span className="uppercase text-sky-950 font-black font-serif italic">LATE SH. RAJESH DUTTA</span>
                </div>
                <div>
                  <span className="text-[7px] text-sky-850 uppercase block font-semibold">Date of Birth</span>
                  <span className="text-sky-950 font-black">{client.dob || "10-07-1993"}</span>
                </div>
              </div>

              {/* Hologram Box */}
              <div className="w-10 h-10 rounded border border-sky-300 bg-gradient-to-tr from-yellow-300 via-amber-200 to-green-300 flex-shrink-0 flex items-center justify-center opacity-80">
                <div className="w-6 h-6 rounded-full bg-white/30 blur-xs" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between border-t border-sky-900/10 pt-2.5">
              <div>
                <span className="text-[7px] text-sky-850 uppercase block font-semibold">Permanent Account Number</span>
                <span className="text-xs font-black tracking-wider text-sky-950 font-mono">{client.pan || "ABCDE1234F"}</span>
              </div>
              
              {/* Mock Signature */}
              <div className="flex flex-col items-center">
                <span className="font-serif italic text-xs text-sky-900 opacity-60">{client.name}</span>
                <div className="w-16 h-px bg-sky-900/30 mt-0.5" />
                <span className="text-[5px] text-sky-800 uppercase tracking-widest mt-0.5">Signature</span>
              </div>
            </div>

          </div>

          {/* Aadhaar Card Component */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-emerald-100 relative text-gray-800 overflow-hidden font-sans w-full h-[240px] flex flex-col justify-between">
            {/* Top Bar with National Flag Tricolor Accents */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-white to-emerald-500" />
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-150">
              <div className="flex items-center gap-1.5">
                {/* Indian Emblem Icon */}
                <svg width="14" height="18" viewBox="0 0 24 30" fill="none" className="text-[#0B6623]">
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.5-1 3-3 3.5v1.5h-2v-1.5c-2-.5-3-2-3-3.5a4 4 0 0 1 4-4Z" fill="currentColor" />
                  <rect x="10" y="12" width="4" height="12" rx="1" fill="currentColor" />
                </svg>
                <div className="text-[9px] font-black text-gray-700 leading-tight">
                  भारत सरकार <br />
                  <span className="text-[8px] tracking-tighter text-gray-500 font-semibold">GOVERNMENT OF INDIA</span>
                </div>
              </div>

              {/* Sun Burst Fingerprint Logo Mockup */}
              <div className="flex items-center gap-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.8" />
                </svg>
                <span className="text-[9px] font-black text-red-600">आधार</span>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="flex gap-4 items-center my-2 relative z-10 flex-grow">
              {/* Grayscale Profile Avatar */}
              <div className="w-18 h-20 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 8h16c0-5.33-2.67-8-8-8Z" fill="currentColor" />
                </svg>
              </div>

              {/* Details Column */}
              <div className="text-[10px] font-semibold flex-grow flex flex-col gap-1 leading-normal text-gray-700">
                <div>
                  <span className="text-gray-900 font-bold block text-[11px]">{client.name}</span>
                  <span className="text-[8px] text-gray-400 block font-semibold mt-0.5">DOB: {client.dob || "10-7-1993"}</span>
                  <span className="text-[8px] text-gray-400 block font-semibold">Gender: {client.gender || "Male"}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[8px] text-gray-400 block font-semibold leading-tight">Address:</span>
                  <span className="text-[8.5px] font-normal leading-tight text-gray-600 block">{client.address || "3517 W. Gray St. Utica, India 57867"}</span>
                </div>
              </div>

              {/* QR Barcode Mockup */}
              <div className="w-14 h-14 bg-white border border-gray-200 rounded p-1 flex-shrink-0 flex items-center justify-center shadow-sm">
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="text-gray-800">
                  <rect width="12" height="12" fill="currentColor" />
                  <rect x="34" width="12" height="12" fill="currentColor" />
                  <rect y="34" width="12" height="12" fill="currentColor" />
                  <rect x="5" y="5" width="2" height="2" fill="white" />
                  <rect x="39" y="5" width="2" height="2" fill="white" />
                  <rect x="5" y="39" width="2" height="2" fill="white" />
                  <rect x="18" y="2" width="4" height="4" fill="currentColor" />
                  <rect x="14" y="10" width="6" height="2" fill="currentColor" />
                  <rect x="22" y="16" width="8" height="4" fill="currentColor" />
                  <rect x="8" y="20" width="4" height="8" fill="currentColor" />
                  <rect x="32" y="30" width="10" height="4" fill="currentColor" />
                  <rect x="28" y="38" width="6" height="6" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Bottom Bar: Aadhaar Number Centered */}
            <div className="bg-red-50/50 border-t border-red-100/50 py-2.5 text-center">
              <span className="text-sm font-black text-gray-800 tracking-widest font-mono">
                {client.aadhaar || "1234 5678 9876"}
              </span>
              <span className="block text-[7px] text-red-600 font-bold uppercase tracking-wider mt-0.5">
                मेरा आधार, मेरी पहचान (My Aadhaar, My Identity)
              </span>
            </div>
          </div>

          {/* Cancelled Cheque Component */}
          <div className="bg-gradient-to-br from-[#E2F9F6] to-[#CBEFEE] rounded-2xl p-5 shadow-md border border-[#84DFD8] relative text-[#0d4e49] overflow-hidden font-sans w-full h-[240px] flex flex-col justify-between">
            {/* Watermark diagonal red 'CANCELLED' text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-4xl font-extrabold tracking-[10px] text-red-500/15 uppercase rotate-[-15deg]">
                CANCELLED
              </span>
            </div>

            {/* Cheque Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black block tracking-wider font-sans">HDFC BANK</span>
                <span className="text-[6px] block opacity-85">Bandra West Branch, Mumbai - 400050</span>
              </div>
              <div className="text-right">
                <span className="text-[7px] block font-bold">IFS CODE: HDFC0000042</span>
                <div className="border border-[#84DFD8] bg-white/50 px-2 py-0.5 rounded text-[8px] font-bold mt-1">
                  DATE: 15 / 07 / 2026
                </div>
              </div>
            </div>

            {/* Payee and amount lines */}
            <div className="my-2 space-y-2 text-[9px] relative z-10">
              <div className="flex items-center gap-2 border-b border-[#0d4e49]/20 pb-0.5">
                <span className="font-bold">Pay:</span>
                <span className="font-serif italic font-semibold">{client.name}</span>
              </div>
              <div className="flex items-center gap-2 border-b border-[#0d4e49]/20 pb-0.5">
                <span className="font-bold">Rupees:</span>
                <span className="font-serif italic font-semibold">Rupees Eighty Thousand Only</span>
                <div className="ml-auto border-2 border-[#84DFD8] bg-white px-2 py-0.5 font-black text-sm rounded min-w-[70px] text-center">
                  ₹ 80,000/-
                </div>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="flex items-end justify-between relative z-10">
              <div className="border border-[#84DFD8] bg-white/40 rounded px-2 py-1 min-w-[120px]">
                <span className="text-[6px] block text-gray-500 font-bold uppercase">A/C NO.</span>
                <span className="text-xs font-mono font-bold tracking-wider">50100248967324</span>
              </div>
              
              {/* Authorized Signatory */}
              <div className="text-center min-w-[100px] border-t border-[#0d4e49]/20 pt-1">
                <span className="text-[7px] block font-bold uppercase">Auth. Signatory</span>
              </div>
            </div>

            {/* Cheque Bottom Number Bar */}
            <div className="border-t border-[#0d4e49]/15 pt-2 text-center">
              <span className="text-[10px] font-mono font-bold tracking-[6px] text-gray-600">
                ⑈001234⑈ 110240022⑆ 003212⑈ 31
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* ─── Loan Setup Modal Overlay ─── */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F3F4FC] rounded-none max-w-md w-full p-8 shadow-2xl relative border border-white/50 flex flex-col gap-6 animate-[scaleIn_0.25s_ease]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-850">Loan Setup</h3>
              <button
                onClick={() => setShowSetupModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200/50 text-gray-400 hover:text-gray-700 transition cursor-pointer border-none bg-transparent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Product Summary Box */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&h=120&fit=crop"
                  alt={loan.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-tight">
                <h4 className="text-sm font-black text-gray-800">{loan.productName}</h4>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Black</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{loan.spec || "256 GB ROM, 1 year warranty"}</p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              {/* Product Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Price</label>
                <input
                  type="text"
                  value={`₹${parseFloat(setupPrice).toLocaleString()}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setSetupPrice(val || "0");
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-bold outline-none focus:ring-2 focus:ring-teal-400 transition"
                />
              </div>

              {/* EMI Tenure */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">EMI Tenure (In Month)</label>
                <input
                  type="number"
                  placeholder="Enter month"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  min="1"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition placeholder:text-gray-400"
                />
              </div>

              {/* Interest */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Interest (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  min="0"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition placeholder:text-gray-400"
                />
              </div>

              {/* Slider Line (Figma visual element) */}
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden relative mt-2">
                <div className="w-1/4 h-full bg-[#2B4282] rounded-full" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="flex-1 py-3 rounded-full border-2 border-[#2B4282] hover:bg-teal-50 text-[#2B4282] font-bold text-sm transition cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-bold text-sm rounded-full transition cursor-pointer border-none shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
