import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";

const EditStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await adminApi.getStoreById(id);
        if (response.success) {
          setStoreData(response.data);
        } else {
          setSubmitError(response.message || "Failed to load store data");
        }
      } catch (err) {
        console.error("Error fetching store:", err);
        setSubmitError(
          err.message || "An error occurred while loading store data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({
      ...storeData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (
      !storeData.name ||
      storeData.name.length < 3 ||
      storeData.name.length > 100
    ) {
      newErrors.name = "Store name must be between 3 and 100 characters";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!storeData.email || !emailRegex.test(storeData.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    // Validate address
    if (
      !storeData.address ||
      storeData.address.length < 5 ||
      storeData.address.length > 200
    ) {
      newErrors.address = "Address must be between 5 and 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.updateStore(id, storeData);

      if (response.success) {
        navigate("/admin/stores", {
          state: { message: "Store updated successfully" },
        });
      } else {
        setSubmitError(response.message || "Failed to update store");
      }
    } catch (err) {
      console.error("Update store error:", err);
      setSubmitError(
        err.message || "An error occurred while updating the store"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/stores");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Store</h1>
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Stores
        </button>
      </div>

      {submitError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{submitError}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Store Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={storeData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Store name (3-100 characters)"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={storeData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Store email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={storeData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Store address (5-200 characters)"
              rows="3"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStore;
