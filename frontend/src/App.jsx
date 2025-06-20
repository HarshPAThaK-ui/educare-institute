import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Courses from "./pages/courses/Courses";
import Account from "./pages/account/Account";
import AdminAccount from "./pages/admin/AdminAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import { UserData } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import Loading from "./components/loading/loading";

const App = () => {
  const { isAuth, user, loading, userRole } = UserData();

  return (
    <>
    {loading?(
      <Loading/>
  ) : (
    <BrowserRouter>
      <Header isAuth={isAuth} user={user} userRole={userRole} />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/programs" element={<Courses />} />
        <Route
          path="/student"
          element={isAuth && userRole === 'student' ? <StudentDashboard /> : <Navigate to={userRole === 'admin' ? '/admin' : '/login'} />}
        />
        <Route 
          path="/admin" 
          element={isAuth && userRole === 'admin' ? <AdminDashboard /> : <Navigate to={userRole === 'student' ? '/student' : '/login'} />} 
        />
        <Route
          path="/account"
          element={
            isAuth ? (
              userRole === 'admin' ? <AdminAccount user={user} /> : userRole === 'student' ? <Account user={user} /> : <Navigate to="/login" />
            ) : <Navigate to="/login" />
          }
        />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )}
    </>
  );
};

export default App;
