import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

// Create context
const UserContext = createContext();

// Context Provider component
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState('student'); // 'student' or 'admin'
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true); // for initial fetch loading

  // Login handler with role support
  async function loginUser(email, password, navigate, role = 'student') {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
        role, // Send role to backend
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role || role);
      setUser(data.user);
      setUserRole(data.user.role || role);
      setIsAuth(true);
      setBtnLoading(false);
      
      // Navigate based on role
      if (data.user.role === 'admin' || role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      
      // Handle specific role validation errors
      if (error?.response?.status === 403) {
        toast.error(error?.response?.data?.message || "Access denied. Please use the correct login portal.");
      } else {
        toast.error(error?.response?.data?.message || "Login failed");
      }
    }
  }

  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
        role: 'student', // Default role for new registrations
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);

      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
     toast.error(error.response.data.message || "Registration failed");
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });
      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
     toast.error(error.response.data.message);
    }
  }

  // Logout handler
  async function logoutUser(navigate) {
    try {
      await axios.post(`${server}/api/user/logout`, {}, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
    } catch (error) {
      console.log("Logout error:", error.message);
    } finally {
      localStorage.clear();
      setUser([]);
      setIsAuth(false);
      setUserRole('student');
      navigate("/login");
      toast.success("Logged out successfully");
    }
  }

  // Fetch user on page reload if token exists
  async function fetchUser() {
    const token = localStorage.getItem("token");
    
    // If no token exists, user is not authenticated
    if (!token) {
      setIsAuth(false);
      setUser([]);
      setUserRole('student');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: token,
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setUserRole(data.user.role || localStorage.getItem("userRole") || 'student');
      setLoading(false);
    } catch (error) {
      console.log("Fetch user failed:", error.message);
      // Clear invalid token and reset auth state
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      setIsAuth(false);
      setUser([]);
      setUserRole('student');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const contextValue = {
    user,
    setUser,
    isAuth,
    setIsAuth,
    userRole,
    setUserRole,
    loginUser,
    logoutUser,
    btnLoading,
    loading,
    registerUser,
    verifyOtp,
  };

  return (
    <UserContext.Provider value={contextValue}>
      <>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </>
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const UserData = () => useContext(UserContext);
