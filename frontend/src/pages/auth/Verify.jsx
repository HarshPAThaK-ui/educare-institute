import React, { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { MdMarkEmailRead } from "react-icons/md";

const Verify = () => {

  const [otp, setOtp] = useState("");
  const{btnLoading, verifyOtp} = UserData();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(Number(otp), navigate);
    
  }
  return (
    <div className="auth-page">
      <div className="auth-form verify-form">
        <div className="verify-icon" aria-hidden="true">
          <MdMarkEmailRead />
        </div>
        <h2 className="verify-title">Verify Your Account</h2>
        <p className="verify-subtitle">Enter the OTP sent to your email to continue.</p>
        <form onSubmit={submitHandler}>
          <label htmlFor="otp">OTP</label>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
          />
          <button disabled={btnLoading} type="submit" className="common-btn student-btn">
            {btnLoading ? "Please Wait..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
