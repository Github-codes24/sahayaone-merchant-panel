import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { getNotifications, subscribeNotifications } from "./notificationStore";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, merchant, logout } = useAuth();
  
  const [unreadCount, setUnreadCount] = useState(
    getNotifications().filter((n) => n.unread).length
  );

  useEffect(() => {
    const unsubscribe = subscribeNotifications((updated) => {
      setUnreadCount(updated.filter((n) => n.unread).length);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const profilePic = "https://i.pravatar.cc/150?img=5";
  const userName = user?.fullName || merchant?.ownerName || "Merchant";
  const shopName = merchant?.shopName || merchant?.merchantName || "";
  const shopLocation = merchant?.shopLocation || merchant?.address || merchant?.city || "";

  return (
    <div className="min-h-screen bg-[#f4f7f8] font-sans text-[#1f2a2e] flex flex-row items-stretch overflow-x-hidden relative">
      
      {/* Sidebar on the left - stretches full height */}
      <Sidebar
        currentPath={location.pathname}
        navigate={navigate}
        onLogout={handleLogout}
      />

      {/* Main viewport area on the right */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Global Background Brand Watermark - Centered in Content Area */}
        <div className="absolute inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden opacity-[0.08]">
          <img 
            src="/Logo.png" 
            alt="Advita Watermark" 
            className="w-[80%] max-w-[600px] select-none" 
          />
        </div>

        {/* Topbar/Header on top of the content */}
        <Topbar
          unreadCount={unreadCount}
          profilePic={profilePic}
          userName={userName}
          shopName={shopName}
          shopLocation={shopLocation}
          navigate={navigate}
          onLogout={handleLogout}
          currentPath={location.pathname}
        />

        {/* Content View Area */}
        <main className="flex-1 p-1.5 bg-[#F4F7FB] overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
