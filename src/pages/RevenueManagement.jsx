import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_TRANSACTIONS = [
  { id: 1, txnId: "#45784648...", clientName: "Jack", plan: "Silver", amount: "₹ 2999", sellBy: "Arely Melton" },
  { id: 2, txnId: "#45784648...", clientName: "John Doe", plan: "Gold", amount: "₹ 3999", sellBy: "Jane Cooper" },
  { id: 3, txnId: "#45784648...", clientName: "Alex", plan: "Platinum", amount: "₹ 4999", sellBy: "Jada Weeks" },
  { id: 4, txnId: "#45784648...", clientName: "Jada Weeks", plan: "Gold", amount: "₹ 3999", sellBy: "Virginia Carroll" },
  { id: 5, txnId: "#45784648...", clientName: "Ron William", plan: "Gold", amount: "₹ 3999", sellBy: "Myah Davila" },
  { id: 6, txnId: "#45784648...", clientName: "Tony Stark", plan: "Silver", amount: "₹ 2999", sellBy: "Rosa Hurley" },
  { id: 7, txnId: "#45784648...", clientName: "Jane Cooper", plan: "Platinum", amount: "₹ 4999", sellBy: "Maeve Hodges" },
  { id: 8, txnId: "#45784648...", clientName: "Carol Danvers", plan: "Gold", amount: "₹ 3999", sellBy: "Rosa Hurley" },
  { id: 9, txnId: "#45784648...", clientName: "Paula Irving", plan: "Free", amount: "₹ 0", sellBy: "System" },
  { id: 10, txnId: "#45784648...", clientName: "Karen Starr", plan: "Platinum", amount: "₹ 4999", sellBy: "Arely Melton" },
  { id: 11, txnId: "#45784648...", clientName: "Lois Lane", plan: "Silver", amount: "₹ 2999", sellBy: "Jane Cooper" },
  { id: 12, txnId: "#45784648...", clientName: "Pepper Potts", plan: "Gold", amount: "₹ 3999", sellBy: "Jada Weeks" },
];

export default function RevenueManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter logic
  const filteredTxns = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((t) => {
      return (
        t.clientName.toLowerCase().includes(search.toLowerCase()) ||
        t.plan.toLowerCase().includes(search.toLowerCase()) ||
        t.sellBy.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  // Pagination logic
  const totalEntries = filteredTxns.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const paginatedTxns = useMemo(() => {
    return filteredTxns.slice(startIndex, endIndex);
  }, [filteredTxns, startIndex, endIndex]);

  return (
    <div className="w-full space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#16221f]">Revenue Management</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="rounded-2xl p-6 text-white flex flex-col gap-6 bg-gradient-to-br from-[#b48a62] to-[#8c6742] shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/90">Total Revenue</span>
            <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20a6 6 0 0 1-12 0c0-3 1.5-5 3-6V9a3 3 0 0 1 6 0v5c1.5 1 3 3 3 6z" />
                <path d="M9 10h6" />
                <circle cx="12" cy="16" r="2" />
                <path d="M12 14.5v3" />
              </svg>
            </span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-[28px] font-extrabold block">₹2,96,780</span>
            <div className="flex justify-between items-center text-xs font-semibold text-white/80">
              <span>This Month</span>
              <span className="bg-white text-[#22c55e] rounded-full px-2 py-0.5 flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                +7.7 %
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue From Online */}
        <div className="rounded-2xl p-6 text-white flex flex-col gap-6 bg-gradient-to-br from-[#06b6d4] to-[#0891b2] shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/90">Revenue From Online</span>
            <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M15 9h-4.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H9" />
              </svg>
            </span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-[28px] font-extrabold block">₹96,780</span>
            <div className="flex justify-between items-center text-xs font-semibold text-white/80">
              <span>This Month</span>
              <span className="bg-white text-[#22c55e] rounded-full px-2 py-0.5 flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                +7.7 %
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Revenue From Telecaller */}
        <div className="rounded-2xl p-6 text-white flex flex-col gap-6 bg-gradient-to-br from-[#a855f7] to-[#9333ea] shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/90">Revenue From Telecaller</span>
            <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 10v4M19 12h6" />
              </svg>
            </span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-[28px] font-extrabold block">₹96,780</span>
            <div className="flex justify-between items-center text-xs font-semibold text-white/80">
              <span>This Month</span>
              <span className="bg-white text-[#22c55e] rounded-full px-2 py-0.5 flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                +7.7 %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search input */}
      <div className="flex flex-col gap-1 w-full max-w-xs relative group">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Search Revenue</label>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by client or plan..."
            className="w-full pl-10 pr-4 py-2 border border-[#e0e6e4] rounded-lg text-sm bg-white outline-none focus:border-[#0f9e8e] transition-colors"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {/* Custom Instant Tooltip */}
        <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
          Search by Client Name or Plan Type
          <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-2xl border border-[#eef2f1] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#f6f8f8]">
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap w-20">Sr.No.</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Transaction ID</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Client Name</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Plan</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Amount</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Sell By</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap w-28">Status</th>
                <th className="text-center text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTxns.map((item, idx) => (
                <tr key={item.id} className="border-b border-[#f1f4f3] hover:bg-[#fafcfc] transition-colors">
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{startIndex + idx + 1}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{item.txnId}</td>
                  <td className="px-4 py-4 font-semibold text-sm text-[#2c3835]">{item.clientName}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{item.plan}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{item.amount}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{item.sellBy}</td>
                  <td className="px-4 py-4">
                    <span className="inline-block bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0] rounded-lg px-2.5 py-1 text-xs font-bold">
                      Successful
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => navigate(`/revenue/${item.id}`)}
                      className="text-[#0f9e8e] hover:text-[#0d8a7c] transition-colors border-none bg-none p-0 cursor-pointer" 
                      aria-label="View transaction details"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedTxns.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-[#8a9591]">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Footer */}
      {totalEntries > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-500">
            Showing <strong>{startIndex + 1}</strong> to <strong>{endIndex}</strong> of <strong>{totalEntries}</strong> Entries
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="w-8 h-8 rounded-lg border border-[#e0e6e4] bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-[#0f3d3a] text-white"
                    : "border border-[#e0e6e4] bg-white text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="w-8 h-8 rounded-lg border border-[#e0e6e4] bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
