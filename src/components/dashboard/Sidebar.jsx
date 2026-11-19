export default function Sidebar({ currentPath, navigate }) {
  const menuItems = [
    {
      key: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
  ];

  const leadManagementItems = [
    {
      key: "leads",
      path: "/leads",
      label: "Leads",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>
      ),
    },

    {
      key: "sip",
      path: "/sip",
      label: "SIP",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      ),
    },
  ];

  const verificationItems = [
    {
      key: "cibil",
      path: "/cibil-score",
      label: "Check Cibil Score",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      key: "kyc",
      path: "/verification",
      label: "KYC Verification",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    }
  ];

  const settingsItems = [
    {
      key: "help",
      path: "/settings/help",
      label: "Help & Support",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
  ];

  const renderItem = (item) => {
    const isActive = currentPath === item.path || (item.path !== "/dashboard" && currentPath.startsWith(item.path));
    return (
      <button
        key={item.key}
        id={`sidebar-item-${item.key}`}
        onClick={() => navigate(item.path)}
        className={`relative flex items-center gap-3 py-3 px-5 rounded-none text-[14px] font-semibold cursor-pointer transition-all duration-150 w-full text-left border-none ${
          isActive
            ? "bg-[#EBF3FE] text-[#2B4282]"
            : "bg-transparent text-[#64748B] hover:bg-gray-50 hover:text-[#2B4282]"
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#2B4282]" />
        )}
        <span className="flex-shrink-0">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-[230px] min-h-screen bg-white border-r border-[#E5E7EB] flex flex-col justify-between sticky top-0 rounded-none z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center justify-center px-4 h-[92px] bg-white border-b border-[#E5E7EB] flex-shrink-0">
          <img src="/Logo-full.png" alt="SAHAYAONE" className="w-[140px] h-[50px] object-contain select-none" />
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col py-4 gap-2">
          {menuItems.map(renderItem)}

          <div className="flex flex-col mt-3">
            <span className="px-5 text-[14px] font-bold text-[#1E293B] mb-2 block">
              Lead Management
            </span>
            {leadManagementItems.map(renderItem)}
          </div>

          <div className="flex flex-col mt-3">
            <span className="px-5 text-[14px] font-bold text-[#1E293B] mb-2 block">
              Verification
            </span>
            {verificationItems.map(renderItem)}
          </div>


          <div className="flex flex-col mt-3">
            <span className="px-5 text-[14px] font-bold text-[#1E293B] mb-2 block">
              Settings
            </span>
            {settingsItems.map(renderItem)}
          </div>
        </div>
      </div>
    </aside>
  );
}
