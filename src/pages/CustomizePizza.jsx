import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import "./CustomizePizza.css";

const API_URL = "http://localhost:5000/api";

const CustomizePizza = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [step, setStep] = useState(1);

  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [vegetables, setVegetables] = useState([]);

  const [customPizza, setCustomPizza] = useState({
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH CUSTOMIZATION OPTIONS
  // ========================================

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/customizations`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch customization options"
          );
        }

        const customizations = data.customizations;

        setBases(
          customizations.filter(
            (item) => item.type === "base"
          )
        );

        setSauces(
          customizations.filter(
            (item) => item.type === "sauce"
          )
        );

        setCheeses(
          customizations.filter(
            (item) => item.type === "cheese"
          )
        );

        setVegetables(
          customizations.filter(
            (item) => item.type === "vegetable"
          )
        );
      } catch (error) {
        console.error(
          "Fetch customizations error:",
          error
        );

        setError(
          error.message ||
            "Unable to load customization options"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomizations();
  }, []);

  // ========================================
  // SELECT BASE
  // ========================================

  const selectBase = (base) => {
    setCustomPizza((currentPizza) => ({
      ...currentPizza,
      base,
    }));
  };

  // ========================================
  // SELECT SAUCE
  // ========================================

  const selectSauce = (sauce) => {
    setCustomPizza((currentPizza) => ({
      ...currentPizza,
      sauce,
    }));
  };

  // ========================================
  // SELECT CHEESE
  // ========================================

  const selectCheese = (cheese) => {
    setCustomPizza((currentPizza) => ({
      ...currentPizza,
      cheese,
    }));
  };

  // ========================================
  // SELECT / REMOVE VEGETABLE
  // ========================================

  const toggleVegetable = (vegetable) => {
    setCustomPizza((currentPizza) => {
      const alreadySelected =
        currentPizza.vegetables.some(
          (item) => item._id === vegetable._id
        );

      if (alreadySelected) {
        return {
          ...currentPizza,
          vegetables:
            currentPizza.vegetables.filter(
              (item) =>
                item._id !== vegetable._id
            ),
        };
      }

      return {
        ...currentPizza,
        vegetables: [
          ...currentPizza.vegetables,
          vegetable,
        ],
      };
    });
  };

  // ========================================
  // CALCULATE PRICE
  // ========================================

  const calculatePrice = () => {
    let total = 0;

    if (customPizza.base) {
      total += customPizza.base.price;
    }

    if (customPizza.sauce) {
      total += customPizza.sauce.price;
    }

    if (customPizza.cheese) {
      total += customPizza.cheese.price;
    }

    customPizza.vegetables.forEach(
      (vegetable) => {
        total += vegetable.price;
      }
    );

    return total;
  };

  // ========================================
  // NEXT STEP
  // ========================================

  const nextStep = () => {
    if (step === 1 && !customPizza.base) {
      alert("Please choose a pizza base.");
      return;
    }

    if (step === 2 && !customPizza.sauce) {
      alert("Please choose a sauce.");
      return;
    }

    if (step === 3 && !customPizza.cheese) {
      alert("Please choose a cheese type.");
      return;
    }

    setStep(
      (currentStep) => currentStep + 1
    );
  };

  // ========================================
  // PREVIOUS STEP
  // ========================================

  const previousStep = () => {
    setStep(
      (currentStep) => currentStep - 1
    );
  };

  // ========================================
  // ADD CUSTOM PIZZA TO CART
  // ========================================

  const handleAddToCart = () => {
    if (
      !customPizza.base ||
      !customPizza.sauce ||
      !customPizza.cheese
    ) {
      alert(
        "Base, sauce and cheese are required."
      );
      return;
    }

    const customPizzaItem = {
      id: `custom-${Date.now()}`,

      name: "Custom Pizza",

      price: calculatePrice(),

      image: "",

      description:
        "Pizza customized by you.",

      customPizza: true,

      customization: {
        base: customPizza.base,
        sauce: customPizza.sauce,
        cheese: customPizza.cheese,
        vegetables:
          customPizza.vegetables,
      },
    };

    addToCart(customPizzaItem);

    navigate("/cart");
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="customize-page">
        <h1>Customize Your Pizza 🍕</h1>

        <p>Loading customization options...</p>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="customize-page">
        <h1>Customize Your Pizza 🍕</h1>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="customize-page">

      {/* PAGE HEADING */}

      <h1>
        Customize Your Pizza 🍕
      </h1>

      {/* PROGRESS BAR */}

      <div className="progress">

        <div
          className={
            step >= 1 ? "active" : ""
          }
        >
          1. Base
        </div>

        <div
          className={
            step >= 2 ? "active" : ""
          }
        >
          2. Sauce
        </div>

        <div
          className={
            step >= 3 ? "active" : ""
          }
        >
          3. Cheese
        </div>

        <div
          className={
            step >= 4 ? "active" : ""
          }
        >
          4. Vegetables
        </div>

        <div
          className={
            step >= 5 ? "active" : ""
          }
        >
          5. Summary
        </div>

      </div>

      {/* =====================================
          STEP 1 - BASE
      ====================================== */}

      {step === 1 && (
        <div className="custom-step">

          <h2>
            Choose Your Pizza Base
          </h2>

          <div className="option-grid">

            {bases.map((base) => (

              <div
                key={base._id}
                className={`option-card ${
                  customPizza.base?._id ===
                  base._id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  selectBase(base)
                }
              >

                <h3>
                  {base.name}
                </h3>

                <p>
                  ₹{base.price}
                </p>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* =====================================
          STEP 2 - SAUCE
      ====================================== */}

      {step === 2 && (
        <div className="custom-step">

          <h2>
            Choose Your Sauce
          </h2>

          <div className="option-grid">

            {sauces.map((sauce) => (

              <div
                key={sauce._id}
                className={`option-card ${
                  customPizza.sauce?._id ===
                  sauce._id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  selectSauce(sauce)
                }
              >

                <h3>
                  {sauce.name}
                </h3>

                <p>
                  ₹{sauce.price}
                </p>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* =====================================
          STEP 3 - CHEESE
      ====================================== */}

      {step === 3 && (
        <div className="custom-step">

          <h2>
            Choose Your Cheese
          </h2>

          <div className="option-grid">

            {cheeses.map((cheese) => (

              <div
                key={cheese._id}
                className={`option-card ${
                  customPizza.cheese?._id ===
                  cheese._id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  selectCheese(cheese)
                }
              >

                <h3>
                  {cheese.name}
                </h3>

                <p>
                  ₹{cheese.price}
                </p>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* =====================================
          STEP 4 - VEGETABLES
      ====================================== */}

      {step === 4 && (
        <div className="custom-step">

          <h2>
            Choose Your Vegetables
          </h2>

          <p className="multiple-text">
            Select as many vegetables
            as you want.
          </p>

          <div className="option-grid">

            {vegetables.map(
              (vegetable) => {

                const selected =
                  customPizza.vegetables.some(
                    (item) =>
                      item._id ===
                      vegetable._id
                  );

                return (

                  <div
                    key={vegetable._id}
                    className={`option-card ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleVegetable(
                        vegetable
                      )
                    }
                  >

                    <h3>
                      {vegetable.name}
                    </h3>

                    <p>
                      ₹{vegetable.price}
                    </p>

                    {selected && (
                      <span className="selected-mark">
                        ✓ Selected
                      </span>
                    )}

                  </div>

                );
              }
            )}

          </div>

        </div>
      )}

      {/* =====================================
          STEP 5 - SUMMARY
      ====================================== */}

      {step === 5 && (
        <div className="custom-summary">

          <h2>
            Your Custom Pizza
          </h2>

          <div className="summary-item">
            <span>Base</span>

            <strong>
              {customPizza.base.name}
            </strong>
          </div>

          <div className="summary-item">
            <span>Sauce</span>

            <strong>
              {customPizza.sauce.name}
            </strong>
          </div>

          <div className="summary-item">
            <span>Cheese</span>

            <strong>
              {customPizza.cheese.name}
            </strong>
          </div>

          <div className="summary-item">
            <span>Vegetables</span>

            <strong>
              {customPizza.vegetables.length > 0
                ? customPizza.vegetables
                    .map(
                      (item) =>
                        item.name
                    )
                    .join(", ")
                : "None"}
            </strong>
          </div>

          <hr />

          <div className="summary-total">

            <span>Total</span>

            <strong>
              ₹{calculatePrice()}
            </strong>

          </div>

        </div>
      )}

      {/* =====================================
          NAVIGATION BUTTONS
      ====================================== */}

      <div className="custom-navigation">

        {step > 1 && (
          <button
            className="back-btn"
            onClick={previousStep}
          >
            Back
          </button>
        )}

        {step < 5 && (
          <button
            className="next-btn"
            onClick={nextStep}
          >
            Next
          </button>
        )}

        {step === 5 && (
          <button
            className="add-custom-btn"
            onClick={handleAddToCart}
          >
            Add Custom Pizza
          </button>
        )}

      </div>

    </div>
  );
};

export default CustomizePizza;