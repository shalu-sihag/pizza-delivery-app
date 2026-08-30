import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const API_URL = "http://localhost:5000/api";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // CREATE ORDER
  // ========================================

  const createOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before placing an order.");
      navigate("/login");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const deliveryAddress = `${formData.name}, ${formData.phone}, ${formData.address}, ${formData.city} - ${formData.pincode}`;

      const orderItems = cartItems.map((item) => {
        
        // CUSTOM PIZZA
        if (item.customPizza) {
          return {
            customPizza: {
              baseId: item.customization.base._id,
              sauceId: item.customization.sauce._id,
              cheeseId: item.customization.cheese._id,
              vegetableIds:
                item.customization.vegetables.map(
                  (vegetable) => vegetable._id
                ),
            },
            quantity: item.quantity,
          };
        }


        // REGULAR PIZZA
        return {
          pizzaId: item._id,
          quantity: item.quantity,
        };
      });

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create order"
        );
      }

      return data.order;
    } catch (error) {
      console.error("Create order error:", error);
      setError(error.message || "Unable to create order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // PROCESS MOCK PAYMENT
  // ========================================

  const processPayment = async (order) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before making payment.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/orders/${order._id}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentSuccess: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Payment failed"
        );
      }

      clearCart();

      alert(
        "Payment successful! Your order has been confirmed."
      );

      navigate("/orders");
    } catch (error) {
      console.error("Payment error:", error);

      setError(
        error.message || "Payment could not be completed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SUBMIT CHECKOUT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.phone.match(/^[0-9]{10}$/)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!formData.pincode.match(/^[0-9]{6}$/)) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    const order = await createOrder();

    if (!order) {
      return;
    }

    await processPayment(order);
  };

  // ========================================
  // EMPTY CART
  // ========================================

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <h1>Your cart is empty</h1>

        <button onClick={() => navigate("/menu")}>
          Go to Menu
        </button>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto 20px",
            padding: "12px",
            backgroundColor: "#f8d7da",
            color: "#842029",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Delivery Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your delivery address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>PIN Code</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  maxLength="6"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${cartTotal}`}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >
              <div>
                <h3>{item.name}</h3>

                <p>
                  ₹{item.price} × {item.quantity}
                </p>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <hr />

          <div className="checkout-total">
            <span>Total</span>

            <strong>₹{cartTotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;