import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export default function Profile() {
  const { user, merchant, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("security");

  // General Tab Editing State
  const [isEditing, setIsEditing] = useState(false);

  // Security Tab Editing State
  const [isSecurityEditing, setIsSecurityEditing] = useState(false);

  // Profile Details State
  const [name, setName] = useState(user?.fullName || merchant?.ownerName || "Merchant");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.phoneNumber || "");
  const [profilePic, setProfilePic] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face");

  // Editable Draft States for General
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editMobile, setEditMobile] = useState(mobile);

  // Password Form States for Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem("adminProfilePic", base64String);
        setProfilePic(base64String);
        window.dispatchEvent(new Event("profilePicChanged"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setEditMobile(mobile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setEditMobile(mobile);
    setIsEditing(false);
  };

  const handleSaveInlineEdit = () => {
    setName(editName);
    setEmail(editEmail);
    setMobile(editMobile);
    localStorage.setItem("adminName", editName);
    localStorage.setItem("adminEmail", editEmail);
    localStorage.setItem("adminMobile", editMobile);
    window.dispatchEvent(new Event("profileNameChanged"));
    setIsEditing(false);
  };

  const handleStartSecurityEdit = () => {
    setIsSecurityEditing(true);
    setPasswordMsg("");
  };

  const handleCancelSecurityEdit = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSecurityEditing(false);
    setPasswordMsg("");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New password and confirm password do not match." });
      return;
    }
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setPasswordMsg({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSecurityEditing(false);
      setTimeout(() => {
        setPasswordMsg("");
      }, 2500);
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to update password." });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* ─── Card 1: Page Title & Breadcrumb ─── */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#2B4282] text-[13px] font-bold rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-blue-600 m-0">My Profile</h1>
          <p className="text-sm font-medium text-gray-600 m-0 mt-1">
            Dashboard &gt; <span className="text-blue-600 font-semibold">My Profile</span>
          </p>
        </div>
      </div>

      {/* ─── Card 2: Profile Banner ─── */}
      <div className="bg-gradient-to-r from-[#06b6d4] via-[#0d9488] to-[#4f46e5] rounded-lg p-6 flex flex-row items-center shadow-md relative">
        {/* Left: User Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={profilePic}
            alt={name}
            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm"
          />
        </div>

        {/* Middle: User Info */}
        <div className="flex flex-col text-white gap-1 ml-4">
          <h2 className="text-2xl font-bold m-0 leading-tight">{name}</h2>
          <span className="text-sm opacity-90 font-medium">{email}</span>
          <span className="text-sm opacity-90 font-medium">{mobile}</span>
        </div>

        {/* Right: Merchant Badge */}
        <div className="ml-auto self-start">
          <div className="bg-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-indigo-600 font-bold text-xs shadow-sm">
            {/* Lucide Store Icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Merchant</span>
          </div>
        </div>
      </div>

      {/* ─── Tabs Section ─── */}
      <div className="flex flex-row gap-4 mt-1 border-b border-gray-200 pb-2">
        {/* Tab 1: General */}
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold transition-all border-none cursor-pointer ${
            activeTab === "general"
              ? "bg-gray-200 text-gray-800 shadow-sm"
              : "bg-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {/* Lucide Settings Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          General
        </button>

        {/* Tab 2: Security */}
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold transition-all border-none cursor-pointer ${
            activeTab === "security"
              ? "bg-gray-200 text-gray-800 shadow-sm"
              : "bg-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {/* Lucide Lock Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Security
        </button>
      </div>

      {/* ─── General Tab Content: Personal Information ─── */}
      {activeTab === "general" && (
        <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Personal Information</h3>
              <p className="text-sm text-gray-500 m-0 mt-0.5">
                {isEditing ? "Modify your details directly below and click Save" : "Update Your Personal Details"}
              </p>
            </div>
            {isEditing && (
              <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full animate-pulse">
                Editing Enabled
              </span>
            )}
          </div>

          {/* Avatar Section with Teal Camera Badge */}
          <div className="mt-6 relative inline-block">
            <img
              src={profilePic}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-inner"
            />
            <label
              htmlFor="profile-camera-upload"
              className="w-8 h-8 rounded-full bg-[#2B4282] text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white shadow-md cursor-pointer hover:bg-[#1E356A] transition-colors"
              title="Upload Avatar"
            >
              {/* Lucide Camera Icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </label>
            <input
              type="file"
              id="profile-camera-upload"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>

          {/* Form Fields */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? editName : name}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                    isEditing
                      ? "bg-white border-2 border-[#2B4282] text-gray-900 shadow-sm focus:outline-none ring-2 ring-[#2B4282]/20 cursor-text"
                      : "bg-gray-100 border border-gray-200 text-gray-800 cursor-default outline-none"
                  }`}
                  placeholder="Enter name"
                />
              </div>

              {/* Phone Field */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? editMobile : mobile}
                  onChange={(e) => setEditMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  maxLength={10}
                  className={`w-full px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                    isEditing
                      ? "bg-white border-2 border-[#2B4282] text-gray-900 shadow-sm focus:outline-none ring-2 ring-[#2B4282]/20 cursor-text"
                      : "bg-gray-100 border border-gray-200 text-gray-800 cursor-default outline-none"
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                readOnly={!isEditing}
                value={isEditing ? editEmail : email}
                onChange={(e) => setEditEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isEditing
                    ? "bg-white border-2 border-[#2B4282] text-gray-900 shadow-sm focus:outline-none ring-2 ring-[#2B4282]/20 cursor-text"
                    : "bg-gray-100 border border-gray-200 text-gray-800 cursor-default outline-none"
                }`}
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium text-sm border-none cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveInlineEdit}
                  className="bg-[#2B4282] hover:bg-[#1E356A] text-white font-medium rounded-full px-6 py-2 flex items-center gap-2 shadow-sm border-none cursor-pointer transition-colors text-sm"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="bg-[#2B4282] hover:bg-[#1E356A] text-white font-medium rounded-full px-6 py-2 flex items-center gap-2 shadow-sm border-none cursor-pointer transition-colors text-sm"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Card 3: Change Password Form (Security Tab) ─── */}
      {activeTab === "security" && (
        <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Change Password</h3>
              <p className="text-sm text-gray-500 m-0 mt-0.5">
                {isSecurityEditing ? "Enter your current and new password below and click Update Password" : "Ensure Your Account Stays Secure"}
              </p>
            </div>
            {isSecurityEditing && (
              <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full animate-pulse">
                Editing Enabled
              </span>
            )}
          </div>

          {passwordMsg && (
            <div className={`mt-4 p-3 rounded-md text-sm font-semibold ${passwordMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="mt-6 flex flex-col gap-6">
            {/* Row 1: Current Password */}
            <div className="flex flex-col w-full md:w-1/2 max-w-md">
              <label className="text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
              <input
                type="password"
                readOnly={!isSecurityEditing}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="*********"
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isSecurityEditing
                    ? "bg-white border-2 border-[#2B4282] text-gray-900 shadow-sm focus:outline-none ring-2 ring-[#2B4282]/20 cursor-text"
                    : "bg-gray-50 border border-gray-200 text-gray-800 cursor-default outline-none"
                }`}
              />
            </div>

            {/* Row 2: New Password */}
            <div className="flex flex-col w-full md:w-1/2 max-w-md">
              <label className="text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                readOnly={!isSecurityEditing}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="*********"
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isSecurityEditing
                    ? "bg-white border-2 border-[#2B4282] text-gray-900 shadow-sm focus:outline-none ring-2 ring-[#2B4282]/20 cursor-text"
                    : "bg-gray-50 border border-gray-200 text-gray-800 cursor-default outline-none"
                }`}
              />
            </div>

            {/* Row 3: Confirm Password */}
            <div className="flex flex-col w-full md:w-1/2 max-w-md">
              <label className="text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                readOnly={!isSecurityEditing}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="*********"
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isSecurityEditing
                    ? "bg-white border-2 border-[#2B4282] text-gray-900 shadow-sm focus:outline-none ring-2 ring-[#2B4282]/20 cursor-text"
                    : "bg-gray-50 border border-gray-200 text-gray-800 cursor-default outline-none"
                }`}
              />
            </div>

            {/* Footer */}
            <div className="mt-2 pt-6 border-t border-gray-100 flex justify-end gap-3">
              {isSecurityEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelSecurityEdit}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium border-none cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2B4282] hover:bg-[#1E356A] text-white font-medium rounded-full px-6 py-2.5 shadow-sm border-none cursor-pointer transition-colors text-sm"
                  >
                    Update Password
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartSecurityEdit}
                  className="bg-[#2B4282] hover:bg-[#1E356A] text-white font-medium rounded-full px-6 py-2.5 shadow-sm border-none cursor-pointer transition-colors text-sm"
                >
                  Change Password
                </button>
              )}
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
