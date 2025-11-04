import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryProvider } from "./providers/QueryProvider"
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from "./components/ProtectedRouteNew"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import DashboardLayout from "./pages/DashboardLayout"
import HomeDashboard from "./components/HomeDashboard"
import TeamDashboard from "./components/TeamDashboard"
import ProjectsDashboard from "./components/projects-dev/ProjectsDashboard"
import EmployeeDetail from "./components/EmployeeDetail"
import EmployeeDetailLayout from "./components/EmployeeDetailLayout"
import LeadTable from "./components/LeadTable"
import AgentDashboard from "./components/Agents/AgentDashboard"
import AgentDetail from "./components/Agents/AgentDetail"
import AgentDetailLayout from "./components/Agents/AgentDetailLayout"
import UserBroadCast from "./components/Brodacast/UserBroadCast"
import AdminBroadCast from "./components/Brodacast/AdminBroadCast"
import AddLead from "./pages/AddLead"
import EditLead from "./pages/EditLead"
import UserLeads from "./pages/UserLeads"
import AddProject from "./pages/AddProject"
import EditProject from "./pages/EditProject"

 

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

            {/* Protected routes - Dashboard at root */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/team-dashboard" element={<TeamDashboard />} />
              <Route path="/lead" element={<LeadTable />} />
              <Route path="/leads/add" element={<AddLead />} />
              <Route path="/leads/edit/:id" element={<EditLead />} />
              <Route path="/projects/add" element={<AddProject />} />
              <Route path="/projects/edit/:id" element={<EditProject />} />
              <Route path="/broadcast" element={<UserBroadCast/>} />
              <Route path="/broadcast/admin" element={<AdminBroadCast/>} />
              <Route path="/projects-dev" element={<ProjectsDashboard />} />
              <Route path="/agents" element={<AgentDashboard />} />
            </Route>

            {/* Employee Detail Layout with Different Sidebar - Protected */}
            <Route element={
              <ProtectedRoute>
                <EmployeeDetailLayout />
              </ProtectedRoute>
            }>
              <Route path="/employee/:id" element={<EmployeeDetail />} />
              <Route path="/employee/:id/leads" element={<UserLeads />} />
            </Route>

            {/* Agent Detail Layout - Protected */}
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
