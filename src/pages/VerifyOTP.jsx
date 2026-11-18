import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const OTP_LENGTH = 6;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phoneNumber || "";

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) return;
    
    setIsLoading(true);
    setError("");
    try {
      const response = await authService.verifyOtp({ phoneNumber: phone, otp: otpValue });
      // We pass the resetToken to the next screen
      if (response && response.data && response.data.resetToken) {
        navigate("/reset", { state: { phoneNumber: phone, resetToken: response.data.resetToken } });
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await authService.resendOtp({ phoneNumber: phone });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
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
            src="/Verify OTP .png"
            alt="Verify OTP Illustration"
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
              <span className="text-[#225091]">Verify</span>
              <span className="text-[#EB3338]">OTP</span>
            </h1>
            <p className="text-[13px] font-medium text-gray-500 text-center mb-1 px-4">A 6 digit OTP has been sent to</p>

          {/* Phone number with edit icon */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-indigo-600 font-semibold text-sm">
              {phone.length >= 4 ? `******${phone.slice(-4)}` : phone}
            </span>
            <button
              type="button"
              id="edit-phone-btn"
              onClick={() => navigate("/forgot")}
              className="text-teal-500 hover:text-teal-700 transition-colors"
              title="Edit number"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            {/* OTP Boxes */}
            <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-box-${index}`}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-bold text-gray-800 bg-white border-2 rounded-xl outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  style={{ borderColor: digit ? "#4F46E5" : "#E5E7EB" }}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Resend */}
            <p className="text-center text-sm text-gray-500">
              Didn't received the code?{" "}
              <button
                id="resend-code-btn"
                type="button"
                onClick={handleResend}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Resend Code
              </button>
            </p>

            {/* Verify Button */}
            <button
              id="verify-otp-btn"
              type="submit"
              disabled={isLoading || otp.join("").length < OTP_LENGTH}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-[16px] transition-all hover:opacity-90 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 mt-2 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#225091" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Verifying…</span>
                </>
              ) : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-500 -mt-1">
              Remember Password?{" "}
              <button
                id="otp-back-login"
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
