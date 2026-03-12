import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Verify from "./pages/auth/Verify";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Courses from "./pages/courses/Courses";
import Account from "./pages/account/Account";
import AdminAccount from "./pages/admin/AdminAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Sidebar from "./pages/admin/Sidebar";
import StudentSidebar from "./pages/student/StudentSidebar";
import StudentDashboard from "./pages/student/StudentDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import { UserData } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import Loading from "./components/loading/Loading";

const App = () => {
  const { isAuth, user, loading, userRole } = UserData();

  return (
    <>
    {loading?(
      <Loading/>
  ) : (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
        <Route path="/programs" element={<PublicLayout><Courses /></PublicLayout>} />
        <Route
          path="/student"
          element={isAuth && userRole === 'student' ? <StudentDashboard /> : <Navigate to={userRole === 'admin' ? '/admin' : '/login'} />}
        />
        <Route 
          path="/admin" 
          element={isAuth && userRole === 'admin' ? <AdminDashboard /> : <Navigate to={userRole === 'student' ? '/student' : '/login'} />} 
        />
        <Route
          path="/admin-account"
          element={
            isAuth && userRole === 'admin' ? (
              <DashboardLayout
                sidebar={
                  <Sidebar
                    activeTab="settings"
                    onTabChange={(tab) => {
                      window.location.href = `/admin?tab=${tab}`;
                    }}
                  />
                }
              >
                <AdminAccount user={user} />
              </DashboardLayout>
            ) : <Navigate to={userRole === 'student' ? '/student' : '/login'} />
          }
        />
        <Route
          path="/account"
          element={
            isAuth ? (
              userRole === 'admin'
                ? <Navigate to="/admin-account" />
                : userRole === 'student'
                  ? (
                    <DashboardLayout
                      sidebar={
                        <StudentSidebar
                          activeTab="overview"
                          onTabChange={() => {
                            window.location.href = "/student";
                          }}
                        />
                      }
                    >
                      <Account user={user} />
                    </DashboardLayout>
                  )
                  : <Navigate to="/login" />
            ) : <Navigate to="/login" />
          }
        />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/verify" element={<AuthLayout><Verify /></AuthLayout>} />
      </Routes>
    </BrowserRouter>
  )}
    </>
  );
};

export default App;
