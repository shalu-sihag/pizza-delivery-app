import React, {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ========================================
  // ADD TO CART
  // ========================================

  const addToCart = (pizza) => {
    setCartItems((currentItems) => {

      const pizzaId = pizza._id || pizza.id;

      const existingItem = currentItems.find(
        (item) =>
          (item._id || item.id) === pizzaId
      );

      // Existing regular pizza
      if (existingItem) {
        return currentItems.map((item) =>
          (item._id || item.id) === pizzaId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // New item
      return [
        ...currentItems,
        {
          ...pizza,
          quantity: 1,
        },
      ];
    });
  };

  // ========================================
  // REMOVE FROM CART
  // ========================================

  const removeFromCart = (pizzaId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          (item._id || item.id) !== pizzaId
      )
    );
  };

  // ========================================
  // INCREASE QUANTITY
  // ========================================

  const increaseQuantity = (pizzaId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        (item._id || item.id) === pizzaId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // ========================================
  // DECREASE QUANTITY
  // ========================================

  const decreaseQuantity = (pizzaId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          (item._id || item.id) === pizzaId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ========================================
  // CLEAR CART
  // ========================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ========================================
  // TOTAL
  // ========================================

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // ========================================
  // COUNT
  // ========================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};