import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { addLead } from "./leadsStore";
import { leadService } from "../services/leadService";

export default function AddLead() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const existingLead = location.state?.existingLead;

  const [toastMsg, setToastMsg] = useState({ type: "", text: "" });
  useEffect(() => {
    if (toastMsg.text) {
      const t = setTimeout(() => setToastMsg({ type: "", text: "" }), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  // Wizard sequence (0 to 9):
  // 0: Check Phone
  // 1: General Info
  // 2: Verification (Aadhaar -> OTP -> Confirm)
  // 5: Choose Services
  // 6: Choose Loan Category
  // 7: Choose Mobile
  // 8: Choose Iphone
  // 9: Choose Iphone 17 (Variants)

  // Initialize step from URL, or fallback to existingLead logic
  const stepParam = searchParams.get("step");
  const step = stepParam !== null ? parseInt(stepParam, 10) : (existingLead ? 5 : 0);

  // Helper to update both state and URL
  const setStep = (newStep) => {
    setSearchParams({ step: newStep.toString() });
  };

  // Step 0: Phone Check State
  const [leadPhone, setLeadPhone] = useState(existingLead?.phone || "");
  const [phonePhase, setPhonePhase] = useState("phone"); // "phone" | "otp" | "result"
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const phoneOtpRefs = useRef([]);
  const [phoneTimer, setPhoneTimer] = useState(180); // 3 minutes
  const [foundLead, setFoundLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [, setIsExistingUser] = useState(!!existingLead);

  // Step 2: Verification Phase
  const [verificationPhase, setVerificationPhase] = useState("aadhaar"); // "aadhaar" | "otp" | "confirm"

  // Step 1: General Info State
  const [fullName, setFullName] = useState(existingLead?.customerName || "");
  const [gender, setGender] = useState(existingLead?.gender || "");
  const [dob, setDob] = useState(existingLead?.dob || "");
  const [mobileNumber, setMobileNumber] = useState(existingLead?.phone || "");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [savedCustomerId, setSavedCustomerId] = useState("");
  const [panImageBase64, setPanImageBase64] = useState(null);
  const [aadhaarImageBase64, setAadhaarImageBase64] = useState(null);
  const [aadhaarAddress, setAadhaarAddress] = useState("");
  const [aadhaarPin, setAadhaarPin] = useState("");

  // Step 3: OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef([]);
  const [timer, setTimer] = useState(600); // 10 minutes

  // Step 5-9: Catalog Selection State
  const [, setSelectedService] = useState("Loans");
  const [, setSelectedCategory] = useState("Mobiles on EMI");
  const [, setSelectedBrand] = useState("Apple");
  const [selectedModel, setSelectedModel] = useState("Iphone 17");
  const [selectedVariants, setSelectedVariants] = useState({ 0: true });

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  // API Loading States for Onboarding
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file) resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (step === 7) {
      if (brands.length === 0) {
        setIsLoadingBrands(true);
        leadService.getBrands()
          .then(res => setBrands(res.data || []))
          .catch(console.error)
          .finally(() => setIsLoadingBrands(false));
      }
    } else if (step === 8) {
      const bId = searchParams.get("brandId");
      if (bId && products.length === 0) {
        setIsLoadingProducts(true);
        leadService.getProducts(bId)
          .then(res => setProducts(res.data || []))
          .catch(console.error)
          .finally(() => setIsLoadingProducts(false));
      }
    } else if (step === 9) {
      const pId = searchParams.get("productId");
      if (pId && variants.length === 0) {
        setIsLoadingVariants(true);
        leadService.getProductVariants(pId)
          .then(res => setVariants(res.data || []))
          .catch(console.error)
          .finally(() => setIsLoadingVariants(false));
      }
    }
  }, [step, searchParams, brands.length, products.length, variants.length]);

  const panInputRef = useRef(null);
  const aadhaarInputRef = useRef(null);
  const dobInputRef = useRef(null);

  // Timer countdown for Verification OTP
  useEffect(() => {
    if (step !== 2 || verificationPhase !== "otp") return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, verificationPhase]);

  // Timer countdown for Phone OTP
  useEffect(() => {
    if (step !== 0 || phonePhase !== "otp") return;
    const interval = setInterval(() => {
      setPhoneTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, phonePhase]);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    if (cleanValue && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePhoneOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...phoneOtp];
    newOtp[index] = cleanValue;
    setPhoneOtp(newOtp);
    if (cleanValue && index < 5) {
      phoneOtpRefs.current[index + 1]?.focus();
    }
  };

  const handlePhoneOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !phoneOtp[index] && index > 0) {
      phoneOtpRefs.current[index - 1]?.focus();
    }
  };

  const toggleVariant = (idx) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleAadhaarChange = (e) => {
    let clean = e.target.value.replace(/[^0-9]/g, "");
    if (clean.length > 12) clean = clean.slice(0, 12);
    let formatted = clean;
    if (clean.length > 8) {
      formatted = `${clean.slice(0, 4)} - ${clean.slice(4, 8)} - ${clean.slice(8)}`;
    } else if (clean.length > 4) {
      formatted = `${clean.slice(0, 4)} - ${clean.slice(4)}`;
    }
    setAadhaarInput(formatted);
  };

  const handleFinalSubmit = async () => {
    if (isSubmittingLead) return;
    setIsSubmittingLead(true);
    try {
      // Find the first selected variant ID
      const selectedIdx = Object.keys(selectedVariants).find(k => selectedVariants[k]);
      const variantList = variants.length > 0 ? variants : [
        { id: "v1", color: "Teal", storage: "256 GB ROM", price: 80000 }
      ];
      const selectedVariant = variantList[selectedIdx];
      const variantId = selectedVariant?._id || selectedVariant?.id || "65b9d3b2e59df13456789ccc";


      const response = await leadService.createLead({
        customerId: savedCustomerId || foundLead?.customerId || "6a60897c8fbd6fa84bdeb401",
        variantId,
        fullName,
        gender: gender.toUpperCase(),
        dob,
        phoneNumber: mobileNumber,
        panNumber,
        aadhaarNumber: aadhaarInput.replace(/[^0-9]/g, ""),
        address: aadhaarAddress || `Pimpri Chinchwad, Pune, ${pinCode}`,
        addressLine: aadhaarAddress || `Pimpri Chinchwad, Pune, ${pinCode}`,
        pinCode: aadhaarPin || pinCode,
        currentPinCode: pinCode,
        panImage: panImageBase64,
        aadhaarImage: aadhaarImageBase64,
        source: location.pathname.includes("merchant") ? "MERCHANT" : "BRANCH"
      });
      setToastMsg({ type: "success", text: "Lead Application Submitted successfully!" });
      setTimeout(() => {
        const sourcePath = location.pathname.includes("merchant") ? "merchant" : "branch";
        if (response?.data?.leadId) {
          navigate(`/leads/${sourcePath}?leadId=${response.data.leadId}`);
        } else {
          navigate(`/leads/${sourcePath}`);
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setToastMsg({ type: "error", text: "Failed to create lead application" });
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="w-full pb-12 animate-[wh-slide-up_0.2s_ease]">
      {toastMsg.text && (
        <div className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-3 animate-[wh-slide-down_0.3s_ease] ${toastMsg.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#2B4282] text-white'}`}>
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg({ type: "", text: "" })} className="text-white hover:text-gray-200 focus:outline-none text-xl leading-none">&times;</button>
        </div>
      )}
      {/* ─── Breadcrumbs & Header ─── */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center mb-6">
        <div className="flex items-center gap-3 mb-1">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-blue-600 m-0">
          {step === 0 && "Check Phone Number"}
          {step === 1 && "Add Lead"}
          {step === 2 && "Identity Verification"}
          {step === 5 && "Choose Services"}
          {step === 6 && "Choose Loan Category"}
          {step === 7 && "Choose Mobile"}
          {step === 8 && "Choose Iphone"}
          {step === 9 && "Choose Iphone 17"}
        </h1>
        </div>
        <p className="text-sm font-medium text-gray-600 m-0 mt-1">
          Dashboard &gt; Lead Management &gt; <span onClick={() => navigate("/leads/" + (location.pathname.includes("merchant") ? "merchant" : "branch"))} className="hover:text-blue-600 cursor-pointer transition-colors">Leads</span> &gt; <span className="text-blue-600 font-semibold">Add Lead</span>
        </p>
      </div>

      {/* ─── Main Content Container ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">

        {/* STEP 0: PHONE CHECK */}
        {step === 0 && (
          <div className="flex flex-col items-center max-w-3xl mx-auto py-8 w-full">
            {phonePhase !== "otp" && (
              <div className="w-full text-center mb-10">
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  {phonePhase === "phone" && "Check Mobile Number"}
                  {phonePhase === "result" && "Lead Information"}
                </h2>
                {phonePhase === "phone" && (
                  <p className="text-sm text-gray-500 font-medium">
                    Enter the lead's mobile number to verify their status in our system.
                  </p>
                )}
              </div>
            )}

            {phonePhase === "phone" && (
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await leadService.sendLookupOtp({ phoneNumber: leadPhone });
                  setPhoneTimer(180);
                  setPhoneOtp(["", "", "", "", "", ""]);
                  setPhonePhase("otp");
                } catch (err) {
                  console.error(err);
                  setToastMsg({ type: "error", text: err.message || "Failed to send OTP" });
                }
              }} className="w-full max-w-sm mb-8 animate-[wh-slide-down_0.3s_ease]">
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-left">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    value={leadPhone}
                    onChange={(e) => {
                      setLeadPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                      setFoundLead(null);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-lg text-gray-900 outline-none focus:border-[#2B4282] transition shadow-xs font-bold tracking-wider text-center"

                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-extrabold text-sm py-3.5 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none"
                >
                  Send OTP
                </button>
              </form>
            )}

            {phonePhase === "otp" && (
              <div className="w-full max-w-md mb-8 flex flex-col items-center animate-[wh-slide-down_0.3s_ease]">
                <h3 className="text-[22px] font-bold text-gray-900 mb-4 tracking-tight">
                  Verify OTP
                </h3>
                <p className="text-[15px] font-medium text-gray-800 text-center mb-6 leading-snug">
                  A 6 digit OTP has been sent to customer<br />
                  mobile number <span className="text-[#195bb2]">XXXXXX{(leadPhone || "3210").slice(-4)}</span>
                </p>

                <div className="flex gap-2.5 mb-2 justify-center w-full">
                  {phoneOtp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (phoneOtpRefs.current[index] = el)}
                      onChange={(e) => handlePhoneOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handlePhoneOtpKeyDown(e, index)}
                      className="w-[50px] h-[52px] bg-white border border-gray-200 rounded-2xl text-center text-xl font-medium text-gray-800 outline-none focus:border-[#2B4282] transition shadow-sm"
                    />
                  ))}
                </div>

                <div className="flex justify-end w-full text-[11px] font-bold mb-8 px-6">
                  <div className="text-right flex flex-col items-end">
                    <button
                      onClick={() => {
                        setPhoneTimer(180);
                        setPhoneOtp(["", "", "", "", "", ""]);
                        setToastMsg({ type: "success", text: "OTP Resent Successfully" });
                      }}
                      type="button"
                      className={`${phoneTimer > 0 ? 'text-gray-400' : 'text-[#2B4282]'} hover:text-[#2B4282] bg-transparent border-none p-0 cursor-pointer text-[11px] font-extrabold transition-colors`}
                    >
                      Resend OTP
                    </button>
                    {phoneTimer > 0 && (
                      <span className="text-gray-500 mt-0.5">In {formatTime(phoneTimer)} secs</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 w-full px-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPhonePhase("phone");
                    }}
                    className="flex-1 bg-white border-2 border-[#2B4282] text-[#2B4282] hover:bg-teal-50 font-semibold text-[15px] py-3 rounded-full transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await leadService.verifyLookupOtp({
                          phoneNumber: leadPhone,
                          otp: phoneOtp.join("")
                        });
                        const data = response?.data;

                        // Removed auto-redirect to /leads for draft loans as per user feedback

                        if (data && (data.exists === true || data.customerId || data.customer)) {
                          let cData = data.customer || data;

                          // If there's a draft loan, fetch full details to get documents and other info
                          if (data.draftLoan?.leadId) {
                            try {
                              const leadDetailsResponse = await leadService.getLeadDetails(data.draftLoan.leadId);
                              if (leadDetailsResponse?.data?.customer) {
                                // Merge the fetched full customer details (which might include documents)
                                cData = { ...cData, ...leadDetailsResponse.data.customer };
                              }
                            } catch (e) {
                              console.error("Failed to fetch full lead details", e);
                            }
                          }

                          // Format DOB to remove the time component
                          let formattedDob = cData.profileDetails?.dob || cData.dob || "";
                          if (formattedDob.includes("T")) {
                            formattedDob = formattedDob.split("T")[0];
                          }

                          setFoundLead({
                            customerId: data.customerId || cData.id || cData._id || "",
                            customerName: cData.customerName || cData.fullName || cData.name || "",
                            phone: leadPhone,
                            dob: formattedDob,
                            gender: cData.profileDetails?.gender || cData.gender || "",
                            panNumber: cData.profileDetails?.panNumber || cData.panNumber || "",
                            aadhaarNumber: cData.profileDetails?.aadhaarNumber || cData.aadhaarNumber || "",
                            address: cData.profileDetails?.address || cData.address || "",
                            panImage: cData.profileDetails?.panImage || cData.panImage || "",
                            aadhaarImage: cData.profileDetails?.aadhaarImage || cData.aadhaarImage || "",
                            status: cData.status || "Active",
                            initials: (cData.customerName || cData.fullName || cData.name || "EU").substring(0, 2).toUpperCase()
                          });
                          setShowLeadDetails(false);
                          setPhonePhase("result");
                        } else {
                          setFoundLead(null);
                          setIsExistingUser(false);
                          setFullName("");
                          setDob("");
                          setPinCode("");
                          setMobileNumber(leadPhone);
                          setStep(1); // Go to Add Details form for new user
                        }
                      } catch (err) {
                        console.error(err);
                        setToastMsg({ type: "error", text: err.message || "Invalid OTP" });
                      }
                    }}
                    className="flex-1 bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-semibold text-[15px] py-3 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {/* FOUND EXISTING LEAD PREVIEW */}
            {phonePhase === "result" && foundLead && !showLeadDetails && (
              <div className="w-full max-w-md mx-auto animate-[wh-slide-down_0.3s_ease]">
                <p className="text-xs font-bold text-gray-400 mb-3 text-center uppercase tracking-widest">Existing Record Found</p>
                <div
                  onClick={() => setShowLeadDetails(true)}
                  className="bg-white rounded-xl p-5 border-2 border-[#2B4282]/30 hover:border-[#2B4282] shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2B4282]/10 text-[#2B4282] font-black text-lg flex items-center justify-center border border-[#2B4282]/20">
                      {foundLead.initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{foundLead.customerName}</h3>
                      <p className="text-sm text-gray-500 font-semibold mt-0.5">{foundLead.phone}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#2B4282] group-hover:bg-[#2B4282]/10 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            )}

            {/* EXPANDED LEAD DETAILS */}
            {phonePhase === "result" && foundLead && showLeadDetails && (
              <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-[wh-slide-down_0.3s_ease]">
                <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-800 font-bold text-lg flex items-center justify-center border-2 border-gray-100 shadow-sm">
                      {foundLead.initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{foundLead.customerName}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-700 uppercase tracking-wider">
                        {foundLead.status}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setShowLeadDetails(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none p-1 cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-800 mb-6">
                  <div>
                    <span className="font-semibold text-gray-500">Phone: </span>
                    <span className="font-bold">{foundLead.phone}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">DOB: </span>
                    <span className="font-bold">{foundLead.dob}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Gender: </span>
                    <span className="font-bold">{foundLead.gender}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">PAN Number: </span>
                    <span className="font-bold">{foundLead.panNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Aadhaar Number: </span>
                    <span className="font-bold">{foundLead.aadhaarNumber}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-gray-500 block mb-1">Address: </span>
                    <span className="font-bold block bg-white p-2 rounded-lg border border-gray-100 text-xs">{foundLead.address}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-4 border-t border-gray-200 pt-6">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* PAN Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[220px]">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 w-full text-left">PAN Card</h4>
                    {foundLead.panImage ? (
                      <img src={foundLead.panImage} alt="PAN Card" className="max-w-full max-h-[160px] object-contain rounded-lg border border-gray-100" />
                    ) : (
                      <div className="text-sm font-medium text-gray-400 italic">No document uploaded</div>
                    )}
                  </div>

                  {/* Aadhaar Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[220px]">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 w-full text-left">Aadhaar Card</h4>
                    {foundLead.aadhaarImage ? (
                      <img src={foundLead.aadhaarImage} alt="Aadhaar Card" className="max-w-full max-h-[160px] object-contain rounded-lg border border-gray-100" />
                    ) : (
                      <div className="text-sm font-medium text-gray-400 italic">No document uploaded</div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsExistingUser(true);
                    setFullName(foundLead.customerName);
                    setDob(foundLead.dob);
                    // Existing users skip Aadhaar verification (Step 2) entirely and go to Choose Services (Step 5)
                    setStep(5);
                  }}
                  className="w-full bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-extrabold text-sm py-3.5 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Set Up New Loan
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: GENERAL INFO FORM */}
        {step === 1 && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!fullName || !gender || !dob || !panNumber || !aadhaarInput || !pinCode) {
              setToastMsg({ type: "error", text: "Please fill out all required fields." });
              return;
            }

            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            if (age < 18) {
              setToastMsg({ type: "error", text: "Lead must be at least 18 years old." });
              return;
            }

            if (!panFile || !aadhaarFile) {
              setToastMsg({ type: "error", text: "Please upload both PAN and Aadhaar images." });
              return;
            }
            if (!termsAccepted) { setToastMsg({ type: "error", text: "Please accept Terms and Conditions" }); return; }
            try {
              const panBase64 = panFile ? await fileToBase64(panFile) : null;
              const aadhaarBase64 = aadhaarFile ? await fileToBase64(aadhaarFile) : null;

              setPanImageBase64(panBase64);
              setAadhaarImageBase64(aadhaarBase64);

              const response = await leadService.onboard({
                fullName,
                gender: gender.toUpperCase(),
                dob,
                phoneNumber: mobileNumber,
                panNumber,
                aadhaarNumber: aadhaarInput.replace(/[^0-9]/g, ""),
                currentPinCode: pinCode,
                panImage: panBase64,
                aadhaarImage: aadhaarBase64
              });
              setTransactionId(response?.data?.transactionId || "");
              setVerificationPhase("aadhaar");
              setStep(2);
            } catch (err) {
              console.error(err);
              let errorMsg = err.data?.message || err.message || "Failed to initiate onboarding";
              if (err.data?.details?.length > 0) {
                errorMsg = err.data.details.map(d => d.message).join(" | ");
              }
              setToastMsg({ type: "error", text: errorMsg });
            }
          }} className="space-y-8">
            <h2 className="text-lg font-black text-gray-850 border-b border-gray-100 pb-3">
              General Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Full Name (As Per PAN Card)
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2B4282] transition shadow-xs"

                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Gender
                </label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2B4282] transition appearance-none cursor-pointer shadow-xs"

                  >
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Date Of Birth
                </label>
                <div className="relative">
                  <input
                    ref={dobInputRef}
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm text-gray-800 outline-none focus:border-[#2B4282] transition shadow-xs cursor-pointer"

                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (dobInputRef.current && dobInputRef.current.showPicker) {
                        dobInputRef.current.showPicker();
                      } else {
                        dobInputRef.current?.focus();
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B4282] transition cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter mobile Number"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 font-bold outline-none cursor-not-allowed shadow-xs"
                  readOnly
                  disabled

                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  PAN Number
                </label>
                <input
                  type="text"
                  placeholder="Enter PAN Number"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2B4282] transition shadow-xs"

                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Aadhaar Number"
                  maxLength={18}
                  value={aadhaarInput}
                  onChange={handleAadhaarChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2B4282] transition shadow-xs"

                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  PAN Card
                </label>
                <div
                  onClick={() => panInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-[#2B4282] rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50/10 transition overflow-hidden bg-[#FAFBFD]"
                >
                  {panFile ? (
                    <span className="text-sm font-bold text-[#2B4282]">{panFile.name}</span>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-400 mt-1.5">
                        Upload Image (jpg, jpeg, png, pdf)
                      </span>
                    </div>
                  )}
                </div>
                <input ref={panInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setPanFile(e.target.files[0])} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Aadhaar Card
                </label>
                <div
                  onClick={() => aadhaarInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-[#2B4282] rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50/10 transition overflow-hidden bg-[#FAFBFD]"
                >
                  {aadhaarFile ? (
                    <span className="text-sm font-bold text-[#2B4282]">{aadhaarFile.name}</span>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-400 mt-1.5">
                        Upload Image (jpg, jpeg, png, pdf)
                      </span>
                    </div>
                  )}
                </div>
                <input ref={aadhaarInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setAadhaarFile(e.target.files[0])} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Current Residential PIN Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit current residential PIN code"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2B4282] transition shadow-xs"

                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#2B4282] focus:ring-[#2B4282] cursor-pointer mt-0.5"
                />
                <span className="text-sm font-semibold text-gray-700 leading-normal">
                  I have read, understand, and hereby accept the Sahayaone product application{" "}
                  <span className="text-red-500 hover:underline">Terms and Conditions.</span>
                </span>
              </label>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-extrabold text-sm py-3.5 px-24 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFICATION (AADHAAR -> OTP -> CONFIRM) */}
        {step === 2 && (
          <div className="flex flex-col items-center max-w-xl mx-auto py-6">
            <p className="text-sm font-semibold text-gray-600 text-center mb-8 leading-relaxed">
              Verify your identity through Aadhar-based OTP generated by UIDAI and complete the application.
            </p>

            {/* AADHAAR ENTRY */}
            <div className="w-full">
              <label className="block text-sm font-extrabold text-gray-800 mb-2.5">
                Enter 12-Digit Aadhaar Number/VID Number*
              </label>
              <input
                type="text"
                placeholder="Type"
                maxLength={18}
                value={aadhaarInput}
                disabled={verificationPhase === "otp" || verificationPhase === "confirm"}
                onChange={handleAadhaarChange}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-850 outline-none focus:border-[#2B4282] transition shadow-xs disabled:bg-gray-50 disabled:text-gray-500"

              />

              {verificationPhase === "aadhaar" && (
                <>
                  <div className="w-full bg-[#F5F7FF] border-l-4 border-[#2B4282] p-4 rounded-r-2xl my-6 flex items-start gap-3">
                    <p className="text-xs font-bold text-[#1F2937]/90 leading-normal">
                      An OTP will be sent to the mobile number and Email ID linked to your Aadhaar card.
                    </p>
                  </div>
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      disabled={isSendingOtp}
                      onClick={async () => {
                        try {
                          setIsSendingOtp(true);
                          if (!fullName || !gender || !dob || !panNumber || !aadhaarInput || !pinCode) {
                            setToastMsg({ type: "error", text: "Missing required details. Please go back to General Info." });
                            setIsSendingOtp(false);
                            return;
                          }
                          if (!panImageBase64 || !aadhaarImageBase64) {
                            setToastMsg({ type: "error", text: "Missing required images. Please go back and upload them." });
                            setIsSendingOtp(false);
                            return;
                          }
                          const response = await leadService.onboard({
                            phoneNumber: mobileNumber,
                            panNumber: panNumber,
                            aadhaarNumber: aadhaarInput.replace(/[^0-9]/g, ""),
                            fullName,
                            gender: gender.toUpperCase(),
                            dob,
                            currentPinCode: pinCode,
                            panImage: panImageBase64,
                            aadhaarImage: aadhaarImageBase64
                          });
                          if (response?.data?.transactionId) {
                            setTransactionId(response.data.transactionId);
                          }
                          if (response?.data?.customerId) {
                            setSavedCustomerId(response.data.customerId);
                          }
                          setVerificationPhase("otp");
                          setToastMsg({ type: "success", text: "Aadhaar OTP sent successfully." });
                        } catch (err) {
                          console.error(err);
                          let errorMsg = err.data?.message || err.message || "Failed to send Aadhaar OTP";
                          if (err.data?.details?.length > 0) {
                            errorMsg = err.data.details.map(d => d.message).join(" | ");
                          }
                          setToastMsg({ type: "error", text: errorMsg });
                        } finally {
                          setIsSendingOtp(false);
                        }
                      }}
                      className="bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-extrabold text-sm py-3.5 px-20 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none disabled:opacity-70"
                    >
                      {isSendingOtp ? "Sending..." : "Get OTP"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* OTP VERIFICATION */}
            {(verificationPhase === "otp" || verificationPhase === "confirm") && (
              <div className="w-full mt-10 flex flex-col items-center animate-[wh-slide-down_0.3s_ease]">
                <h3 className="text-base font-extrabold text-gray-850 text-center mb-1">
                  Verify Aadhaar With OTP
                </h3>
                <p className="text-xs font-semibold text-gray-500 text-center mb-8 leading-normal max-w-md">
                  Verify Your Identity Through Aadhar-Based OTP Generated By UIDAI And Complete The Application.
                </p>

                <span className="text-xs font-extrabold text-gray-700 mb-4">Enter OTP</span>

                <div className="flex gap-3 mb-4 justify-center w-full">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      disabled={verificationPhase === "confirm"}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-12 bg-white border border-gray-200 rounded-xl text-center text-lg font-extrabold text-gray-850 outline-none focus:border-[#2B4282] transition shadow-xs disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  ))}
                </div>

                {verificationPhase === "otp" && (
                  <>
                    <div className="flex justify-end w-full max-w-[340px] text-[11px] font-bold text-gray-400 mb-8">
                      <span className="text-right">
                        Resend OTP <br />
                        <span className="text-gray-500">In {formatTime(timer)} secs</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isVerifyingOtp}
                      onClick={async () => {
                        try {
                          setIsVerifyingOtp(true);
                          const verifyRes = await leadService.verifyAadhaar({
                            phoneNumber: mobileNumber,
                            transactionId: transactionId || "txn_aadhaar_123456",
                            otp: otp.join("")
                          });
                          const vData = verifyRes?.data?.data || verifyRes?.data || {};
                          if (vData.addressLine) setAadhaarAddress(vData.addressLine);
                          if (vData.pinCode) setAadhaarPin(vData.pinCode);

                          setVerificationPhase("confirm");
                          setToastMsg({ type: "success", text: "Aadhaar verified successfully." });
                        } catch (err) {
                          console.error(err);
                          setToastMsg({ type: "error", text: err.message || "Failed to verify Aadhaar" });
                        } finally {
                          setIsVerifyingOtp(false);
                        }
                      }}
                      className="bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-extrabold text-sm py-3.5 px-20 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none disabled:opacity-70"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ADDRESS CONFIRMATION */}
            {verificationPhase === "confirm" && (
              <div className="w-full mt-10 animate-[wh-slide-down_0.3s_ease] border-t border-gray-100 pt-8 flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-600 mb-6 text-center">
                  This address is already available in our records. Please confirm or update it to proceed.
                </p>

                <div className="border border-gray-200 rounded-2xl p-6 bg-white mb-8 w-full max-w-md shadow-xs text-left">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="w-5 h-5 rounded-full border-2 border-[#2B4282] flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2B4282]" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-850 mb-3">
                        Yes, this is current residential address
                      </h4>
                      <div className="text-xs font-semibold text-gray-700 leading-relaxed space-y-1">
                        <p>{fullName || "Amit Dutta"}</p>
                        <p>{dob || "01/01/1996"}</p>
                        <p>{aadhaarAddress || `Pimpri Chinchwad, Pune, ${pinCode}`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={async () => {
                      try {
                        setIsConfirming(true);

                        const currentCustomerId = savedCustomerId || foundLead?.customerId || existingLead?.customerId;

                        const formData = new FormData();
                        formData.append("customerId", currentCustomerId || "");
                        formData.append("fullName", fullName || "");
                        formData.append("gender", gender ? gender.toUpperCase() : "");
                        formData.append("dob", dob || "");
                        formData.append("phoneNumber", mobileNumber || "");
                        formData.append("panNumber", panNumber || "");
                        formData.append("aadhaarNumber", aadhaarInput.replace(/[^0-9]/g, "") || "");
                        formData.append("address", aadhaarAddress || `Pimpri Chinchwad, Pune, ${pinCode}`);
                        formData.append("addressLine", aadhaarAddress || `Pimpri Chinchwad, Pune, ${pinCode}`);
                        formData.append("pinCode", aadhaarPin || pinCode || "");
                        formData.append("currentPinCode", pinCode || "");
                        
                        if (panFile) formData.append("panImage", panFile);
                        if (aadhaarFile) formData.append("aadhaarImage", aadhaarFile);

                        const response = await leadService.confirmOnboard(formData);

                        const returnedId = response?.data?.customerId || response?.data?.id || response?.data?.customer?.id;
                        if (returnedId) {
                          setSavedCustomerId(returnedId);
                        }

                        setToastMsg({ type: "success", text: "Details saved successfully." });
                        setStep(5);
                      } catch (err) {
                        console.error(err);
                        setToastMsg({ type: "error", text: err.message || "Failed to confirm onboard" });
                      } finally {
                        setIsConfirming(false);
                      }
                    }}
                    className="bg-[#2B4282] hover:bg-[#0fa6b2] text-white font-extrabold text-sm py-3.5 px-20 rounded-full shadow-sm hover:shadow-md transition cursor-pointer border-none disabled:opacity-70"
                  >
                    {isConfirming ? "Saving..." : "Add Lead"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: CHOOSE SERVICES */}
        {step === 5 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: "loans", title: "Loans", imgSrc: "/Loan.png" },
              { id: "emi_card", title: "EMI Card", imgSrc: "/EMI Card.png" },
              { id: "company_pay1", title: "Company Pay", imgSrc: "/Company Pay.png" },
              { id: "bill1", title: "Bill & Recharge", imgSrc: "/Bill & Recharge.png" },
              { id: "insurance", title: "Insurance", imgSrc: "/Insurance.png" },
              { id: "deals", title: "Deals & Savings", imgSrc: "/Deals and Savings.png" },
              { id: "company_pay2", title: "Company Pay", imgSrc: "/Company Pay.png" },
              { id: "bill2", title: "Bill & Recharge", imgSrc: "/Bill & Recharge.png" }
            ].map((item) => (
              <div
                key={item.id}
                onClick={item.id === "loans" ? () => { setSelectedService(item.title); setStep(6); } : undefined}
                className={`border-2 rounded-3xl p-4 flex flex-col items-center justify-between transition bg-white group min-h-[220px] ${item.id === "loans"
                  ? "border-[#2B4282] hover:shadow-lg cursor-pointer"
                  : "border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
              >
                <div className="flex-1 flex items-center justify-center py-4 w-full h-36">
                  <img src={item.imgSrc} alt={item.title} className={`max-h-28 max-w-full object-contain drop-shadow-sm transition-transform duration-200 ${item.id === "loans" ? "group-hover:scale-105" : ""}`} />
                </div>
                <h3 className={`text-base font-extrabold pt-2 transition text-center ${item.id === "loans" ? "text-gray-850 group-hover:text-[#2B4282]" : "text-gray-400"}`}>
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        )}

        {/* STEP 6: CHOOSE LOAN CATEGORY */}
        {step === 6 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: "mobiles", title: "Mobiles on EMI", img: "/Mobiles on Emi.png" },
              { id: "electronics", title: "Electronics on EMI", img: "/Electronics on Emi.png" },
              { id: "two_wheeler", title: "Two Wheeler Loan", img: "/Two Wheeler Loan.png" },
              { id: "used_car", title: "Used Car Loan", img: "/Used Car Loan.png" },
              { id: "new_car", title: "New Car Finance", img: "/New Car Finance.png" },
              { id: "tractor", title: "Tractor Finance", img: "/Tractor Finance.png" },
              { id: "home_loan", title: "Home Loan", img: "/Home Loan.png" },
              { id: "personal_loan", title: "Personal Loan", img: "/Personal Loan.png" }
            ].map((item) => (
              <div
                key={item.id}
                onClick={item.id === "mobiles" ? () => { setSelectedCategory(item.title); setStep(7); } : undefined}
                className={`border-2 rounded-3xl p-4 flex flex-col items-center justify-between transition bg-white group min-h-[220px] ${item.id === "mobiles"
                  ? "border-[#2B4282] hover:shadow-lg cursor-pointer"
                  : "border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
              >
                <div className="flex-1 flex items-center justify-center p-2 w-full h-36">
                  <img src={item.img} alt={item.title} className={`max-h-full max-w-full object-contain rounded-xl drop-shadow-sm transition-transform duration-200 ${item.id === "mobiles" ? "group-hover:scale-105" : ""}`} />
                </div>
                <h3 className={`text-base font-extrabold pt-2 transition text-center ${item.id === "mobiles" ? "text-gray-850 group-hover:text-[#2B4282]" : "text-gray-400"}`}>
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        )}

        {/* STEP 7: CHOOSE MOBILE BRAND */}
        {step === 7 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {isLoadingBrands ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="border-2 border-gray-100 rounded-3xl p-4 flex flex-col items-center justify-between bg-white min-h-[200px] animate-pulse">
                  <div className="flex-1 flex items-center justify-center p-2 w-full h-32">
                    <div className="w-20 h-20 bg-gray-200 rounded-full" />
                  </div>
                  <div className="w-24 h-4 bg-gray-200 rounded mt-2" />
                </div>
              ))
            ) : brands.map((item) => {
              const bId = item._id || item.id;
              return (
                <div
                  key={bId}
                  onClick={() => {
                    setSelectedBrand(item.name);
                    setProducts([]); // clear to trigger loading for next step
                    setSearchParams({ step: "8", brandId: bId });
                  }}
                  className="border-2 border-[#2B4282] rounded-3xl p-4 flex flex-col items-center justify-between hover:shadow-lg transition cursor-pointer bg-white group min-h-[200px]"
                >
                  <div className="flex-1 flex items-center justify-center p-2 w-full h-32">
                    <img src={item.logo} alt={item.name} className="max-h-20 max-w-[140px] object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <h3 className="text-base font-extrabold text-gray-850 pt-2 group-hover:text-[#2B4282] transition text-center">
                    {item.name}
                  </h3>
                </div>
              )
            })}
          </div>
        )}

        {/* STEP 8: CHOOSE IPHONE MODEL */}
        {step === 8 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {isLoadingProducts ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="border-2 border-gray-100 rounded-3xl p-4 flex flex-col items-center justify-between bg-white min-h-[220px] animate-pulse">
                  <div className="flex-1 flex items-center justify-center p-2 w-full">
                    <div className="w-24 h-36 bg-gray-200 rounded-xl" />
                  </div>
                  <div className="w-32 h-4 bg-gray-200 rounded mt-2" />
                </div>
              ))
            ) : products.map((item) => {
              const pId = item._id || item.id;
              return (
                <div
                  key={pId}
                  onClick={() => {
                    setSelectedModel(item.name);
                    setVariants([]); // clear to trigger loading for next step
                    setSearchParams({ step: "9", brandId: searchParams.get("brandId"), productId: pId });
                  }}
                  className="border-2 border-[#2B4282] rounded-3xl p-4 flex flex-col items-center justify-between hover:shadow-lg transition cursor-pointer bg-white group min-h-[220px]"
                >
                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&fit=crop"}
                      alt={item.name}
                      className="max-h-36 object-contain"
                    />
                  </div>
                  <h3 className="text-base font-extrabold text-gray-850 pt-2 group-hover:text-[#2B4282] transition text-center">
                    {item.name}
                  </h3>
                </div>
              )
            })}
          </div>
        )}

        {/* STEP 9: CHOOSE IPHONE 17 VARIANTS & FINAL SUBMIT */}
        {step === 9 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {isLoadingVariants ? (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="border-2 border-gray-100 rounded-3xl p-4 flex flex-col justify-between bg-white min-h-[260px] animate-pulse">
                    <div className="flex items-center justify-center p-2 h-36 w-full">
                      <div className="w-24 h-36 bg-gray-200 rounded-xl" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded" />
                      <div className="w-2/3 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              ) : variants.map((variant, idx) => (
                <div
                  key={variant._id || variant.id || idx}
                  onClick={() => {
                    setSelectedVariants({ [idx]: true });
                  }}
                  className={`border-2 border-[#2B4282] rounded-3xl p-4 flex flex-col justify-between transition cursor-pointer bg-white relative hover:shadow-md ${selectedVariants[idx] ? "ring-2 ring-[#2B4282] bg-teal-50/10" : ""}`}
                >
                  <div className="flex items-center justify-center p-2 h-36">
                    <img
                      src={variant.image || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&fit=crop"}
                      alt={selectedModel}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-850">
                      {selectedModel}
                    </h3>
                    <p className="text-xs font-bold text-gray-500">{variant.color}</p>
                    <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{variant.storage} • ₹{variant.price}</p>
                  </div>

                  {/* Selection Checkbox */}
                  <div className="flex justify-end pt-2">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${selectedVariants[idx] ? "bg-[#2B4282] border-[#2B4282] text-white" : "border-gray-300 bg-white"}`}>
                      {selectedVariants[idx] && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Lead Finish Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmittingLead}
                className={`text-white font-extrabold text-sm py-3.5 px-24 rounded-full shadow-md hover:shadow-lg transition border-none flex items-center gap-2 ${
                  isSubmittingLead ? "bg-gray-400 cursor-not-allowed" : "bg-[#2B4282] hover:bg-[#0fa6b2] cursor-pointer"
                }`}
              >
                {isSubmittingLead && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isSubmittingLead ? "Submitting..." : "Submit Lead & Finish"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
