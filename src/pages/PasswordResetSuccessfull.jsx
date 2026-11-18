import React from "react";

export default function PasswordResetSuccessfull({ onLogin }) {
  return (
    <div className="flex min-h-screen w-full font-sans bg-white">
      <div className="hidden min-[901px]:block [flex:1.1] overflow-hidden">
        <img 
          src="/Reset Password.png" 
          className="w-full h-full object-cover block" 
          alt="" 
        />
      </div>

      <div className="flex-1 min-[901px]:[flex:0.9] flex items-center justify-center p-6 min-[901px]:p-12 bg-[#f8fafc]">
        <div className="w-full max-w-[520px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[46px] h-[46px] bg-[#00ACA6] text-white rounded-lg flex justify-center items-center font-bold">
              CL
            </div>
            <span className="text-2xl font-bold text-black">
              CRM LOGO
            </span>
          </div>

          <div className="bg-transparent border-none shadow-none p-5 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-[30px] overflow-hidden">
              <img src="/Password.png" alt="Success" className="w-full h-full object-cover" />
            </div>

            <h2 className="text-[28px] font-bold text-[#0f172a] mb-3">
              Password Reset Successful
            </h2>

            <p className="text-[#6b7280] text-base mb-[35px]">
              Your password has been reset successfully.
            </p>

            <button
              className="w-full bg-[#0f4b48] hover:bg-[#0b3f3d] text-white border-none py-3.5 rounded-lg text-lg font-bold cursor-pointer transition-colors"
              onClick={onLogin}
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
