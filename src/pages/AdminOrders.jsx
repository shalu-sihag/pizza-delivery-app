import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    "Order Received",
    "In Kitchen",
    "Sent to Delivery",
    "Delivered",
    "Cancelled",
  ];

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/admin/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch admin orders error:", error);

      setError(
        error.message || "Unable to fetch customer orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError("");
      setUpdatingId(orderId);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Update order status error:", error);

      setError(
        error.message || "Unable to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  const getCustomerName = (order) => {
    return order.user?.name || "Unknown User";
  };

  const getCustomerEmail = (order) => {
    return order.user?.email || "N/A";
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
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Order Management</h1>

          <p>
            View customer orders and update their delivery status.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#c00",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h3>No orders found</h3>

          <p>
            Customer orders will appear here after they place
            an order.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <p>
                    <strong>Customer:</strong>{" "}
                    {getCustomerName(order)}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {getCustomerEmail(order)}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentStatus || "Pending"}
                  </p>

                  <p>
                    <strong>Total:</strong> ₹
                    {order.totalAmount}
                  </p>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "15px",
                  marginBottom: "15px",
                }}
              >
                <h3>Items</h3>

                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        index !== order.items.length - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                  >
                    <strong>{item.name}</strong>

                    <p
                      style={{
                        margin: "5px 0",
                      }}
                    >
                      Quantity: {item.quantity} × ₹{item.price}
                    </p>

                    {item.isCustomPizza &&
                      item.customization && (
                        <p
                          style={{
                            margin: "5px 0",
                            fontSize: "14px",
                          }}
                        >
                          Custom Pizza
                        </p>
                      )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <strong>Delivery Address:</strong>

                <p>{order.deliveryAddress}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <strong>Order Status:</strong>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  disabled={updatingId === order._id}
                  style={{
                    padding: "10px",
                    minWidth: "200px",
                  }}
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                {updatingId === order._id && (
                  <span>Updating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;