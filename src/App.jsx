import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import DashboardLayout from "./pages/DashboardLayout"
import HomeDashboard from "./components/HomeDashboard"
import TeamDashboard from "./components/TeamDashboard"
import ProjectsDashboard from "./components/projects-dev/ProjectsDashboard"

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/register" element={<Register />} />
            
            {/* Layout Route without path - wraps all dashboard pages */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<HomeDashboard />} />
              <Route path="/team-dashboard" element={<TeamDashboard/>}/>
              <Route path="/lead" element={<div>Lead Component</div>}/>
              <Route path="/broadcast" element={<div>Broadcast Component</div>}/>
              <Route path="/projects-dev" element={<ProjectsDashboard/>}/>
              <Route path="/agents" element={<div>Agents Component</div>}/>
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
