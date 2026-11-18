import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Download, User, Smartphone, Phone, FileText, Landmark, Image } from "lucide-react";
import { leadService } from "../services/leadService";

// Helper function to format date properly
const formatDate = (dateStr) => {
  if (!dateStr) return <NASkeleton />;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const d = date.getDate();
  const m = date.toLocaleString("default", { month: "short" });
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
};

const SkeletonRow = ({ width = "w-full" }) => (
  <div className={`h-4 bg-gray-200 rounded animate-pulse ${width}`}></div>
);

const NASkeleton = () => (
  <div className="w-12 h-3.5 bg-gray-200 rounded-md animate-pulse opacity-70"></div>
);

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  
  if (!src || error) {
    return <div className="w-16 h-16 md:w-20 md:h-20 border border-gray-300 rounded flex items-center justify-center bg-gray-50 text-[10px] text-gray-400 text-center p-2 leading-tight">{alt} Unavailable</div>;
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};

export default function LeadDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine source path from location to return to the correct list
  const sourcePath = location.pathname.includes("merchant") ? "merchant" : "branch";

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      leadService.getLeadDetails(id)
        .then(res => {
          if (res) {
            setSelectedLead(res.data || res.lead || res);
          }
        })
        .catch(err => {
          console.error("Failed to fetch lead details:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full font-sans pb-16 animate-pulse">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex flex-col gap-2">
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
                <div className="w-48 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
              <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-14 bg-gray-100"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-64"></div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-48"></div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#2B4282]/50 rounded-xl shadow-lg border border-[#1E356A]/50 h-56"></div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedLead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-red-500 font-semibold">Lead not found</div>
        <button
          onClick={() => navigate(`/leads/${sourcePath}`)}
          className="px-4 py-2 bg-gray-100 text-[#2B4282] font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 font-sans">
      
      {/* Header and Back */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-[#2B4282] m-0 leading-none">Lead Details</h1>
            <p className="text-xs font-semibold text-gray-500 m-0 mt-1">
              Dashboard &gt; Leads &gt; <span className="text-[#2B4282]">View Lead</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-5">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Basic Information */}
          <section>
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3">Basic Information</h2>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Application ID</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.applicationId || "N/A"}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Status</label>
                <div className="text-sm font-bold text-gray-900 uppercase">{selectedLead.status || "NEW"}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Created On</label>
                <div className="text-sm font-medium text-gray-900">{formatDate(selectedLead.createdAt)}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Current Step</label>
                <div className="text-sm font-medium text-gray-900 capitalize">{selectedLead.currentStep ? selectedLead.currentStep.replace(/_/g, " ") : "N/A"}</div>
              </div>
            </div>
          </section>

          {/* Product Details */}
          <section>
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3">Product Details</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Brand</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.productDetails?.brandName || "N/A"}</div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Model Name</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.productDetails?.modelName || selectedLead.loanInformation?.productName || "N/A"}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">IMEI Number</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.productDetails?.imeiNumber || "N/A"}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Customer Profile */}
        <section>
          <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3">Customer Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-3 gap-x-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Full Name</label>
              <div className="text-sm font-medium text-gray-900">{selectedLead.customerDetails?.fullName || selectedLead.personalInformation?.fullName || selectedLead.customer?.fullName || "N/A"}</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Phone Number</label>
              <div className="text-sm font-medium text-gray-900">{selectedLead.customerDetails?.phoneNumber || selectedLead.personalInformation?.phoneNumber || selectedLead.customer?.phoneNumber || "N/A"}</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Gender</label>
              <div className="text-sm font-medium text-gray-900 capitalize">{selectedLead.customerDetails?.gender || selectedLead.personalInformation?.gender || "N/A"}</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Date of Birth</label>
              <div className="text-sm font-medium text-gray-900">{formatDate(selectedLead.customerDetails?.dob || selectedLead.personalInformation?.dob)}</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">PAN Number</label>
              <div className="text-sm font-medium text-gray-900 uppercase">{selectedLead.customerDetails?.panNumber || selectedLead.personalInformation?.panNumber || "N/A"}</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Aadhaar Number</label>
              <div className="text-sm font-medium text-gray-900">{selectedLead.customerDetails?.aadhaarNumber || selectedLead.personalInformation?.aadhaarNumber || "N/A"}</div>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Residential Address</label>
              <div className="text-sm font-medium text-gray-900 truncate" title={selectedLead.customerDetails?.address || selectedLead.personalInformation?.address || selectedLead.customer?.address}>
                {selectedLead.customerDetails?.address || selectedLead.personalInformation?.address || selectedLead.customer?.address || "N/A"}
                {(selectedLead.customerDetails?.city || selectedLead.customerDetails?.state) && (
                   <span>, {selectedLead.customerDetails?.city} {selectedLead.customerDetails?.state}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Financial Overview */}
          <section>
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3">Financial Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Product Price</label>
                <div className="text-sm font-medium text-gray-900">₹{(selectedLead.productDetails?.productPrice || selectedLead.financialDetails?.productPrice || selectedLead.loanInformation?.productPrice || selectedLead.mrp || 0).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Down Payment</label>
                <div className="text-sm font-medium text-gray-900">₹{(selectedLead.financialDetails?.downPayment || selectedLead.downPaymentAmount || selectedLead.downPayment || 0).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Loan Amount</label>
                <div className="text-sm font-medium text-gray-900">₹{(selectedLead.financialDetails?.totalLoanAmount || selectedLead.outstandingAmount || selectedLead.balance || 0).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">EMI Schedule</label>
                <div className="text-sm font-medium text-gray-900">₹{(selectedLead.financialDetails?.emiAmount || selectedLead.loanInformation?.emiAmount || 0).toLocaleString()}/m</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Tenure</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.financialDetails?.tenureMonths || selectedLead.loanInformation?.emiDuration || 0} Months</div>
              </div>
            </div>
          </section>

          {/* Settlement Details */}
          <section>
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3">Settlement Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Status</label>
                <div className="text-sm font-medium text-gray-900 capitalize">{selectedLead.settlementDetails?.settlementStatus ? selectedLead.settlementDetails.settlementStatus.replace(/_/g, " ") : "N/A"}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Net Disbursal</label>
                <div className="text-sm font-medium text-gray-900">₹{(selectedLead.settlementDetails?.netDisbursalAmount || selectedLead.financialDetails?.netDisbursalAmount || 0).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Settled At</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.settlementDetails?.settledAt ? formatDate(selectedLead.settlementDetails.settledAt) : "Pending"}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Transaction Ref</label>
                <div className="text-sm font-medium text-gray-900">{selectedLead.settlementDetails?.paymentTxnRef || "N/A"}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Verification Documents */}
        <section>
          <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3">Verification Documents</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Live Photo</label>
              <ImageWithFallback 
                src={selectedLead.customerDetails?.livePhoto || selectedLead.personalInformation?.avatar} 
                className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-300 rounded" 
                alt="Live Photo" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">PAN Card</label>
              <ImageWithFallback 
                src={selectedLead.customerDetails?.panImage || selectedLead.documents?.panCardUrl} 
                className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-300 rounded" 
                alt="PAN Card" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Aadhaar Card</label>
              <ImageWithFallback 
                src={selectedLead.customerDetails?.aadhaarImage || selectedLead.documents?.aadhaarCardUrl} 
                className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-300 rounded" 
                alt="Aadhaar Card" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">IMEI Photo</label>
              <ImageWithFallback 
                src={selectedLead.productDetails?.imeiPhoto} 
                className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-300 rounded" 
                alt="IMEI Photo" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Product Photo</label>
              <ImageWithFallback 
                src={selectedLead.productDetails?.productPhoto} 
                className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-300 rounded" 
                alt="Product Photo" 
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
