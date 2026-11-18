import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      await authService.forgotPassword({ phoneNumber: mobile });
      navigate("/verify", { state: { phoneNumber: mobile } });
    } catch (err) {
      setError(err.message || "Failed to request OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: "#225091" }}>
      <div className="flex flex-1 items-center justify-center px-4 py-4 h-full w-full">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 w-full max-w-5xl">
          {/* Left – Illustration & Welcome Message */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full max-w-[480px]">
          <div className="flex flex-col items-center justify-center mb-6 mt-4 gap-4">
            <div className="flex items-center gap-5">
              <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/20">
                <img src="/Logo.png" alt="Sahayaone Logo" className="h-12 object-contain" />
              </div>
              <h1 className="text-[28px] font-black text-white uppercase tracking-widest drop-shadow-md leading-tight text-left">
                WELCOME TO <br/> SAHAYAONE
              </h1>
            </div>
            <div className="w-48 h-1 bg-[#EB3338] rounded-full shadow-md mt-2"></div>
          </div>
          <img
            src="/Forget Password .png"
            alt="Forgot Password Illustration"
            className="w-full max-h-[50vh] object-contain drop-shadow-2xl transition-transform hover:scale-[1.02] duration-500 mt-2"
          />
        </div>

        {/* Right – Card */}
        <div className="flex flex-col items-center justify-center w-full max-w-[420px]">
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex justify-center mb-4">
              <img src="/Logo.png" alt="Sahayaone Logo" className="h-12 object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-[24px] font-black text-center mb-1 uppercase tracking-tight flex items-center justify-center gap-2">
              <span className="text-[#225091]">Forget</span>
              <span className="text-[#EB3338]">Password?</span>
            </h1>
            <p className="text-[13px] font-medium text-gray-500 text-center mb-6 px-4">Enter your registered mobile number to continue</p>

          <form onSubmit={handleGetOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="forgot-mobile">
                Mobile Number
              </label>
              <input
                id="forgot-mobile"
                type="tel"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              id="get-otp-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-[16px] transition-all hover:opacity-90 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 mt-4 tracking-wide"
              style={{ backgroundColor: "#225091" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Sending…</span>
                </>
              ) : "Get OTP"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-1">
              Remember Password?{" "}
              <button
                id="forgot-back-login"
                type="button"
                onClick={() => navigate("/")}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
