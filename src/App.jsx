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
import ChangePassword from './pages/Auth/ChangePassword';

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

// teacher Dashboard pages
import StudentProgressView from './pages/TeacherDashboard/StudentProgress/StudentProgressView';
import MyCoursesPage from './pages/TeacherDashboard/MyCourses/MyCoursesPage';
import AllStudentsPage from './pages/TeacherDashboard/Students/AllStudentsPage';
import CourseStudentsPage from './pages/TeacherDashboard/Students/CourseStudentsPage';
import CourseProgressListPage from './pages/TeacherDashboard/Students/CourseProgressListPage';
import AttendanceLoggingPage from './pages/TeacherDashboard/Attendance/AttendanceLoggingPage';
import CourseMaterialsPage from './pages/TeacherDashboard/CourseMaterials/CourseMaterialsPage';


//Parent/chilfren Progress /My Children 
import MyChildrenPage from './pages/ParentDashboard/MyChildrenPage';
import ChildProgressView from './pages/ParentDashboard/ChildProgressView';
import ProgressReportsPage from './pages/ParentDashboard/ProgressReportsPage';
import ChildOverviewPage from './pages/ParentDashboard/ChildOverviewPage';



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
              {/*  Route → Home  */}
              <Route path="/public/Home" element={<Home />} />
              {/* Profile Details Page */}

              {/* Auth Pages */}
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
              <Route path="/change-password" element={<ChangePassword />} />
              {/* <Route path="/qibla" element={<QiblaPage />} />
              <Route path="/quran" element={<QuranReaderPage />} /> */}


              {/* ============================================ */}
              {/* PUBLIC BROWSING PAGES */}
              {/* ============================================ */}
              <Route path="/public/courses" element={<PublicCourses />} />
              <Route path="/public/mosques" element={<PublicMosques />} />
              <Route path="/public/mosque/:id" element={<MosqueDetailsPage />} />
              <Route path="/public/course/:id" element={<CourseDetailsPage />} />

              {/* Default redirect */}
              <Route index element={<Navigate to="/profile" replace />} />


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

                {/* Profile Routes */}
                <Route path="profile" element={<Profile />} />
                <Route path="profile-details" element={<ProfileDetails />} />


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

                <Route path="profile-details" element={<ProfileDetails />} />

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
                  path="teacher/my-courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <MyCoursesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="teacher/student-progress/:enrollmentId"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher', 'mosque_admin']}>
                      <StudentProgressView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="teacher/attendance/:courseId"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <AttendanceLoggingPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="teacher/students"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <AllStudentsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="teacher/course/:courseId/students"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <CourseStudentsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="teacher/course/:courseId/progress"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <CourseProgressListPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="teacher/student-progress/:enrollmentId"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                      <StudentProgressView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="course/:courseId/materials"
                  element={
                    <ProtectedRoute>
                      <CourseMaterialsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="my-enrollments"
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
                  path="parent/children"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <MyChildrenPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="parent/children/:childId"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <ChildOverviewPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="parent/progress/:enrollmentId"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <ChildProgressView />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="parent/reports"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <ProgressReportsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="parent/children/:childId"
                  element={
                    <RoleProtectedRoute allowedRoles={['parent']}>
                      <ChildOverviewPage />
                    </RoleProtectedRoute>
                  } />

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

                {/* Events Page */}

                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/fundraising-approvals" element={<FundraisingApprovalsPage />} />

              </Route>{/* End of Layout */}

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