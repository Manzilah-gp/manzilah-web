// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import UserDashboard from "./pages/Dashboard/UserDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Unauthorized from "./pages/Auth/Unauthorized"
// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Default Route → show Login */}

//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Protected Dashboard */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["student", "parent", "mosque"]}>
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Auth/Unauthorized";
import Home from "./pages/Home"; 
import Profile from "./pages/ProfilePage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default Route → redirect to Home */}
           <Route path="/" element={<Profile />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
