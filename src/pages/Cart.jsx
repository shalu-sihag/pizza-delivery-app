import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>

        <p>
          Add some delicious pizzas to your cart.
        </p>

        <button
          className="browse-menu-btn"
          onClick={() => navigate("/menu")}
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <h1>Your Cart</h1>

      <div className="cart-container">

        <div className="cart-items">

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <h2>{item.name}</h2>

                {item.customPizza &&
                  item.customization && (
                    <div className="customization-details">

                      <p>
                        <strong>Base:</strong>{" "}
                        {item.customization.base.name}
                      </p>

                      <p>
                        <strong>Sauce:</strong>{" "}
                        {item.customization.sauce.name}
                      </p>

                      <p>
                        <strong>Cheese:</strong>{" "}
                        {item.customization.cheese.name}
                      </p>

                      <p>
                        <strong>Vegetables:</strong>{" "}

                        {item.customization.vegetables.length >
                          0
                          ? item.customization.vegetables
                            .map(
                              (vegetable) =>
                                vegetable.name
                            )
                            .join(", ")
                          : "None"}
                      </p>

                    </div>
                  )}

                <p>₹{item.price}</p>

                <div className="quantity-controls">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="total">
            <span>Total</span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;