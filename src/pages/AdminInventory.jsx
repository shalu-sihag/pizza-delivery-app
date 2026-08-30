import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const AdminInventory = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    type: "base",
    name: "",
    quantity: "",
    lowStockThreshold: "10",
  });

  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/inventory`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch inventory");
      }

      setInventory(data.inventory || []);
    } catch (error) {
      console.error("Fetch inventory error:", error);
      setError(error.message || "Unable to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.name.trim()) {
      setError("Inventory item name is required.");
      return;
    }

    const quantity = Number(formData.quantity);
    const lowStockThreshold = Number(formData.lowStockThreshold);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative integer.");
      return;
    }

    if (
      !Number.isInteger(lowStockThreshold) ||
      lowStockThreshold < 0
    ) {
      setError("Low-stock threshold must be a non-negative integer.");
      return;
    }

    try {
      setAdding(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          name: formData.name.trim(),
          quantity,
          lowStockThreshold,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add inventory item");
      }

      setMessage(
        data.message || "Inventory item added successfully."
      );

      setFormData({
        type: "base",
        name: "",
        quantity: "",
        lowStockThreshold: "10",
      });

      await fetchInventory();
    } catch (error) {
      console.error("Add inventory error:", error);
      setError(error.message || "Unable to add inventory item");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (item) => {
    setError("");
    setMessage("");

    const quantity = Number(item.quantity);
    const lowStockThreshold = Number(item.lowStockThreshold);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative integer.");
      return;
    }

    if (
      !Number.isInteger(lowStockThreshold) ||
      lowStockThreshold < 0
    ) {
      setError("Low-stock threshold must be a non-negative integer.");
      return;
    }

    try {
      setUpdatingId(item._id);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/inventory/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
            lowStockThreshold,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update inventory"
        );
      }

      setMessage(
        data.message || "Inventory updated successfully."
      );

      setInventory((prev) =>
        prev.map((inventoryItem) =>
          inventoryItem._id === item._id
            ? data.inventory
            : inventoryItem
        )
      );
    } catch (error) {
      console.error("Update inventory error:", error);
      setError(error.message || "Unable to update inventory");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      setDeletingId(id);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete inventory item"
        );
      }

      setMessage(
        data.message || "Inventory item deleted successfully."
      );

      setInventory((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete inventory error:", error);
      setError(error.message || "Unable to delete inventory item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuantityChange = (id, value) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: value,
            }
          : item
      )
    );
  };

  const handleThresholdChange = (id, value) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              lowStockThreshold: value,
            }
          : item
      )
    );
  };

  const getTypeTitle = (type) => {
    switch (type) {
      case "base":
        return "Bases";

      case "sauce":
        return "Sauces";

      case "cheese":
        return "Cheeses";

      case "vegetable":
        return "Vegetables";

      default:
        return type;
    }
  };

  const isLowStock = (item) => {
    return item.quantity <= item.lowStockThreshold;
  };

  const groupedInventory = {
    base: inventory.filter((item) => item.type === "base"),
    sauce: inventory.filter((item) => item.type === "sauce"),
    cheese: inventory.filter((item) => item.type === "cheese"),
    vegetable: inventory.filter(
      (item) => item.type === "vegetable"
    ),
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
          <h1>Inventory Management</h1>

          <p>
            Manage pizza ingredients and monitor stock levels.
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

      {message && (
        <div
          style={{
            backgroundColor: "#e6ffe6",
            color: "#087f23",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "25px",
          marginBottom: "40px",
        }}
      >
        <h2>Add Inventory Item</h2>

        <form onSubmit={handleAddInventory}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
              alignItems: "end",
            }}
          >
            <div>
              <label>Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                }}
              >
                <option value="base">Base</option>
                <option value="sauce">Sauce</option>
                <option value="cheese">Cheese</option>
                <option value="vegetable">Vegetable</option>
              </select>
            </div>

            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g. Thin Crust"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                }}
              />
            </div>

            <div>
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                min="0"
                step="1"
                placeholder="0"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                }}
              />
            </div>

            <div>
              <label>Low Stock Threshold</label>

              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleFormChange}
                min="0"
                step="1"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              style={{
                padding: "11px",
                cursor: adding ? "not-allowed" : "pointer",
              }}
            >
              {adding ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : inventory.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h3>No inventory items found</h3>

          <p>
            Add your pizza bases, sauces, cheeses and vegetables
            using the form above.
          </p>
        </div>
      ) : (
        Object.entries(groupedInventory).map(
          ([type, items]) => (
            <div
              key={type}
              style={{
                marginBottom: "40px",
              }}
            >
              <h2>{getTypeTitle(type)}</h2>

              {items.length === 0 ? (
                <p>No {getTypeTitle(type).toLowerCase()} found.</p>
              ) : (
                <div
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: "700px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "left",
                          }}
                        >
                          Name
                        </th>

                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "left",
                          }}
                        >
                          Quantity
                        </th>

                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "left",
                          }}
                        >
                          Low Stock Threshold
                        </th>

                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "left",
                          }}
                        >
                          Status
                        </th>

                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "left",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => (
                        <tr key={item._id}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "12px",
                            }}
                          >
                            {item.name}
                          </td>

                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "12px",
                            }}
                          >
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item._id,
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100px",
                                padding: "8px",
                              }}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "12px",
                            }}
                          >
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.lowStockThreshold}
                              onChange={(e) =>
                                handleThresholdChange(
                                  item._id,
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100px",
                                padding: "8px",
                              }}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "12px",
                            }}
                          >
                            {isLowStock(item)
                              ? "Low Stock"
                              : "In Stock"}
                          </td>

                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "12px",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleUpdate(item)
                              }
                              disabled={
                                updatingId === item._id
                              }
                              style={{
                                marginRight: "8px",
                                padding: "8px 12px",
                                cursor:
                                  updatingId === item._id
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {updatingId === item._id
                                ? "Updating..."
                                : "Update"}
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(item._id)
                              }
                              disabled={
                                deletingId === item._id
                              }
                              style={{
                                padding: "8px 12px",
                                cursor:
                                  deletingId === item._id
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {deletingId === item._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default AdminInventory;