import React, { useEffect, useState } from "react";
import PizzaCard from "../components/PizzaCard";
import "./menu.css";
import { useCart } from "../context/CartContext";

import API_URL from "../services/api";

const Menu = () => {
  const { addToCart } = useCart();

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch(`${API_URL}/pizzas`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch pizzas"
          );
        }

        setPizzas(data.pizzas);
      } catch (error) {
        console.error("Fetch pizzas error:", error);
        setError("Unable to load pizzas");
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  if (loading) {
    return (
      <div className="menu-page">
        <h1>Loading pizzas...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <h1>{error}</h1>
      </div>
    );
  }

  const vegPizzas = pizzas.filter(
    (pizza) => pizza.category === "veg"
  );

  const nonVegPizzas = pizzas.filter(
    (pizza) => pizza.category === "non-veg"
  );

  return (
    <div className="menu-page">

      <div className="menu-header">
        <h1>Our Menu</h1>

        <p>
          Choose your favorite pizza from our delicious menu
        </p>
      </div>

      {/* VEGETARIAN PIZZAS */}

      <h2 className="menu-section-title">
        Vegetarian Pizzas
      </h2>

      <div className="pizza-grid">
        {vegPizzas.map((pizza) => (
          <PizzaCard
            key={pizza._id}
            pizza={pizza}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      {/* NON-VEGETARIAN PIZZAS */}

      <h2 className="menu-section-title">
        Non-Vegetarian Pizzas
      </h2>

      <div className="pizza-grid">
        {nonVegPizzas.map((pizza) => (
          <PizzaCard
            key={pizza._id}
            pizza={pizza}
            onAddToCart={addToCart}
          />
        ))}
      </div>

    </div>
  );
};

export default Menu;