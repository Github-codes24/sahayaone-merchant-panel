import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSubscriptionPlan } from "./subscriptionStore";

export default function AddSubscription() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [validity, setValidity] = useState("");
  const [users, setUsers] = useState("");
  const [support247, setSupport247] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !validity || !users) {
      alert("Please fill in all details!");
      return;
    }

    addSubscriptionPlan({
      name,
      price,
      validity,
      users,
      support247
    });

    navigate("/subscriptions");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/subscriptions")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#2B4282] text-[13px] font-bold rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-[#16221f]">Add Subscription</h1>
      </div>

      {/* Plan Details Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#16221f]">Plan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#2c3835]">Plan Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="px-4 py-2.5 border border-[#e0e6e4] rounded-lg text-sm bg-white outline-none focus:border-[#0f9e8e] transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#2c3835]">Plan Price</label>
            <input
              type="number"
              placeholder="Enter Price"
              className="px-4 py-2.5 border border-[#e0e6e4] rounded-lg text-sm bg-white outline-none focus:border-[#0f9e8e] transition-colors"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#2c3835]">Validity</label>
            <input
              type="number"
              placeholder="Enter Days"
              className="px-4 py-2.5 border border-[#e0e6e4] rounded-lg text-sm bg-white outline-none focus:border-[#0f9e8e] transition-colors"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Plan Features Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-[#16221f]">Plan Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#2c3835]">Share Access With User</label>
            <div className="relative">
              <select
                className="w-full appearance-none px-4 py-2.5 border border-[#e0e6e4] rounded-lg text-sm bg-white outline-none focus:border-[#0f9e8e] transition-colors font-medium text-[#2c3835] cursor-pointer"
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                required
              >
                <option value="" disabled hidden>Select Option</option>
                <option value="2">Share with 2 user</option>
                <option value="4">Share with 4 user</option>
                <option value="6">Share with 6 user</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <input
            type="checkbox"
            id="support247"
            className="w-4.5 h-4.5 rounded border border-[#e0e6e4] checked:bg-[#0f9e8e] cursor-pointer"
            checked={support247}
            onChange={(e) => setSupport247(e.target.checked)}
          />
          <label htmlFor="support247" className="text-sm font-semibold text-[#2c3835] cursor-pointer select-none">
            Support 24×7
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4 pt-6 border-t border-[#f1f4f3]">
        <button
          type="button"
          onClick={() => navigate("/subscriptions")}
          className="bg-white border border-[#e0e6e4] hover:bg-[#f0f5f4] text-[#024c47] rounded-xl px-12 py-2.5 text-sm font-semibold cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#024c47] hover:bg-[#013532] text-white border-none rounded-xl px-12 py-2.5 text-sm font-semibold cursor-pointer transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
