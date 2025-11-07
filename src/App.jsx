import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryProvider } from "./shared/providers/QueryProvider"
import { AuthProvider } from './shared/contexts/AuthContext'
import ProtectedRoute from "./shared/components/ProtectedRouteNew"
import { useAuth } from './shared/hooks/useAuth'
import RoleBasedRoute from "./shared/components/RoleBasedRoute"
import RequirePermission from "./shared/components/RequirePermission"

// Auth pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

// Admin imports
import AdminDashboardLayout from "./admin/pages/DashboardLayout"
import HomeDashboard from "./admin/components/HomeDashboard"
import TeamDashboard from "./admin/components/TeamDashboard"
import ProjectsDashboard from "./admin/components/projects-dev/ProjectsDashboard"
import EmployeeDetail from "./admin/components/EmployeeDetail"
import EmployeeDetailLayout from "./admin/components/EmployeeDetailLayout"
import LeadTable from "./admin/components/LeadTable"
import AgentDashboard from "./admin/components/Agents/AgentDashboard"
import AgentDetail from "./admin/components/Agents/AgentDetail"
import AgentDetailLayout from "./admin/components/Agents/AgentDetailLayout"
import AdminBroadCast from "./admin/components/AdminBroadCast"
import AddLead from "./admin/pages/AddLead"
import EditLead from "./admin/pages/EditLead"
import AddProject from "./admin/pages/AddProject"
import EditProject from "./admin/pages/EditProject"

// User imports
import UserDashboardLayout from "./user/pages/UserDashboardLayout"
import UserDashboard from "./user/pages/UserDashboard"
import FeaturePlaceholder from "./user/pages/FeaturePlaceholder"

// Shared imports
import UserBroadCast from "./shared/components/UserBroadCast"
import UserLeads from "./shared/components/UserLeads"
import Profile from "./shared/components/Profile"
import DashboardSwitcher from "./shared/components/DashboardSwitcher"
import NotificationsPage from "./shared/components/NotificationsPage"

// Choose layout by role
function RoleLayout() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return user?.role === 'admin' ? <AdminDashboardLayout /> : <UserDashboardLayout />;
}

// Legacy role prefixes removed; no redirect shim to avoid navigation loops.

function App() {
  return (
    <>
      <QueryProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/** legacy /admin and /user prefixes are no longer supported */}

              {/* Unified routes without role prefixes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <RoleLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<RequirePermission feature="dashboard"><DashboardSwitcher /></RequirePermission>} />
                <Route path="team-dashboard" element={<RequirePermission feature="teamDashboard"><TeamDashboard /></RequirePermission>} />
                <Route path="leads" element={<RequirePermission feature="leads"><LeadTable /></RequirePermission>} />
                <Route path="leads/add" element={<RequirePermission feature="leads"><AddLead /></RequirePermission>} />
                <Route path="leads/edit/:id" element={<RequirePermission feature="leads"><EditLead /></RequirePermission>} />
                <Route path="projects" element={<RequirePermission feature="projects"><ProjectsDashboard /></RequirePermission>} />
                <Route path="projects/add" element={<RequirePermission feature="projects"><AddProject /></RequirePermission>} />
                <Route path="projects/edit/:id" element={<RequirePermission feature="projects"><EditProject /></RequirePermission>} />
                <Route path="agents" element={<RequirePermission feature="agents"><AgentDashboard /></RequirePermission>} />
                <Route path="broadcast" element={<RequirePermission feature="broadcast"><AdminBroadCast /></RequirePermission>} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Employee Detail Layout (shared) */}
              <Route path="/employee" element={
                <ProtectedRoute>
                  <EmployeeDetailLayout />
                </ProtectedRoute>
              }>
                <Route path=":id" element={<EmployeeDetail />} />
                <Route path=":id/leads" element={<UserLeads />} />
              </Route>

              {/* Agent Detail Layout (shared) */}
              <Route path="/agent" element={
                <ProtectedRoute>
                  <AgentDetailLayout />
                </ProtectedRoute>
              }>
                <Route path=":id" element={<AgentDetail />} />
              </Route>

              {/* Redirect any unmatched routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryProvider>
    </>
  )
}

export default App
