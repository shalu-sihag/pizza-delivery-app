import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import API_URL from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // ========================================
      // UPDATE AUTH CONTEXT
      // ========================================

      login(data.user, data.token);

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message || "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "20px",
      }}
    >
      <h1>Login</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        {/* EMAIL */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* PASSWORD */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* FORGOT PASSWORD */}

        <div
          style={{
            textAlign: "right",
            marginBottom: "15px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password")
            }
            style={{
              border: "none",
              background: "none",
              padding: 0,
              color: "blue",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </button>
        </div>

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;
