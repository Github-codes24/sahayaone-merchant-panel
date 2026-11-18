import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ChevronDown, Table, FileSpreadsheet, FileText } from "lucide-react";
import { getSubscriptionPlans, subscribeSubscriptions, deleteSubscriptionPlan } from "./subscriptionStore";

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState(getSubscriptionPlans());
  
  // Modal Overlay states
  const [selectedViewPlan, setSelectedViewPlan] = useState(null);
  const [selectedDeletePlan, setSelectedDeletePlan] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSubscriptions((updatedPlans) => {
      setPlans(updatedPlans);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = () => {
    if (selectedDeletePlan) {
      deleteSubscriptionPlan(selectedDeletePlan.id);
      setSelectedDeletePlan(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#16221f]">Subscription Management</h1>
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition"
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
          <button 
            onClick={() => navigate("/subscriptions/add")}
            className="flex items-center justify-center gap-2 bg-[#024c47] hover:bg-[#013532] text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors shrink-0"
          >
            <span className="text-base font-bold">+</span> Add Plan
          </button>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-2xl border border-[#eef2f1] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f6f8f8]">
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap w-24">Sr.No.</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Plan Category</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Plan Price</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Plan Validity</th>
                <th className="text-left text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap">Users</th>
                <th className="text-center text-[13px] font-bold text-[#55645f] px-4 py-3.5 border-b border-[#eef2f1] whitespace-nowrap w-36">Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, idx) => (
                <tr key={plan.id} className="border-b border-[#f1f4f3] hover:bg-[#fafcfc] transition-colors">
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{idx + 1}</td>
                  <td className="px-4 py-4 font-semibold text-sm text-[#2c3835]">{plan.category}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{plan.price}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{plan.validity}</td>
                  <td className="px-4 py-4 text-sm text-[#2c3835]">{plan.users}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* View Button */}
                      <button 
                        onClick={() => setSelectedViewPlan(plan)}
                        className="text-[#0f9e8e] hover:text-[#0d8a7c] transition-colors border-none bg-none p-0 cursor-pointer" 
                        aria-label="View plan"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      {/* Edit Button */}
                      <button 
                        onClick={() => navigate(`/subscriptions/${plan.id}/edit`)}
                        className="text-[#0f9e8e] hover:text-[#0d8a7c] transition-colors border-none bg-none p-0 cursor-pointer" 
                        aria-label="Edit plan"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                      {/* Delete Button */}
                      <button 
                        onClick={() => setSelectedDeletePlan(plan)}
                        className="text-[#ef4444] hover:text-[#dc2626] transition-colors border-none bg-none p-0 cursor-pointer" 
                        aria-label="Delete plan"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-[#8a9591]">No plans found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Footer */}
      {plans.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-500">
            Showing <strong>1</strong> to <strong>{plans.length}</strong> of <strong>{plans.length}</strong> Entries
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg border border-[#e0e6e4] bg-white text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-[#0f3d3a] text-white cursor-pointer">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-[#e0e6e4] bg-white text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* View Plan Popup */}
      {selectedViewPlan && (
        <div 
          className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedViewPlan(null)}
        >
          <div 
            className="bg-white rounded-none w-full max-w-[320px] p-6 relative shadow-2xl border-2 border-orange-200 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button in top-right */}
            <button
              onClick={() => setSelectedViewPlan(null)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 border-none cursor-pointer transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Plan Title */}
            <h3 className="text-xl font-extrabold text-[#f97316] leading-none mb-3">
              {selectedViewPlan.category} Plan
            </h3>
            <hr className="border-t border-orange-100 mb-4" />

            {/* Price tag */}
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-2xl font-black text-[#0d9488]">
                {selectedViewPlan.price.replace("₹", "").trim()}/
              </span>
              <span className="text-sm font-bold text-[#0ea5e9]">
                {selectedViewPlan.validity}
              </span>
            </div>

            {/* Include label */}
            <h4 className="text-sm font-extrabold text-[#044e45] mb-2">Include</h4>
            <hr className="border-t border-gray-100 mb-4" />

            {/* Features list */}
            <ul className="space-y-3.5 pl-0 m-0 list-none">
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#55645f]">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#ecfdf5] text-[#10b981] flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                Share Access With {selectedViewPlan.users.match(/\d+/) ? selectedViewPlan.users.match(/\d+/)[0] : "2"} Users
              </li>
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#55645f]">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#ecfdf5] text-[#10b981] flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                24×7 Support
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {selectedDeletePlan && (
        <div 
          className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedDeletePlan(null)}
        >
          <div 
            className="bg-white rounded-none w-full max-w-[360px] p-6 relative shadow-2xl flex flex-col items-center text-center gap-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning header */}
            <h3 className="text-xl font-bold text-[#16221f] m-0">Delete</h3>
            <p className="text-sm font-semibold text-gray-500 m-0 max-w-[240px]">
              Are You Sure Want To Delete This Plan ?
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3 w-full mt-3">
              <button
                onClick={() => setSelectedDeletePlan(null)}
                className="flex-1 bg-white border border-[#024c47] hover:bg-[#f0f5f4] text-[#024c47] rounded-xl py-2 text-sm font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white border-none rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
