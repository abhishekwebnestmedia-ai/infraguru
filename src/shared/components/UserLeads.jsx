import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TableView from '../../admin/components/TableView'
import DashboardHeader from '../../admin/components/DashboardHeader'
import api from '../services/apiService'
import { ToastContainer } from 'react-toastify'

const UserLeads = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)

  // Fetch employee data and set up filtering
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) {
        console.error('No employee ID provided in URL params');
        return;
      }

      try {
        // First, get real employee data from the API
        let employeeData;
        try {
          const teamsResponse = await api.get('/auth/teams');
          const users = teamsResponse.data?.users || [];
          employeeData = users.find(user => user._id === id);
          
          if (!employeeData) {
            // Fallback to mock data if user not found in API
            const getEmployeeById = (empId) => {
              const employees = {
                1: { name: "Arjun Sharma", designation: "Senior Developer", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997" },
                2: { name: "Priya Patel", designation: "UI/UX Designer", empId: "008", email: "priya@infraguru.com", phone: "+91 8171 839 998" },
                3: { name: "Rajesh Kumar", designation: "Project Manager", empId: "009", email: "rajesh@infraguru.com", phone: "+91 8171 839 999" },
              };
              return employees[empId] || { name: "Arjun Sharma", designation: "Senior Developer", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997" };
            };
            employeeData = getEmployeeById(id);
          }
        } catch (apiError) {
          console.log('Could not fetch teams from API, using mock data:', apiError.message);
          // Fallback to mock data
          const getEmployeeById = (empId) => {
            const employees = {
              1: { name: "Arjun Sharma", designation: "Senior Developer", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997" },
              2: { name: "Priya Patel", designation: "UI/UX Designer", empId: "008", email: "priya@infraguru.com", phone: "+91 8171 839 998" },
              3: { name: "Rajesh Kumar", designation: "Project Manager", empId: "009", email: "rajesh@infraguru.com", phone: "+91 8171 839 999" },
            };
            return employees[empId] || { name: "Arjun Sharma", designation: "Senior Developer", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997" };
          };
          employeeData = getEmployeeById(id);
        }

        console.log('Employee data for user-based leads:', employeeData);
        setEmployee(employeeData);
        
      } catch (err) {
        console.error('Error fetching employee:', err);
      }
    };

    fetchEmployee();
  }, [id]);

  return (
    <div className='flex flex-col gap-4'>
      {/* Header with employee name and buttons */}
      <DashboardHeader 
        title={`${employee?.name || 'Employee'} Leads`}
        showBackButton={true}
        backPath="/team-dashboard"
      />

  {/* TableView using user-based API by username */}
  {employee?.name && <TableView username={employee.name} />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}


export default UserLeads