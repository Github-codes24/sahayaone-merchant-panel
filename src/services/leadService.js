import { apiClient } from "./apiClient";

export const leadService = {
  // 1. GET LEAD LIST DASHBOARD
  getLeads: (status = "ALL", page = 1, limit = 10, filters = {}) => {
    let query = `?status=${status.toUpperCase()}&page=${page}&limit=${limit}`;
    if (filters.search) query += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.state) query += `&state=${encodeURIComponent(filters.state)}`;
    if (filters.city) query += `&city=${encodeURIComponent(filters.city)}`;
    if (filters.startDate && filters.endDate) {
      query += `&startDate=${encodeURIComponent(filters.startDate)}`;
      query += `&endDate=${encodeURIComponent(filters.endDate)}`;
    }
    if (filters.source) query += `&source=${encodeURIComponent(filters.source)}`;
    return apiClient(`/api/v1/merchant/leads${query}`, { method: "GET" });
  },

  // 2. SEND PHONE VERIFICATION OTP CODE
  sendLookupOtp: (payload) =>
    apiClient("/api/v1/merchant/leads/send-lookup-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 3. SUBMIT PHONE VERIFICATION OTP
  verifyLookupOtp: (payload) =>
    apiClient("/api/v1/merchant/leads/verify-lookup-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 4. INITIATE ONBOARDING (Aadhaar OTP Dispatch)
  onboard: (payload) =>
    apiClient("/api/v1/merchant/leads/onboard", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 5. VERIFY AADHAAR OTP
  verifyAadhaar: (payload) =>
    apiClient("/api/v1/merchant/leads/verify-aadhaar", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 6. CONFIRM ONBOARDING
  confirmOnboard: (payload) =>
    apiClient("/api/v1/merchant/leads/confirm-onboard", {
      method: "POST",
      body: payload,
    }),

  // 7. GET CATALOG BRANDS
  getBrands: () =>
    apiClient("/api/v1/merchant/catalog/brands", { method: "GET" }),

  // 8. GET CATALOG PRODUCTS
  getProducts: (brandId) =>
    apiClient(`/api/v1/merchant/catalog/products?brandId=${brandId}`, { method: "GET" }),

  // 9. GET CATALOG PRODUCT VARIANTS
  getProductVariants: (productId) =>
    apiClient(`/api/v1/merchant/catalog/products/${productId}/variants`, { method: "GET" }),

  // 10. CREATE DRAFT LEAD APPLICATION
  createLead: (payload) =>
    apiClient("/api/v1/merchant/leads/create", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 11, 20. GET LEAD DETAILS
  getLeadDetails: (leadId) =>
    apiClient(`/api/v1/merchant/leads/${leadId}`, { method: "GET" }),

  // 12. CHECK ELIGIBLE EMI SLABS
  getSlabs: (productPrice) =>
    apiClient(`/api/v1/employee/loans/slabs?productPrice=${productPrice}`, { method: "GET" }),

  // 13. PREVIEW/CALCULATE EMI BREAKDOWN
  calculateEmi: (payload) =>
    apiClient("/api/v1/employee/loans/calculate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 14. ADD REPAYMENT BANK ACCOUNT
  addBankAccount: (leadId, payload) =>
    apiClient(`/api/v1/employee/loans/${leadId}/bank-account`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 15. REQUEST DISBURSAL AUTHORIZATION OTP
  sendDisbursalOtp: (leadId) =>
    apiClient(`/api/v1/employee/loans/${leadId}/send-disbursal-otp`, {
      method: "POST",
    }),

  // 16. SUBMIT DISBURSAL OTP & DIGITAL SIGNATURE
  setupEmi: (leadId, payload) =>
    apiClient(`/api/v1/employee/loans/${leadId}/setup-emi`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 17. GET DOCUMENT AGREEMENT LINK
  getAgreement: (leadId) =>
    apiClient(`/api/v1/employee/loans/${leadId}/documents/agreement`, { method: "GET" }),

  // 18. INITIATE REPAYMENT DOWN PAYMENT
  initiatePayment: (leadId, payload) =>
    apiClient(`/api/v1/employee/loans/${leadId}/payment/initiate`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 19. VERIFY REPAYMENT DOWN PAYMENT
  verifyPayment: (leadId, payload) =>
    apiClient(`/api/v1/employee/loans/${leadId}/payment/verify`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 21. COLLECT EMI INSTALLMENT PAYMENTS
  collectEmi: (leadId, payload) =>
    apiClient(`/api/v1/employee/loans/${leadId}/collect-emi`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
