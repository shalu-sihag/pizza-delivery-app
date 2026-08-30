import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const API_URL = "http://localhost:5000/api";

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // FETCH PIZZAS
  // ========================================

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

        setPizzas(data.pizzas || []);
      } catch (error) {
        console.error("Fetch home pizzas error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  // ========================================
  // POPULAR VEG PIZZAS
  // ========================================

  const popularPizzas = pizzas
    .filter((pizza) => pizza.category === "veg")
    .slice(0, 4);

  // ========================================
  // UI
  // ========================================

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-tag">
            🍕 Fresh • Hot • Delicious
          </p>

          <h1>
            Delicious Pizza
            <br />
            Delivered To You
          </h1>

          <p className="hero-description">
            Enjoy freshly prepared pizzas made with
            delicious ingredients and delivered
            straight to your doorstep.
          </p>

          <div className="hero-buttons">

            <Link
              to="/menu"
              className="order-now-btn"
            >
              Order Now
            </Link>

            <Link
              to="/customize-pizza"
              className="customize-btn"
            >
              Customize Pizza
            </Link>

          </div>

        </div>

        <div className="hero-image-container">

          <div className="hero-circle"></div>

          {popularPizzas.length > 0 && (
            <img
              src={popularPizzas[0].image}
              alt="Delicious Pizza"
              className="hero-pizza-image"
            />
          )}

          <div className="delivery-badge">
            🚀 Fast Delivery
            <span>30 min or less</span>
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <h2>
          Why Choose Us?
        </h2>

        <div className="features-container">

          <div className="feature-card">

            <div className="feature-icon">
              🍕
            </div>

            <h3>
              Fresh Pizza
            </h3>

            <p>
              Freshly prepared pizzas using
              quality ingredients.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🚀
            </div>

            <h3>
              Fast Delivery
            </h3>

            <p>
              Hot and delicious pizza delivered
              quickly to your doorstep.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ❤️
            </div>

            <h3>
              Made With Love
            </h3>

            <p>
              Every pizza is prepared with
              care and attention.
            </p>

          </div>

        </div>

      </section>


      {/* ================= POPULAR PIZZAS ================= */}

      <section className="popular-section">

        <div className="section-heading">

          <h2>
            Popular Vegetarian Pizzas
          </h2>

          <Link to="/menu">
            View Full Menu →
          </Link>

        </div>


        {loading ? (
          <p>Loading popular pizzas...</p>
        ) : popularPizzas.length === 0 ? (
          <p>No vegetarian pizzas available.</p>
        ) : (
          <div className="popular-pizzas">

            {popularPizzas.map((pizza) => (

              <div
                className="popular-card"
                key={pizza._id}
              >

                <img
                  src={pizza.image}
                  alt={pizza.name}
                />

                <div className="popular-card-content">

                  <h3>
                    {pizza.name}
                  </h3>

                  <p>
                    {pizza.description}
                  </p>

                  <div className="popular-card-bottom">

                    <strong>
                      ₹{pizza.price}
                    </strong>

                    <Link
                      to={`/pizza/${pizza._id}`}
                    >
                      View
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* ================= CUSTOM PIZZA CTA ================= */}

      <section className="custom-cta">

        <div>

          <p className="cta-small">
            CREATE YOUR OWN
          </p>

          <h2>
            Want To Build Your
            <br />
            Perfect Pizza?
          </h2>

          <p>
            Choose your base, sauce, cheese and
            favorite vegetables.
          </p>

          <Link
            to="/customize-pizza"
            className="cta-button"
          >
            Build Your Pizza 🍕
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;