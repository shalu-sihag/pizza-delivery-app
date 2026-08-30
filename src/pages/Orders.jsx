import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

const API_URL = "http://localhost:5000/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH MY ORDERS
  // ========================================

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
      setError("");
    } catch (error) {
      console.error("Fetch orders error:", error);
      setError(error.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // INITIAL FETCH + POLLING
  // ========================================

  useEffect(() => {
    fetchOrders();

    // Check for updated order status every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>Loading your orders...</p>
      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>

        <div className="no-orders">
          <h2>Unable to load orders</h2>

          <p>{error}</p>

          <button
            onClick={fetchOrders}
            className="order-menu-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // ========================================
  // NO ORDERS
  // ========================================

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>

        <div className="no-orders">
          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/menu"
            className="order-menu-btn"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }


  // ========================================
  // ORDERS
  // ========================================

  return (
    <div className="orders-page">

      <h1>My Orders</h1>

      <div className="orders-list">

        {orders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >

            <div className="order-header">

              <div>
                <h2>
                  Order #{order._id.slice(-6)}
                </h2>

                <p>
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <span
                className={`order-payment-status ${order.paymentStatus
                  ?.toLowerCase()
                  .replace(" ", "-")}`}
              >
                {order.paymentStatus}
              </span>

            </div>


            {/* ========================================
                ORDER ITEMS
            ======================================== */}

            <div className="order-items">

              {order.items.map((item, index) => (

                <div
                  className="order-item"
                  key={index}
                >

                  <div>
                    <strong>{item.name}</strong>

                    <p>
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>

                </div>

              ))}

            </div>


            {/* ========================================
                TOTAL
            ======================================== */}

            <div className="order-total">

              <strong>Total</strong>

              <strong>
                ₹{order.totalAmount}
              </strong>

            </div>


            {/* ========================================
                ORDER STATUS
            ======================================== */}

            <div className="order-status-section">

              <h3>Order Status</h3>

              <div className="status-tracker">

                <div
                  className={`status-step ${
                    [
                      "Order Received",
                      "In Kitchen",
                      "Sent to Delivery",
                      "Delivered",
                    ].indexOf(order.status) >= 0
                      ? "active"
                      : ""
                  }`}
                >
                  <span>1</span>
                  <p>Order Received</p>
                </div>


                <div
                  className={`status-step ${
                    [
                      "In Kitchen",
                      "Sent to Delivery",
                      "Delivered",
                    ].indexOf(order.status) >= 0
                      ? "active"
                      : ""
                  }`}
                >
                  <span>2</span>
                  <p>In Kitchen</p>
                </div>


                <div
                  className={`status-step ${
                    [
                      "Sent to Delivery",
                      "Delivered",
                    ].indexOf(order.status) >= 0
                      ? "active"
                      : ""
                  }`}
                >
                  <span>3</span>
                  <p>Sent to Delivery</p>
                </div>


                <div
                  className={`status-step ${
                    order.status === "Delivered"
                      ? "active"
                      : ""
                  }`}
                >
                  <span>4</span>
                  <p>Delivered</p>
                </div>

              </div>

              <p className="current-status">
                Current Status:{" "}
                <strong>{order.status}</strong>
              </p>

            </div>


            {/* ========================================
                DELIVERY ADDRESS
            ======================================== */}

            <div className="delivery-address">

              <strong>Delivery Address</strong>

              <p>{order.deliveryAddress}</p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Orders;