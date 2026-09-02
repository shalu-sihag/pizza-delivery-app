import React from "react";
import { Link } from "react-router-dom";
import "../pages/menu.css";

const PizzaCard = ({ pizza, onAddToCart }) => {
  return (
    <div className="pizza-card">

      <div className="pizza-image">
        {pizza.image ? (
          <img
            src={pizza.image}
            alt={pizza.name}
          />
        ) : (
          <div className="image-placeholder">
            Pizza Image
          </div>
        )}
      </div>

      <div className="pizza-content">

        <h2>{pizza.name}</h2>

        <p className="pizza-description">
          {pizza.description}
        </p>

        <p className="pizza-price">
          ₹{pizza.price}
        </p>

        <div className="pizza-actions">

          <Link
            to={`/pizza/${pizza._id}`}
            className="view-details-btn"
          >
            View Details
          </Link>

          <button
            className="add-cart-btn"
            onClick={() => onAddToCart(pizza)}
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
};

export default PizzaCard;