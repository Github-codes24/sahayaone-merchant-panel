import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const MOCK_TRANSACTIONS = [
  { id: 1, txnId: "#478215485468976", clientName: "Jack", plan: "Silver", price: "₹ 2999", sellBy: "Arely Melton", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
  { id: 2, txnId: "#478215485468976", clientName: "John Doe", plan: "Gold", price: "₹ 3999", sellBy: "Jane Cooper", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
  { id: 3, txnId: "#478215485468976", clientName: "Alex", plan: "Platinum", price: "₹ 4999", sellBy: "Jada Weeks", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
  { id: 4, txnId: "#478215485468976", clientName: "Jada Weeks", plan: "Gold", price: "₹ 3999", sellBy: "Virginia Carroll", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
  { id: 5, txnId: "#478215485468976", clientName: "Ron William", plan: "Gold", price: "₹ 3999", sellBy: "Myah Davila", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
  { id: 6, txnId: "#478215485468976", clientName: "Tony Stark", plan: "Silver", price: "₹ 2999", sellBy: "Rosa Hurley", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
  { id: 7, txnId: "#478215485468976", clientName: "Jane Cooper", plan: "Platinum", price: "₹ 4999", sellBy: "Maeve Hodges", phone: "9854665512", email: "Example@gmail.com", date: "February , 24 2026 , 10:00 AM", validity: "3 Month" },
];

export default function PaymentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find dynamic details matching id
  const record = MOCK_TRANSACTIONS.find((t) => t.id === parseInt(id)) || MOCK_TRANSACTIONS[0];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/revenue")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#2B4282] text-[13px] font-bold rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-[#16221f]">Payment Details</h1>
      </div>

      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl border border-[#eef2f1] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 relative">
        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-[#f4f7f6] border border-[#eef2f1] p-1 flex items-center justify-center">
          <img src={`https://i.pravatar.cc/128?img=${record.id + 40}`} alt={record.clientName} className="w-full h-full rounded-full object-cover" />
        </div>

        <div className="flex-1 space-y-2.5">
          <h2 className="text-2xl font-bold text-[#0f9e8e] leading-none">{record.clientName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#55645f]">
            <div className="flex gap-2">
              <span className="font-semibold text-[#2c3835] min-w-[120px]">Phone Number :</span>
              <span>{record.phone}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-[#2c3835] min-w-[120px]">Email Id :</span>
              <span>{record.email}</span>
            </div>
          </div>
        </div>

        {/* Status Pill in top right */}
        <div className="absolute top-6 right-6">
          <span className="inline-block bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0] rounded-full px-4 py-1.5 text-sm font-semibold">
            Successful
          </span>
        </div>
      </div>

      {/* Transaction Details Card */}
      <div className="bg-white rounded-2xl border border-[#eef2f1] p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#044e45]">Transaction Details</h3>
        <hr className="border-t-2 border-[#0f9e8e]/20" />

        <div className="grid grid-cols-1 gap-y-3.5 text-sm text-[#55645f] pt-2">
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Transaction ID :</span>
            <span>{record.txnId}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Amount Paid :</span>
            <span>{record.price}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Payment Date :</span>
            <span>{record.date}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Payment Method :</span>
            <span>Online</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Sale By :</span>
            <span>{record.sellBy}</span>
          </div>
        </div>
      </div>

      {/* Plan Details Card */}
      <div className="bg-white rounded-2xl border border-[#eef2f1] p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#044e45]">Plan Details</h3>
        <hr className="border-t-2 border-[#0f9e8e]/20" />

        <div className="grid grid-cols-1 gap-y-3.5 text-sm text-[#55645f] pt-2">
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Plan Type :</span>
            <span>{record.plan}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Plan Validity :</span>
            <span>{record.validity}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-[#2c3835] min-w-[150px]">Plan Price :</span>
            <span>{record.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
