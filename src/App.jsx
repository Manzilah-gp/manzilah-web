// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AntdConfigProvider from './context/AntdConfigProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';

// Layout
import MainLayout from './components/Layout/MainLayout';


// Public Pages
// import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Unauthorized from './pages/Auth/Unauthorized';
import TeacherRegistrationPage from './pages/TeacherRegister/TeacherRegistrationPage';

// Dashboard Pages
import AddMosqueView from './pages/MinistryDashboard/AddMosque/AddMosqueView';
import MosqueListView from './pages/MinistryDashboard/MosqueList/MosqueListView';
import EditMosqueForm from './pages/MinistryDashboard/EditMosqueForm/EditMosqueForm';
import MinistryDashboard from './pages/MinistryDashboard/MinistryDashboard';
import MainSideBar from "./components/MainSideBar/MainSideBar";


import './App.css';

import Home from "./pages/Home"; 
import Profile from "./pages/ProfilePage";
import ProfileDetails from "./pages/ProfileDetails"; // <-- تمت الإضافة هنا

function App() {
  return (

    <AuthProvider>
      <AntdConfigProvider>
        <Router>
          <div className="App" style={{ height: '100vh', width: '100vw' }}>

            <Routes>
              {/* Default Route → Home */} 
          <Route path="/" element={<Profile />} />

          {/* Profile Details Page */} 
          <Route path="/profile-details" element={<ProfileDetails />} /> 
          {/* <-- الإضافة المهمة */}

          {/* Auth Pages */}
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/register/teacher" element={<TeacherRegistrationPage />} />



              {/* Protected Dashboard Routes - wrapped in DashboardLayout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                {/* Default redirect */}
                <Route index element={<Navigate to="/dashboard/statistics" replace />} />




                {/* Ministry Admin Routes */}
                <Route path="statistics" element={
                  <RoleProtectedRoute allowedRoles={['ministry_admin', 'mosque_admin']}>
                    < MinistryDashboard />
                  </RoleProtectedRoute>
                } />

                <Route
                  path="add-mosque"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <AddMosqueView />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="mosque-list"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <MosqueListView />
                    </RoleProtectedRoute>
                  }
                />


                {/* Profile, Settings, etc. */}
                <Route path="profile" element={<div>Profile Page</div>} />
                <Route path="settings/*" element={<div>Settings</div>} />
                <Route path="donations/*" element={<div>Donations</div>} />
              </Route>

              {/* Edit Mosque - Separate route outside dashboard layout */}
              <Route
                path="/dashboard/edit-mosque/:id"
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <EditMosqueForm />
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        </Router>
      </AntdConfigProvider>
    </AuthProvider>
  );
}

export default App;
