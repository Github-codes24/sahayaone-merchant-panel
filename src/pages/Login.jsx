import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, X, Mail, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
];

function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="lang-selector-btn"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 text-sm font-semibold text-gray-700 hover:shadow-md transition-shadow"
      >
        <span className="text-xl leading-none">{selected.flag}</span>
        <span>{selected.label}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-[160px] overflow-hidden py-2">
          {languages.filter((l) => l.code !== selected.code).map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setSelected(lang); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-700 mx-2 my-1 border border-gray-200 rounded-full transition-colors"
              style={{ width: "calc(100% - 16px)" }}
            >
              <span className="text-xl leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const payload = {};
      if (mobile.includes("@")) {
        payload.email = mobile;
      } else {
        payload.phoneNumber = mobile;
      }
      payload.password = password;

      const response = await authService.login(payload);

      if (response && response.data) {
        const token = response.data.tokens?.accessToken || response.data.accessToken;
        const refreshToken = response.data.tokens?.refreshToken || response.data.refreshToken;
        login(response.data.user, response.data.merchant, token, refreshToken);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: "#225091" }}>
      {/* Top bar */}
      <div className="absolute top-6 right-8 flex items-center gap-4 z-50">
        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors shadow-sm cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[14px]">Help & Support</span>
        </button>
        <LanguageSelector />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center px-4 w-full h-full">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 w-full max-w-5xl mx-auto">
          {/* Left – Illustration & Welcome Message */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full max-w-[480px]">
          <div className="flex flex-col items-center justify-center mb-6 mt-4 gap-4">
            <div className="flex items-center gap-5">
              <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/20">
                <img src="/Logo.png" alt="Advita Credit Logo" className="h-12 object-contain" />
              </div>
              <h1 className="text-[28px] font-black text-white uppercase tracking-widest drop-shadow-md leading-tight text-left">
                WELCOME TO <br/> ADVITA CREDIT
              </h1>
            </div>
            <div className="w-48 h-1 bg-[#EB3338] rounded-full shadow-md mt-2"></div>
          </div>
          <img
            src="/Login.png"
            alt="Login Illustration"
            className="w-full max-h-[50vh] object-contain drop-shadow-2xl transition-transform hover:scale-[1.02] duration-500 mt-2"
          />
        </div>

        {/* Right – Auth Card */}
        <div className="flex flex-col items-center justify-center w-full max-w-[420px]">
          <div
            className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            {/* Card Header */}
            <div className="flex justify-center mb-4">
              <img src="/Logo.png" alt="Advita Credit Logo" className="h-12 object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-[24px] font-black text-center mb-1 uppercase tracking-tight flex items-center justify-center gap-2">
              <span className="text-[#225091]">Merchant</span>
              <span className="text-[#EB3338]">Portal</span>
            </h1>
            <p className="text-[13px] font-medium text-gray-500 text-center mb-6">Sign in with your registered mobile number and password.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="login-mobile">
                  Mobile Number
                </label>
                <input
                  id="login-mobile"
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setMobile(val.slice(0, 10));
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer focus:cursor-text"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer focus:cursor-text"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password link */}
              <div className="flex justify-end -mt-1">
                <button
                  id="forgot-password-link"
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-sm font-semibold text-[#225091] hover:text-[#1a3d6e] hover:underline transition-colors"
                >
                  Forget Password ?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-[16px] transition-all hover:opacity-90 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 mt-4 tracking-wide cursor-pointer"
                style={{ backgroundColor: "#225091" }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Logging in…</span>
                  </>
                ) : "Login"}
              </button>
            </form>
          </div>
        </div>
        </div>
      </div>



      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#225091] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <h2 className="text-lg font-bold">Help & Support</h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-white/80 hover:text-white bg-transparent hover:bg-white/10 p-1 rounded-full transition-colors border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-[14px] mb-6 text-center">
                Need assistance accessing your merchant portal? Reach out to our support team.
              </p>
              
              <div className="space-y-4">
                <a href="tel:8080494923" className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors no-underline">
                  <div className="bg-white p-2 rounded-full text-[#225091] shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[15px] font-bold text-[#225091]">Call us</div>
                    <div className="text-[12px] font-semibold text-gray-500">8080494923</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Our team is on the line<br/>Mon-Fri • 10-8</div>
                  </div>
                </a>
                
                <a href="mailto:info@advitacredit.in" className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors no-underline">
                  <div className="bg-white p-2 rounded-full text-[#225091] shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[15px] font-bold text-[#225091]">Email us</div>
                    <div className="text-[12px] font-semibold text-gray-500">info@advitacredit.in</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Our team is online<br/>Mon-Fri • 10-8</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
