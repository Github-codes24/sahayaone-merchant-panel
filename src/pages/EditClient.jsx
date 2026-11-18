import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById, updateClient } from "./clientStore";

export default function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const client = getClientById(id);

  const profileInputRef = useRef(null);
  const [profilePreview, setProfilePreview] = useState(client?.avatar || null);

  const [form, setForm] = useState({
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    gender: client?.gender || "",
    dob: client?.dob || "",
    address: client?.address || "",
    registeredOn: client?.registeredOn || "",
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePreview(url);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Customer name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.dob.trim()) errs.dob = "Date of Birth is required";
    if (!form.address.trim()) errs.address = "Address is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    updateClient(id, {
      name: form.name,
      phone: form.phone,
      email: form.email,
      gender: form.gender,
      dob: form.dob,
      address: form.address,
      avatar: profilePreview,
    });
    navigate("/clients");
  };

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
          <h1 className="text-2xl font-bold text-indigo-700">Edit Customer</h1>
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
          <span className="text-indigo-600">Edit Customer</span>
        </div>
      </div>

      {/* ─── Form Container ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Customer Information</h2>

          {/* Profile Upload/Edit Circle */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Profile Image</label>
            <div className="relative w-24 h-24">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-[#2B4282] shadow-md" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 text-3xl font-bold flex items-center justify-center border-4 border-indigo-100 shadow-md">
                  {client.initials || client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
              )}
              {/* Camera Icon Overlay */}
              <div
                onClick={() => profileInputRef.current.click()}
                className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-[#2B4282] border-2 border-white flex items-center justify-center text-white cursor-pointer shadow hover:opacity-90 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </div>
            <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Clark Kent"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 ${
                  errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 ${
                  errors.phone ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email ID</label>
              <input
                type="email"
                placeholder="e.g. example@mail.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 ${
                  errors.email ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.email}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 cursor-pointer ${
                  errors.gender ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.gender}</p>}
            </div>

            {/* Date Of Birth */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Date Of Birth</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy (e.g. 28/07/1996)"
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 ${
                  errors.dob ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"
                }`}
              />
              {errors.dob && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.dob}</p>}
            </div>

            {/* Registered Date (ReadOnly) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Registration Date</label>
              <input
                type="text"
                readOnly
                value={form.registeredOn}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Address (Full Width) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Address</label>
            <textarea
              rows="3"
              placeholder="e.g. 2464 Royal Ln. Mesa, New Jersey 45463"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 resize-none ${
                errors.address ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"
              }`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.address}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="px-8 py-3 rounded-full border-2 border-[#2B4282] hover:bg-teal-50 text-[#2B4282] font-bold text-sm transition cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-bold text-sm rounded-full transition cursor-pointer border-none shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
