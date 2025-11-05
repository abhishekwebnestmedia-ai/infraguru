import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryProvider } from "./shared/providers/QueryProvider"
import { AuthProvider } from './shared/contexts/AuthContext'
import ProtectedRoute from "./shared/components/ProtectedRouteNew"
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

// Shared imports
import UserBroadCast from "./shared/components/UserBroadCast"
import UserLeads from "./shared/components/UserLeads"
import Profile from "./shared/components/Profile"

 

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

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRole="admin">
                    <AdminDashboardLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route index element={
                  <RequirePermission feature="dashboard"><HomeDashboard /></RequirePermission>
                } />
                <Route path="dashboard" element={
                  <RequirePermission feature="dashboard"><HomeDashboard /></RequirePermission>
                } />
                <Route path="team-dashboard" element={
                  <RequirePermission feature="teamDashboard"><TeamDashboard /></RequirePermission>
                } />
                <Route path="leads" element={
                  <RequirePermission feature="leads"><LeadTable /></RequirePermission>
                } />
                <Route path="leads/add" element={
                  <RequirePermission feature="leads"><AddLead /></RequirePermission>
                } />
                <Route path="leads/edit/:id" element={
                  <RequirePermission feature="leads"><EditLead /></RequirePermission>
                } />
                <Route path="projects/add" element={
                  <RequirePermission feature="projects"><AddProject /></RequirePermission>
                } />
                <Route path="projects/edit/:id" element={
                  <RequirePermission feature="projects"><EditProject /></RequirePermission>
                } />
                <Route path="broadcast" element={
                  <RequirePermission feature="broadcast"><AdminBroadCast /></RequirePermission>
                } />
                <Route path="projects" element={
                  <RequirePermission feature="projects"><ProjectsDashboard /></RequirePermission>
                } />
                <Route path="agents" element={
                  <RequirePermission feature="agents"><AgentDashboard /></RequirePermission>
                } />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Admin Employee Detail Layout */}
              <Route path="/admin/employee" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRole="admin">
                    <EmployeeDetailLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route path=":id" element={<EmployeeDetail />} />
                <Route path=":id/leads" element={<UserLeads />} />
              </Route>

              {/* Admin Agent Detail Layout */}
              <Route path="/admin/agent" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRole="admin">
                    <AgentDetailLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route path=":id" element={<AgentDetail />} />
              </Route>

              {/* User routes */}
              <Route path="/user" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRole="user">
                    <UserDashboardLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route index element={<UserDashboard />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="leads" element={<UserLeads />} />
                <Route path="broadcast" element={<UserBroadCast />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Root redirect based on role */}
              <Route path="/" element={
                <ProtectedRoute>
                  <RoleBasedRoute />
                </ProtectedRoute>
              } />

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
