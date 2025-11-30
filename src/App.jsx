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
import StatisticsView from './components/Dashboard/Ministry/Statistics';
import AddMosqueView from './pages/MinistryDashboard/AddMosque/AddMosqueView';
import MosqueListView from './pages/MinistryDashboard/MosqueList/MosqueListView';
import EditMosqueForm from './pages/MinistryDashboard/EditMosqueForm/EditMosqueForm';
import MinistryDashboard from './pages/MinistryDashboard/MinistryDashboard';


import './App.css';

function App() {
  return (

    <AuthProvider>
      <AntdConfigProvider>
        <Router>
          <div className="App" style={{ height: '100vh', width: '100vw' }}>

            <Routes>
              {/* Default Route → show Login */}
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
                    < StatisticsView />
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

                {/* Settings Routes - Ministry Admin only */}
                <Route
                  path="settings/general"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <div>General Settings - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="settings/notifications"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <div>Notification Settings - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />

                {/* Donation Routes - Ministry Admin only */}
                <Route
                  path="donations/pending"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <div>Pending Donations - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="donations/approved"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <div>Approved Donations - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="donations/rejected"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <div>Rejected Donations - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />

                {/* Mosque Admin Routes */}
                <Route
                  path="my-mosque"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <div>My Mosque - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin', 'teacher']}>
                      <div>Courses - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />

                {/* Teacher Routes */}
                <Route
                  path="my-courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <div>My Courses - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="students"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <div>My Students - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="enrolled-courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['student']}>
                      <div>Enrolled Courses - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="attendance"
                  element={
                    <RoleProtectedRoute allowedRoles={['student']}>
                      <div>Attendance - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />

                {/* Parent Routes */}
                <Route
                  path="children"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <div>My Children - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="progress"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <div>Progress Reports - To be implemented</div>
                    </RoleProtectedRoute>
                  }
                />

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

              {/* Chat - accessible to all authenticated users */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <div>Chat - To be implemented</div>
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
