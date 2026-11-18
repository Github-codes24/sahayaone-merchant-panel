import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public Pages (Always loaded so auth works fast)
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

// Protected Pages (Lazily loaded to prevent code/data leaking to unauthenticated users)
const MainLayout = lazy(() => import("./pages/MainLayout")); // Contains route guard
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const ClientManagement = lazy(() => import("./pages/ClientManagement"));
const AddClient = lazy(() => import("./pages/AddClient"));
const EditClient = lazy(() => import("./pages/EditClient"));
const ClientDetails = lazy(() => import("./pages/ClientDetails"));
const ClientLoans = lazy(() => import("./pages/ClientLoans"));
const LoanDetails = lazy(() => import("./pages/LoanDetails"));
const LeadsManagement = lazy(() => import("./pages/LeadsManagement"));
const BranchLeads = lazy(() => import("./pages/BranchLeads"));
const MerchantLeads = lazy(() => import("./pages/MerchantLeads"));
const LeadDetails = lazy(() => import("./pages/LeadDetails"));
const AddLead = lazy(() => import("./pages/AddLead"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const AddSubscription = lazy(() => import("./pages/AddSubscription"));
const EditSubscription = lazy(() => import("./pages/EditSubscription"));
const RevenueManagement = lazy(() => import("./pages/RevenueManagement"));
const PaymentDetails = lazy(() => import("./pages/PaymentDetails"));
const Notifications = lazy(() => import("./pages/Notifications"));
const HelpSupport = lazy(() => import("./pages/HelpSupport"));
const SIPComingSoon = lazy(() => import("./pages/SIPComingSoon"));
const Verification = lazy(() => import("./pages/Verification"));
const CibilScore = lazy(() => import("./pages/CibilScore"));

// Wrapper for public routes
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center"><img src="/Logo.png" alt="Loading" className="h-16 animate-pulse opacity-80 drop-shadow-md" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center"><img src="/Logo.png" alt="Loading" className="h-16 animate-pulse opacity-80 drop-shadow-md" /></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// Wrapper for lazy components
const LazyRoute = ({ Component }) => (
  <Suspense fallback={<div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center w-full"><img src="/Logo.png" alt="Loading" className="h-16 animate-pulse opacity-80 drop-shadow-md" /></div>}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
        <Route path="/reset" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Dashboard & Management Routes (Protected by ProtectedRoute) */}
        <Route element={<ProtectedRoute><LazyRoute Component={MainLayout} /></ProtectedRoute>}>
          <Route path="/dashboard" element={<LazyRoute Component={Dashboard} />} />
          <Route path="/clients" element={<LazyRoute Component={ClientManagement} />} />
          <Route path="/clients/add" element={<LazyRoute Component={AddClient} />} />
          <Route path="/clients/:id" element={<LazyRoute Component={ClientDetails} />} />
          <Route path="/clients/:id/edit" element={<LazyRoute Component={EditClient} />} />
          <Route path="/clients/:id/loans" element={<LazyRoute Component={ClientLoans} />} />
          <Route path="/clients/:id/loans/:loanId" element={<LazyRoute Component={LoanDetails} />} />
          <Route path="/leads" element={<LazyRoute Component={LeadsManagement} />} />
          <Route path="/leads/branch" element={<LazyRoute Component={BranchLeads} />} />
          <Route path="/leads/merchant" element={<LazyRoute Component={MerchantLeads} />} />
          <Route path="/leads/branch/add" element={<LazyRoute Component={AddLead} />} />
          <Route path="/leads/branch/view/:id" element={<LazyRoute Component={LeadDetails} />} />
          <Route path="/leads/merchant/add" element={<LazyRoute Component={AddLead} />} />
          <Route path="/leads/merchant/view/:id" element={<LazyRoute Component={LeadDetails} />} />
          <Route path="/subscriptions" element={<LazyRoute Component={SubscriptionManagement} />} />
          <Route path="/subscriptions/add" element={<LazyRoute Component={AddSubscription} />} />
          <Route path="/subscriptions/:id/edit" element={<LazyRoute Component={EditSubscription} />} />
          <Route path="/revenue" element={<LazyRoute Component={RevenueManagement} />} />
          <Route path="/revenue/:id" element={<LazyRoute Component={PaymentDetails} />} />
          <Route path="/profile" element={<LazyRoute Component={Profile} />} />
          <Route path="/notifications" element={<LazyRoute Component={Notifications} />} />
          <Route path="/settings/help" element={<LazyRoute Component={HelpSupport} />} />
          <Route path="/sip" element={<LazyRoute Component={SIPComingSoon} />} />
          <Route path="/verification" element={<LazyRoute Component={Verification} />} />
          <Route path="/cibil-score" element={<LazyRoute Component={CibilScore} />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;