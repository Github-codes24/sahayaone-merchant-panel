import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  Eye,
  Trash2,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  X,
  ArrowLeft,
  Upload,
  ChevronDown,
  Table,
  FileSpreadsheet,
  FileText,
  Landmark,
  Store
} from "lucide-react";

import { deleteLead } from "./leadsStore";
import { leadService } from "../services/leadService";

// Helper function to format date properly
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const d = date.getDate();
  const m = date.toLocaleString('default', { month: 'short' });
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const h = String(hours).padStart(2, '0');
  
  return (
    <div className="flex flex-col items-center justify-center whitespace-nowrap gap-0.5">
      <span className="text-[13px] font-semibold text-gray-800 leading-none">{`${d}/${m}/${y}`}</span>
      <span className="text-[13px] text-gray-500 font-medium leading-none">{`${h}:${minutes} ${ampm}`}</span>
    </div>
  );
};

export default function MerchantLeads() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlStatus = searchParams.get("status") || "";
  const urlSearch = searchParams.get("search") || "";
  const urlStartDate = searchParams.get("startDate") || "";
  const urlEndDate = searchParams.get("endDate") || "";

  // 1. State Management & Data
  const urlSource = "MERCHANT";
  const currentView = "list";
  const [leads, setLeads] = useState([]);
  const [metaState, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, totalRecords: 0 });
  const [statsState, setStats] = useState({ totalLeads: 0, newLeads: 0, pendingLeads: 0, activeLeads: 0, completedLeads: 0, rejectedLeads: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const stats = statsState;
  const meta = metaState;

  // Search Debouncing
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchInput) params.set("search", searchInput);
      else params.delete("search");
      if (params.get("search") !== (searchParams.get("search") || null)) {
        params.set("page", "1");
        setSearchParams(params);
      }
    }, 5);
    return () => clearTimeout(handler);
  }, [searchInput, searchParams, setSearchParams]);

  useEffect(() => {
    fetchLeads(urlStatus || "ALL", urlPage, 10, {
      search: urlSearch,
      startDate: urlStartDate,
      endDate: urlEndDate,
      source: urlSource || "BRANCH"
    });
  }, [urlPage, urlStatus, urlSearch, urlStartDate, urlEndDate, urlSource]);

  const getVisiblePages = (current, total) => {
    if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
    if (current === 1) return [1, 2, 3];
    if (current === total) return [total - 2, total - 1, total];
    return [current - 1, current, current + 1];
  };



  async function fetchLeads(status = "ALL", page = 1, limit = 10, filters = {}) {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads(status, page, limit, filters);
      if (response && response.data) {
        setLeads(response.data || []);
        
        if (response.stats) {
          setStats(response.stats);
        } else {
          setStats({ totalLeads: 0, newLeads: 0, pendingLeads: 0, activeLeads: 0, completedLeads: 0, rejectedLeads: 0 });
        }
        
        if (response.pagination) {
          setMeta(response.pagination);
        } else {
          setMeta({ page: 1, limit: 10, totalPages: 1, totalRecords: 0 });
        }
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
      setLeads([]);
      setStats({ totalLeads: 0, newLeads: 0, pendingLeads: 0, activeLeads: 0, completedLeads: 0, rejectedLeads: 0 });
      setMeta({ page: 1, limit: 10, totalPages: 1, totalRecords: 0 });
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLeads = leads;

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) params.set(key, value);
    else params.delete(key);

    params.set("page", "1");
    setSearchParams(params);
  };

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("status");
    params.delete("startDate");
    params.delete("endDate");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  // Status Badge Component
  const renderStatusBadge = (status) => {
    switch (status) {
      case "New":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-md border border-gray-300 bg-gray-100 text-gray-700 inline-block text-center min-w-[85px]">
            New
          </span>
        );
      case "Active":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-md border border-purple-300 bg-purple-100 text-purple-700 inline-block text-center min-w-[85px]">
            Active
          </span>
        );
      case "Completed":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-md border border-green-300 bg-green-100 text-green-700 inline-block text-center min-w-[85px]">
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-md border border-red-300 bg-red-100 text-red-700 inline-block text-center min-w-[85px]">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-md border border-gray-300 bg-gray-100 text-gray-700 inline-block text-center min-w-[85px]">
            {status}
          </span>
        );
    }
  };

  const handleDeleteLead = (id) => {
    deleteLead(id);
    fetchLeads();
    setDeleteTarget(null);
  };

  const handleViewLeadDetails = (lead) => {
    navigate(`/leads/merchant/view/${lead.loanId || lead.id || lead.leadId || lead._id}`);
  };

  return (
    <div className="w-full font-sans">

      {/* ─── LAYOUT 1: LEADS LIST VIEW ─── */}
      {currentView === "list" && (
        <div className="flex flex-col gap-2">
          
          {/* Breadcrumb Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-[#2B4282] m-0 mb-1">Leads ({urlSource === 'MERCHANT' ? 'Merchant' : 'Branch'})</h1>
              <p className="text-[13px] font-medium text-gray-500 m-0">
                Dashboard &gt; Lead Management &gt; <span className="text-[#2B4282] font-semibold">Leads</span>
              </p>
            </div>
          </div>

          {/* Stats Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: "Total Leads", filterValue: "", value: stats.totalLeads, color: "text-[#2B4282]", bg: "bg-blue-50/50 border-blue-100" },
              { label: "New Leads", filterValue: "New", value: stats.newLeads, color: "text-blue-600", bg: "bg-sky-50/50 border-sky-100" },
              { label: "Pending", filterValue: "Pending", value: stats.pendingLeads, color: "text-orange-600", bg: "bg-orange-50/50 border-orange-100" },
              { label: "Active", filterValue: "Active", value: stats.activeLeads, color: "text-purple-600", bg: "bg-purple-50/50 border-purple-100" },
              { label: "Completed", filterValue: "Completed", value: stats.completedLeads, color: "text-green-600", bg: "bg-green-50/50 border-green-100" },
              { label: "Rejected", filterValue: "Rejected", value: stats.rejectedLeads, color: "text-red-600", bg: "bg-red-50/50 border-red-100" },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                onClick={() => handleFilterChange("status", stat.filterValue)}
                className={`border rounded-xl py-1.5 px-2 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow ${stat.bg}`}
              >
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value || 0}</div>
                <div className="text-[11px] font-bold text-gray-700 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>



          {/* Toolbar */}
          <div className="flex flex-col gap-2.5">
            
            {/* Top Row: All Inputs in One Line */}
            <div className="flex flex-wrap xl:flex-row justify-between items-end gap-3 w-full pb-1">
              
              {/* Left & Middle: Search + Filters */}
              <div className="flex flex-nowrap items-end gap-2 xl:gap-3 flex-1 min-w-max">
                
                {/* Search input */}
                <div className="flex flex-col gap-1 w-56 shrink-0 relative group">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Search Leads</label>
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Customer name, Phone..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-800 outline-none focus:border-[#2B4282] transition placeholder:text-xs"
                    />
                    {searchInput && (
                      <button onClick={() => setSearchInput("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer flex items-center">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {/* Custom Instant Tooltip */}
                  <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
                    Search by Customer Name or Phone Number
                    <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="flex flex-col gap-1 w-32 shrink-0 relative group">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Status</label>
                  <select
                    value={urlStatus}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 outline-none focus:border-[#2B4282] cursor-pointer truncate"
                  >
                    <option value="">All</option>
                    <option value="New">New</option>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  {/* Custom Instant Tooltip */}
                  <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
                    Filter leads by Current Status
                    <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
                  </div>
                </div>

                {/* Date Pickers */}
                <div className="flex flex-col gap-1 w-32 shrink-0 relative group">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Start Date</label>
                  <input 
                    type="date" 
                    value={urlStartDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 outline-none focus:border-[#2B4282] cursor-pointer"
                  />
                  {/* Custom Instant Tooltip */}
                  <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
                    Filter leads starting from this Date
                    <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 w-32 shrink-0 relative group">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">End Date</label>
                  <input 
                    type="date" 
                    value={urlEndDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 outline-none focus:border-[#2B4282] cursor-pointer"
                  />
                  {/* Custom Instant Tooltip */}
                  <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
                    Filter leads up to this date
                    <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </div>

              {/* Right: Export & Create Lead Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Export Dropdown */}
                <div className="relative shrink-0">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Upload className="w-4 h-4 text-gray-700" />
                    <span>Export</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-gray-700 transition-transform" />
                  </button>
                  {/* Dropdown Menu */}
                  {isExportOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-50 py-2 flex flex-col">
                      <button 
                        onClick={() => setIsExportOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-[#2B4282] border-none bg-transparent cursor-pointer font-medium transition-colors flex items-center gap-3"
                      >
                        <Table className="w-4 h-4 text-green-600" />
                        Export to CSV
                      </button>
                      <button 
                        onClick={() => setIsExportOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-[#2B4282] border-none bg-transparent cursor-pointer font-medium transition-colors flex items-center gap-3"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        Export to Excel
                      </button>
                      <button 
                        onClick={() => setIsExportOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-[#2B4282] border-none bg-transparent cursor-pointer font-medium transition-colors flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4 text-red-600" />
                        Export to PDF
                      </button>
                    </div>
                  )}
                </div>

                {/* Create Lead Button */}
                <button
                  onClick={() => navigate("/leads/merchant/add")}
                  className="shrink-0 bg-[#2B4282] hover:bg-[#1E356A] text-white rounded-full px-5 py-2 text-sm font-semibold border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Lead</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Applied Filter Chips */}
            {(urlSearch || urlStatus || urlStartDate || urlEndDate) && (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {urlSearch && (
                  <div className="flex items-center gap-1 bg-[#e0f2fe] border border-[#bae6fd] text-[#0369a1] px-2.5 py-1 rounded-full text-xs font-bold">
                    <span>Search: {urlSearch}</span>
                    <button onClick={() => { setSearchInput(""); removeFilter("search"); }} className="hover:text-[#0c4a6e] border-none bg-transparent p-0 cursor-pointer flex items-center"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {urlStatus && urlStatus.split(",").map(st => (
                  <div key={st} className="flex items-center gap-1 bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] px-2.5 py-1 rounded-full text-xs font-bold">
                    <span>Status: {st}</span>
                    <button onClick={() => {
                        const newStatus = urlStatus.split(",").filter(s => s !== st).join(",");
                        const params = new URLSearchParams(searchParams);
                        if (newStatus) params.set("status", newStatus); else params.delete("status");
                        params.set("page", "1");
                        setSearchParams(params);
                    }} className="hover:text-black border-none bg-transparent p-0 cursor-pointer flex items-center"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                {urlStartDate && (
                  <div className="flex items-center gap-1 bg-[#f3e8ff] border border-[#e9d5ff] text-[#7e22ce] px-2.5 py-1 rounded-full text-xs font-bold">
                    <span>From: {urlStartDate}</span>
                    <button onClick={() => removeFilter("startDate")} className="hover:text-[#581c87] border-none bg-transparent p-0 cursor-pointer flex items-center"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {urlEndDate && (
                  <div className="flex items-center gap-1 bg-[#f3e8ff] border border-[#e9d5ff] text-[#7e22ce] px-2.5 py-1 rounded-full text-xs font-bold">
                    <span>To: {urlEndDate}</span>
                    <button onClick={() => removeFilter("endDate")} className="hover:text-[#581c87] border-none bg-transparent p-0 cursor-pointer flex items-center"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                
                <button onClick={clearAllFilters} className="text-xs font-bold text-red-500 hover:text-red-700 underline decoration-red-500/30 underline-offset-2 border-none bg-transparent p-0 cursor-pointer ml-1">
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 mt-2 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[900px]">
                <thead>
                  <tr className="bg-[#f4f5fa] border-b border-gray-200">
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider w-16 text-center">Sr.No.</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Application Number</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Customer Name</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Phone Number</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Address</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Price (MRP / Selling)</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Down-payment</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Balance</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Status</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Date & Time</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead.loanId || lead._id || lead.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-sm font-medium text-gray-600 text-center">{(meta.page - 1) * meta.limit + index + 1}</td>
                      <td className="py-2.5 px-3 text-sm font-semibold text-gray-700">{lead.applicationId || "N/A"}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-3">
                          {(lead.customerDetails?.livePhoto || lead.avatar) ? (
                            <img
                              src={lead.customerDetails?.livePhoto || lead.avatar}
                              alt={lead.customerDetails?.fullName || lead.customer?.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center border border-gray-300">
                              {(lead.customerDetails?.fullName || lead.customer?.fullName || "A").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-bold text-gray-800">{lead.customerDetails?.fullName || lead.customer?.fullName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-sm text-gray-700 font-medium">{lead.customerDetails?.phoneNumber || lead.customer?.phoneNumber || "N/A"}</td>
                      <td className="py-2.5 px-3 text-sm text-gray-600 max-w-[220px] truncate" title={lead.customerDetails?.address || lead.customer?.address || lead.address}>
                        {lead.customerDetails?.address || lead.customer?.address || lead.address || "N/A"}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-right">
                        <div className="flex flex-col items-end gap-0.5 justify-center">
                          <span className="text-gray-400 line-through text-[11px] font-semibold leading-none">₹{lead.mrp || lead.loanAmount || 0}</span>
                          <span className="text-green-600 font-bold text-[13px] leading-none">₹{lead.financialDetails?.productPrice || lead.sellingPrice || lead.loanAmount || 0}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-sm font-semibold text-gray-700 text-right">
                        ₹{lead.financialDetails?.downPayment || lead.downPayment || lead.downPaymentAmount || 0}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-semibold text-red-600 text-right">
                        ₹{lead.financialDetails?.totalLoanAmount || lead.outstandingAmount || lead.balance || 0}
                      </td>
                      <td className="py-2.5 px-3 text-center">{renderStatusBadge(lead.status)}</td>
                      <td className="py-2.5 px-3 text-center">{formatDateTime(lead.createdAt || new Date())}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleViewLeadDetails(lead)}
                            className="text-gray-500 hover:text-blue-600 p-1 border-none bg-transparent cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(lead)}
                            className="text-red-500 hover:text-red-700 p-1 border-none bg-transparent cursor-pointer transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Loading leads..." : "No leads found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            <span className="text-sm font-medium text-gray-600">
              Showing {meta.totalRecords === 0 ? 0 : (meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.totalRecords)} of {meta.totalRecords} Entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={meta.page <= 1}
                onClick={() => handlePageChange(1)}
                className="w-8 h-8 rounded-full border border-[#2B4282] text-[#2B4282] bg-white flex items-center justify-center hover:bg-[#EBF3FE] cursor-pointer border-solid disabled:opacity-50 disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button 
                disabled={meta.page <= 1}
                onClick={() => handlePageChange(meta.page - 1)}
                className="w-8 h-8 rounded-full border border-[#2B4282] text-[#2B4282] bg-white flex items-center justify-center hover:bg-[#EBF3FE] cursor-pointer border-solid disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {getVisiblePages(meta.page, meta.totalPages).map(p => (
                <button 
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-full border font-bold text-xs flex items-center justify-center cursor-pointer border-solid shadow-xs ${
                    meta.page === p 
                      ? 'bg-[#2B4282] text-white border-[#2B4282]' 
                      : 'border-[#2B4282] text-[#2B4282] bg-white hover:bg-[#EBF3FE]'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button 
                disabled={meta.page >= meta.totalPages}
                onClick={() => handlePageChange(meta.page + 1)}
                className="w-8 h-8 rounded-full border border-[#2B4282] text-[#2B4282] bg-white flex items-center justify-center hover:bg-[#EBF3FE] cursor-pointer border-solid disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                disabled={meta.page >= meta.totalPages}
                onClick={() => handlePageChange(meta.totalPages)}
                className="w-8 h-8 rounded-full border border-[#2B4282] text-[#2B4282] bg-white flex items-center justify-center hover:bg-[#EBF3FE] cursor-pointer border-solid disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}




      {/* ─── Delete Confirm Modal ─── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none p-6 max-w-sm w-full shadow-2xl border border-gray-200 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Lead</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete lead <span className="font-bold text-gray-900">{deleteTarget.customer?.fullName}</span>?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 px-4 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLead(deleteTarget.id)}
                className="flex-1 py-2 px-4 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 border-none cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
