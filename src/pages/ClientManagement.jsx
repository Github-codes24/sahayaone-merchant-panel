import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getClients, addClient, updateClient, deleteClient } from "./clientStore";

const PAGE_SIZE = 8;

export default function ClientManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [clients, setClients] = useState(() => getClients());

  // Modal states
  const [selectedClient, setSelectedClient] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editClientData, setEditClientData] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

  // File upload refs
  const createFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
  });
  const [createProfilePreview, setCreateProfilePreview] = useState(null);

  // Search filter
  const filtered = clients.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.gender || !createForm.dob) return;

    addClient({
      name: createForm.name,
      gender: createForm.gender,
      dob: createForm.dob,
      phone: createForm.phone || "9876543210",
      email: createForm.email || "example@mail.com",
      address: createForm.address || "2464 Royal Ln. Mesa, New Delhi 110001",
      registeredOn: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      avatar: createProfilePreview || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      initials: createForm.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      status: "Active",
    });

    setClients(getClients());
    setIsCreating(false);
    // Reset form
    setCreateForm({
      name: "",
      gender: "",
      dob: "",
      phone: "",
      email: "",
      address: "",
    });
    setCreateProfilePreview(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editClientData) return;

    updateClient(editClientData.id, {
      name: editClientData.name,
      gender: editClientData.gender,
      dob: editClientData.dob,
      phone: editClientData.phone,
      email: editClientData.email,
      address: editClientData.address,
      avatar: editClientData.avatar,
    });

    setClients(getClients());
    setEditClientData(null);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      setClients(getClients());
      setClientToDelete(null);
      if (page > Math.ceil((filtered.length - 1) / PAGE_SIZE)) {
        setPage((p) => Math.max(1, p - 1));
      }
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (isEdit) {
      setEditClientData((prev) => ({ ...prev, avatar: url }));
    } else {
      setCreateProfilePreview(url);
    }
  };

  return (
    <div className="w-full">
      {/* ─── Breadcrumbs & Title header ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#16221f]">Customers</h1>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-2">
          <span className="hover:text-teal-600 cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Lead Management</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-teal-600">Customers</span>
        </div>
      </div>

      {/* ─── Table Controls Row ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1 flex-1 max-w-sm relative group">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Search Customers</label>
          <div className="relative w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="customer-search-input"
              type="text"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2B4282] bg-white text-gray-800 placeholder-gray-400 transition"
            />
          </div>
          {/* Custom Instant Tooltip */}
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
            Search by Customer Name, Phone, or Email
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
          </div>
        </div>

        <button
          id="create-customer-btn"
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm text-sm cursor-pointer border-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          + Create Customer
        </button>
      </div>

      {/* ─── Data Table Grid ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                {["Sr.No.", "Customer Name", "Gender", "Date Of Birth", "Phone Number", "Email", "Action"].map((h) => (
                  <th key={h} className="text-left text-[13px] font-bold text-gray-500 px-6 py-4 border-b border-gray-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((client, idx) => (
                <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4.5 text-sm font-semibold text-gray-700">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      {client.avatar ? (
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center border border-indigo-100 flex-shrink-0">
                          {client.initials || "C"}
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-850 whitespace-nowrap">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-sm font-medium text-gray-600">{client.gender || "—"}</td>
                  <td className="px-6 py-4.5 text-sm font-medium text-gray-600">{client.dob || "—"}</td>
                  <td className="px-6 py-4.5 text-sm font-medium text-gray-600">{client.phone || "—"}</td>
                  <td className="px-6 py-4.5 text-sm font-medium text-gray-600">{client.email || "—"}</td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-2">
                      {/* View details (eye) */}
                      <button
                        onClick={() => setSelectedClient(client)}
                        title="View Details"
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition border-none cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditClientData({ ...client })}
                        title="Edit"
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition border-none cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setClientToDelete(client)}
                        title="Delete"
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition border-none cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-gray-400">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Footer ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-teal-500/20 text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer bg-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition ${
                  p === page
                    ? "bg-[#2B4282] text-white"
                    : "border border-teal-500/20 text-teal-600 hover:bg-teal-50 bg-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-teal-500/20 text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer bg-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL: Customer Details Overlay ─── */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F3F4FC] w-full max-w-[480px] rounded-none p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-white/50 animate-[scaleIn_0.25s_ease]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200/50 transition cursor-pointer border-none bg-transparent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Details</h2>

            {/* Profile Row */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-gray-200/50 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {selectedClient.avatar ? (
                    <img src={selectedClient.avatar} alt={selectedClient.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#2B4282]" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 text-lg font-bold flex items-center justify-center border-2 border-indigo-100">
                      {selectedClient.initials || "C"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{selectedClient.name}</h3>
                  <span className="inline-block bg-[#6d5ce8] text-white text-[11px] font-bold px-3 py-0.5 rounded-full mt-1.5">
                    Customer
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedClient(null);
                  navigate(`/clients/${selectedClient.id}/loans`);
                }}
                className="bg-[#2B4282] hover:bg-[#0fa6b2] text-white text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer border-none"
              >
                Loan History
              </button>
            </div>

            {/* Details Cards Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Gender */}
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="text-teal-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400">Gender</span>
                  <span className="text-sm font-bold text-gray-700">{selectedClient.gender || "—"}</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="text-teal-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400">Date Of Birth</span>
                  <span className="text-sm font-bold text-gray-700">{selectedClient.dob || "—"}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="text-teal-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 7.6 7.6l.96-.96a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400">Phone</span>
                  <span className="text-sm font-bold text-gray-700">{selectedClient.phone || "—"}</span>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="text-teal-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400">Email</span>
                  <span className="text-sm font-bold text-gray-700 max-w-[140px] truncate block">{selectedClient.email || "—"}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-gray-100 mb-6">
              <div className="text-teal-500 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-gray-400">Address</span>
                <span className="text-sm font-bold text-gray-700">{selectedClient.address || "—"}</span>
              </div>
            </div>

            <hr className="border-gray-200/50 mb-6" />

            {/* Registered On */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 max-w-[220px]">
              <div className="text-teal-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-gray-400">Registered On</span>
                <span className="text-sm font-bold text-gray-700">{selectedClient.registeredOn || "—"}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL: Create Customer Overlay ─── */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F3F4FC] w-full max-w-[440px] rounded-none p-6 shadow-2xl relative border border-white/50 animate-[scaleIn_0.25s_ease] flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsCreating(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200/50 transition cursor-pointer border-none bg-transparent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Customer</h2>

            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Fields */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-5">
                {/* Profile Placeholder Upload */}
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="relative">
                    {createProfilePreview ? (
                      <img src={createProfilePreview} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-[#2B4282] shadow-md" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md text-gray-300">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                    {/* Camera Button */}
                    <div
                      onClick={() => createFileInputRef.current.click()}
                      className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-[#2B4282] border-2 border-white flex items-center justify-center text-white cursor-pointer shadow hover:opacity-90 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>
                    <input ref={createFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, false)} />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Gender</label>
                  <select
                    required
                    value={createForm.gender}
                    onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Date Of Birth */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date Of Birth</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={createForm.dob}
                      onChange={(e) => setCreateForm({ ...createForm, dob: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                      placeholder="DD/MM/YYYY"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Address</label>
                  <textarea
                    rows="2"
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200/40">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 border-2 border-[#2B4282] hover:bg-teal-50 text-[#2B4282] font-bold rounded-full transition cursor-pointer bg-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-bold rounded-full transition cursor-pointer border-none text-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Edit Customer Overlay ─── */}
      {editClientData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F3F4FC] w-full max-w-[440px] rounded-none p-6 shadow-2xl relative border border-white/50 animate-[scaleIn_0.25s_ease] flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setEditClientData(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200/50 transition cursor-pointer border-none bg-transparent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Customer</h2>

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable fields */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-5">
                {/* Profile Circle */}
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="relative">
                    {editClientData.avatar ? (
                      <img src={editClientData.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-[#2B4282] shadow-md" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 text-3xl font-bold flex items-center justify-center border-4 border-indigo-100 shadow-md">
                        {editClientData.initials || "C"}
                      </div>
                    )}
                    {/* Camera Icon Overlay */}
                    <div
                      onClick={() => editFileInputRef.current.click()}
                      className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-[#2B4282] border-2 border-white flex items-center justify-center text-white cursor-pointer shadow hover:opacity-90 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>
                    <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, true)} />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editClientData.name}
                    onChange={(e) => setEditClientData({ ...editClientData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Gender</label>
                  <select
                    value={editClientData.gender}
                    onChange={(e) => setEditClientData({ ...editClientData, gender: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Date Of Birth */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date Of Birth</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={editClientData.dob}
                      onChange={(e) => setEditClientData({ ...editClientData, dob: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={editClientData.phone}
                    onChange={(e) => setEditClientData({ ...editClientData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editClientData.email}
                    onChange={(e) => setEditClientData({ ...editClientData, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Address</label>
                  <textarea
                    rows="2"
                    value={editClientData.address}
                    onChange={(e) => setEditClientData({ ...editClientData, address: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200/40">
                <button
                  type="button"
                  onClick={() => setEditClientData(null)}
                  className="flex-1 py-3 border-2 border-[#2B4282] hover:bg-teal-50 text-[#2B4282] font-bold rounded-full transition cursor-pointer bg-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-bold rounded-full transition cursor-pointer border-none text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delete Confirmation Overlay ─── */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none p-6 max-w-sm w-full shadow-2xl relative border border-gray-100 animate-[scaleIn_0.22s_ease]">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Customer?</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="font-semibold text-gray-900">{clientToDelete.name}</strong>? This action will permanently remove their records.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setClientToDelete(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 border border-gray-200 rounded-full transition cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-full transition cursor-pointer border-none"
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
