import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

// ─── Success Modal Overlay ────────────────────────────────────────────────────
function SuccessModal({ onLogin }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="relative w-full max-w-[360px] mx-4 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-[scaleIn_0.25s_ease] bg-white border border-gray-100"
      >
        {/* Success illustration */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 overflow-hidden">
          <img src="/Password.png" alt="Success" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Password Changed Successfully!</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Your password has been successfully updated. You can now use your new credentials to log in to your account.
        </p>

        <hr className="w-full border-gray-200 mb-6" />

        <button
          id="success-login-now-btn"
          onClick={onLogin}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-[16px] transition-all hover:opacity-90 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 tracking-wide"
          style={{ backgroundColor: "#225091" }}
        >
          Login Now
        </button>
      </div>
    </div>
  );
}

// ─── Reset Password Page ──────────────────────────────────────────────────────
export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phoneNumber || "";
  const resetToken = location.state?.resetToken || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await authService.resetPassword({
        phoneNumber: phone,
        resetToken: resetToken,
        password: newPassword,
        confirmPassword: confirmPassword
      });
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <>
      {/* Success overlay modal */}
      {showSuccess && <SuccessModal onLogin={() => navigate("/")} />}

      <div className="h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: "#225091" }}>
        <div className="flex flex-1 items-center justify-center px-4 py-4 h-full w-full">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 w-full max-w-5xl">
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
              src="/Reset Password.png"
              alt="Reset Password Illustration"
              className="w-full max-h-[50vh] object-contain drop-shadow-2xl transition-transform hover:scale-[1.02] duration-500 mt-2"
            />
          </div>

          {/* Right – Card */}
          <div className="flex flex-col items-center justify-center w-full max-w-[420px]">
            <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex justify-center mb-4">
                <img src="/Logo.png" alt="Advita Credit Logo" className="h-12 object-contain drop-shadow-sm" />
              </div>
              <h1 className="text-[24px] font-black text-center mb-1 uppercase tracking-tight flex items-center justify-center gap-2">
                <span className="text-[#225091]">Reset</span>
                <span className="text-[#EB3338]">Password?</span>
              </h1>
              <p className="text-[13px] font-medium text-gray-500 text-center mb-6 px-4">Please enter new password</p>

            <form onSubmit={handleReset} className="flex flex-col gap-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    placeholder="••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowNew((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium -mt-2">{error}</p>
              )}

              {/* Set Password Button */}
              <button
                id="set-password-btn"
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
                    <span>Saving…</span>
                  </>
                ) : "Set Password"}
              </button>

              <p className="text-center text-sm text-gray-500 -mt-1">
                Remember Password?{" "}
                <button
                  id="reset-back-login"
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
    </>
  );
}
