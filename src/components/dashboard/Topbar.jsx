import { useState, useRef, useEffect } from "react";

export default function Topbar({ unreadCount, profilePic, userName, shopName, shopLocation, navigate, onLogout, currentPath }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-[76px] bg-[#225091] flex items-center justify-between px-8 sticky top-0 z-40 shadow-md">
      {/* Left side: Welcome / User Greeting */}
      <div className="flex flex-col select-none">
        <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">Welcome</span>
        <div className="flex flex-col">
          <h2 className="text-[17px] font-bold text-white leading-tight flex items-center gap-1.5">
            <span>{userName || "Eleanor Pena"}</span>
            {shopName && (
              <>
                <span className="text-white/40">|</span>
                <span className="text-[16px] font-bold text-white">{shopName}</span>
              </>
            )}
          </h2>
          {shopLocation && (
            <span className="text-[11px] font-medium text-white/70 mt-0.5 flex items-center gap-1 leading-tight">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {shopLocation}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Customer Care */}
        <div className="relative group">
          <button
            id="topbar-customer-care"
            onClick={() => {
              if (currentPath !== "/settings/help") {
                navigate("/settings/help");
              }
            }}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:shadow-md transition cursor-pointer border-none"
            aria-label="Customer Care"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          </button>
          {/* Custom Instant Tooltip */}
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none">
            Customer Care
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative group">
          <button
            id="topbar-notifications"
            onClick={() => {
              if (currentPath === "/notifications") {
                const prev = sessionStorage.getItem("prevPathBeforeNotifications") || "/dashboard";
                navigate(prev);
              } else {
                sessionStorage.setItem("prevPathBeforeNotifications", currentPath);
                navigate("/notifications");
              }
            }}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center relative hover:shadow-md transition cursor-pointer border-none"
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2ecc71] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          {/* Custom Instant Tooltip */}
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none">
            Notifications
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-900"></div>
          </div>
        </div>

        {/* Profile Pill Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="topbar-profile-trigger"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 bg-white rounded-full pl-2 pr-4 py-1.5 hover:shadow-md transition cursor-pointer border-none"
          >
            <img
              className="w-8 h-8 rounded-full object-cover shadow-inner"
              src={profilePic || "https://i.pravatar.cc/64?img=5"}
              alt="Profile avatar"
              onError={(e) => {
                e.target.src = "https://i.pravatar.cc/64?img=5";
              }}
            />
            <span className="text-[14px] font-bold text-gray-800">{userName ? userName.split(" ")[0] : "Eleanor"}</span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[180px] bg-white rounded-2xl shadow-xl border border-gray-100/50 py-2 z-50 overflow-hidden animate-[scaleIn_0.2s_ease]">
              {/* My Profile */}
              <button
                id="profile-dropdown-myprofile"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-[14px] font-semibold text-indigo-600 transition-colors border-none text-left bg-transparent cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>My Profile</span>
              </button>

              <hr className="border-gray-100 my-1 mx-4" />

              {/* Logout */}
              <button
                id="profile-dropdown-logout"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-[14px] font-semibold text-red-500 transition-colors border-none text-left bg-transparent cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
