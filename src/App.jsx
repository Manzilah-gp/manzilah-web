// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AntdConfigProvider from './context/AntdConfigProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';

// Layout
import MainLayout from './components/Layout/MainLayout';


// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Unauthorized from './pages/Auth/Unauthorized';
import TeacherRegistrationPage from './pages/TeacherRegister/TeacherRegistrationPage';

// Dashboard Pages
import StatisticsView from './components/Dashboard/Ministry/Statistics';
import AddMosqueView from './pages/MinistryDashboard/AddMosque/AddMosqueView';
import MosqueListView from './pages/MinistryDashboard/MosqueList/MosqueListView';
import EditMosqueForm from './pages/MinistryDashboard/EditMosqueForm/EditMosqueForm';

// Course - Mosque Dashboard
import CourseListView from './pages/MosqueAdminDashboard/CourseManagment/CourseList/CourseListView';
import CreateCourseView from './pages/MosqueAdminDashboard/CourseManagment/CreateCourse/CreateCourseView';
import EditCourseView from './pages/MosqueAdminDashboard/CourseManagment/EditCourse/EditCourseView';
import AssignTeacherView from './pages/MosqueAdminDashboard/CourseManagment/AssignTeacher/AssignTeacherView';
import ViewCourseView from './pages/MosqueAdminDashboard/CourseManagment/ViewCourse/ViewCourseView';
import MyMosqueView from './pages/MosqueAdminDashboard/MyMosque/MyMosqueView';


// Events 
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/Eventdetailspage';
import FundraisingApprovalsPage from './pages/Fundraisingapprovalspage';

//chatting
import ChatPage from './pages/Chatting/ChatPage';
import TeacherListPage from './pages/MosqueAdminDashboard/TeacherManagement/TeacherList/TeacherListPage';
import TeacherInfoPage from './pages/MosqueAdminDashboard/TeacherManagement/TeacherInfo/TeacherInfoPage';
import './App.css';

import Home from "./pages/Home";
import Profile from "./pages/ProfilePage";
import ProfileDetails from "./pages/ProfileDetails";

// Public Pages
import PublicCourses from "./pages/MosquesCoursesPublicPages/PublicCourses/PublicCoursesPage";
import PublicMosques from "./pages/MosquesCoursesPublicPages/PublicMosques/PublicMosquesPage";
import MosqueDetailsPage from './pages/MosquesCoursesPublicPages/MosqueDetails/MosqueDetailsPage';
import CourseDetailsPage from './pages/MosquesCoursesPublicPages/CourseDetails/CourseDetailsPage';

import CalendarPage from './pages/Calendar/CalendarPage';
import MyEnrollmentsPage from './pages/StudentDashboard/MyEnrollments/MyEnrollmentsPage';
import ViewCoursePage from './pages/StudentDashboard/ViewCourse/ViewCoursePage';

import MeetingRoomUIKit from './pages/MeetingRoom/MeetingRoomUIKit';
// import QiblaPage from './pages/QiblaPage/QiblaPage';
// import QuranReaderPage from './pages/QuranReader/QuranReaderPage';
import IslamicStoryteller from './pages/IslamicStoryteller/IslamicStoryteller';
import PaymentSuccess from './pages/Payment/PaymentSuccess';

function App() {
  return (

    <AuthProvider>
      <AntdConfigProvider>
        <Router>
          <div className="App" style={{ height: '100vh', width: '100vw' }}>
            {/* ============================================ */}
            {/* PUBLIC ROUTES - No authentication required */}
            {/* ============================================ */}

            <Routes>
              {/* Default Route → Home  */}
              <Route path="/public/Home" element={<Home />} />
              {/* Profile Details Page */}
              <Route path="/profile-details" element={<ProfileDetails />} />
              {/* <-- الإضافة المهمة */}

              {/* Auth Pages */}
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
              {/* <Route path="/qibla" element={<QiblaPage />} />
              <Route path="/quran" element={<QuranReaderPage />} /> */}


              {/* ============================================ */}
              {/* PUBLIC BROWSING PAGES */}
              {/* ============================================ */}
              <Route path="/public/courses" element={<PublicCourses />} />
              <Route path="/public/mosques" element={<PublicMosques />} />
              <Route path="/public/mosque/:id" element={<MosqueDetailsPage />} />
              <Route path="/public/course/:id" element={<CourseDetailsPage />} />


              {/* ============================================ */}
              {/* PROTECTED DASHBOARD ROUTES */}
              {/* ============================================ */}
              {/* Protected Dashboard Routes - wrapped in DashboardLayout */}
              <Route
                path="/"  
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >

                {/* Default redirect */}
                <Route index element={<Navigate to="/profile" replace />} />


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
                {/* <Route path="profile" element={<div>Profile Page</div>} /> */}
                <Route path="donations" element={<div>Donations</div>} />

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
                  path="donations"
                  element={
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <div>Donations</div>
                    </RoleProtectedRoute>
                  }
                />

                {/* Mosque Admin Routes */}

                {/* Mosque Admin Course Management Routes */}
                <Route
                  path="mosque-admin/courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <CourseListView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="mosque-admin/courses/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <CreateCourseView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="mosque-admin/courses/edit/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <EditCourseView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="mosque-admin/courses/assign-teacher/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <AssignTeacherView />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="mosque-admin/courses/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <ViewCourseView />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="my-mosque"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <MyMosqueView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="mosque-admin/teacher-list"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <TeacherListPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="mosque-admin/teacher-info/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['mosque_admin']}>
                      <TeacherInfoPage />
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
                  path="/my-enrollments"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'parent']}>
                      <MyEnrollmentsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="course/:enrollmentId"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'parent']}>
                      <ViewCoursePage />
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
                {/* Calendar */}
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/storyteller"
                  element={
                    <ProtectedRoute>
                      <IslamicStoryteller />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Edit Mosque - Separate route outside dashboard layout */}
              <Route
                path="/edit-mosque/:id"
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute allowedRoles={['ministry_admin']}>
                      <EditMosqueForm />
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                }
              />

              {/* Chat - accessible to all authenticated users
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <div>Chat - To be implemented</div>
                  </ProtectedRoute>
                }
              /> */}


              <Route path="/meeting/:roomId" element={
                <ProtectedRoute>
                  <MeetingRoomUIKit />
                </ProtectedRoute>
              } />


            

              {/* 404 Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />

{/* for the profile page */}
<Route path="/profile" element={<Profile />} />
{/* Events Page */}
<Route path="/events" element={<EventsPage />} />
<Route path="/events/:id" element={<EventDetailsPage />} />
<Route path="/fundraising-approvals" element={<FundraisingApprovalsPage />} />

{/*Chatting Route */}
<Route path="/chat" element={<ChatPage />} />
{/* Enrollment Payment Route */}
<Route path="/payment/success" element={<PaymentSuccess />} />

            </Routes>
          </div>
        </Router>
      </AntdConfigProvider>
    </AuthProvider>
  );
}

export default App;