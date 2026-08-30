import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();

  const {
    user,
    logout,
    admin,
    adminLogout,
  } = useAuth();

  return (
    <nav className="navbar">

      <Link
        to="/"
        className="navbar-logo"
      >
        🍕 Pizza Delivery
      </Link>


      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/menu">
          Menu
        </Link>

        <Link to="/customize-pizza">
          Customize
        </Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>


        {/* =================================
            CUSTOMER NAVIGATION
        ================================= */}

        {user && user.role === "user" && (
          <>
            <Link to="/orders">
              Orders
            </Link>

            <Link to="/profile">
              {user.name}
            </Link>

            <button
              onClick={logout}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              Logout
            </button>
          </>
        )}


        {/* =================================
            ADMIN NAVIGATION
        ================================= */}

        {admin && (
          <>
            <Link to="/admin/dashboard">
              Admin Dashboard
            </Link>

            <Link to="/admin/orders">
              Manage Orders
            </Link>

            <Link to="/admin/inventory">
              Inventory
            </Link>

            <span>
              {admin.name || "Admin"}
            </span>

            <button
              onClick={adminLogout}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              Admin Logout
            </button>
          </>
        )}


        {/* =================================
            NOT LOGGED IN
        ================================= */}

        {!user && !admin && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;