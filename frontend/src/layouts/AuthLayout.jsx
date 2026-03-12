import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./authLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-glow" aria-hidden="true" />
      <motion.div
        className="auth-layout-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="auth-layout-brand">
          <Link to="/" className="auth-layout-logo" aria-label="Educare Institute home">
            <span className="auth-layout-logo-mark">E</span>
            <span className="auth-layout-logo-text">Educare Institute</span>
          </Link>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
