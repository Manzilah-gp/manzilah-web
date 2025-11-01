import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import AntdConfigProvider from './context/AntdConfigProvider';

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import MinistryDashboard from './pages/Dashboard/MinistryDashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Auth/Unauthorized"

import './App.css';

function App() {
  return (

    <AuthProvider>
      <AntdConfigProvider>
        <Router>
          <div className="App">

            <Routes>
              {/* Default Route → show Login */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/dashboard/ministry" element={<MinistryDashboard />} />


              {/* Protected Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["student", "parent", "mosque"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AntdConfigProvider>
    </AuthProvider>
  );
}

export default App;
