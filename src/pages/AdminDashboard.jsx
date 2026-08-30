import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome, {admin?.name || "Admin"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "25px",
          }}
        >
          <h2>Inventory</h2>

          <p>
            View and manage pizza ingredients and stock levels.
          </p>

          <button
            onClick={() => navigate("/admin/inventory")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Manage Inventory
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "25px",
          }}
        >
          <h2>Orders</h2>

          <p>
            View customer orders and update their status.
          </p>

          <button
            onClick={() => navigate("/admin/orders")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;