import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./PizzaDetails.css";

import API_URL from "../services/api";

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const response = await fetch(
          `${API_URL}/pizzas/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Pizza not found"
          );
        }

        setPizza(data.pizza);
      } catch (error) {
        console.error("Fetch pizza error:", error);

        setError(
          error.message || "Unable to fetch pizza"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(pizza);

    alert("Pizza added to cart!");

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="pizza-not-found">
        <h2>Loading pizza...</h2>
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="pizza-not-found">
        <h2>Pizza not found</h2>

        <p>{error}</p>

        <button
          onClick={() => navigate("/menu")}
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="pizza-details-page">

      <div className="pizza-details-card">

        <div className="pizza-details-image">
          <img
            src={pizza.image}
            alt={pizza.name}
          />
        </div>

        <div className="pizza-details-content">

          <h1>{pizza.name}</h1>

          <p className="pizza-details-description">
            {pizza.description}
          </p>

          <h2 className="pizza-details-price">
            ₹{pizza.price}
          </h2>

          <div className="pizza-details-actions">

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="back-menu-btn"
              onClick={() => navigate("/menu")}
            >
              Back to Menu
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PizzaDetails;