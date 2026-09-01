import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API_URL from "../services/api";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState(location.state?.demoOtp || "");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDemoMode = Boolean(demoOtp);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("Please enter your email and OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email verification failed.");
        return;
      }

      setSuccess(
        data.message || "Email verified successfully. You can now login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Email verification error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);

      const response = await fetch(
        `${API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend OTP.");
        return;
      }

      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
      }

      setSuccess(
        data.message || "A new OTP has been sent to your email."
      );
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>

        <p>
          Enter the OTP sent to your email address to verify your account.
        </p>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        {isDemoMode && (
          <div className="success-message">
            <strong>Demo Mode</strong>

            <p>Your verification OTP is:</p>

            <h2>{demoOtp}</h2>

            <p>Use this OTP to verify your email.</p>
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading || resending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="otp">Verification OTP</label>

            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resending || loading}
          className="resend-button"
        >
          {resending ? "Sending OTP..." : "Resend OTP"}
        </button>

        <p className="auth-link">
          Already verified?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;