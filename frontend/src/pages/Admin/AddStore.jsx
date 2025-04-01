import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";

const AddStore = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState({
    name: "",
    email: "",
    address: "",
    userId: "",
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  // Fetch users (potential store owners)
  // Update the fetchUsers function in useEffect
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await adminApi.getUsers();

        // First, check if we got a successful response with data
        if (response && response.success) {
          console.log("All users fetched:", response.data); // Debug logging

          // Make sure we're using the correct property to get users array
          const usersArray = Array.isArray(response.data) ? response.data : [];

          // Filter users who aren't already store owners
          const eligibleUsers = usersArray.filter(
            (user) => user.role !== "storeOwner"
          );

          console.log("Eligible users:", eligibleUsers); // Debug logging
          setUsers(eligibleUsers);
        } else {
          console.error("Invalid response from getUsers API:", response);
          setSubmitError(
            "Failed to load available users: Invalid response format"
          );
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setSubmitError(
          "Failed to load available users: " + (err.message || "Unknown error")
        );
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({
      ...storeData,
      [name]: value,
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name (20-60 characters)
    if (
      !storeData.name ||
      storeData.name.length < 20 ||
      storeData.name.length > 60
    ) {
      newErrors.name = "Store name must be between 20 and 60 characters";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!storeData.email || !emailRegex.test(storeData.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    // Validate address (1-400 characters)
    if (!storeData.address || storeData.address.length > 400) {
      newErrors.address =
        "Address must not be empty and cannot exceed 400 characters";
    }

    // Validate userId
    if (!storeData.userId) {
      newErrors.userId = "Please select a store owner";
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

    // Convert userId to number
    const storePayload = {
      ...storeData,
      userId: parseInt(storeData.userId, 10),
    };

    setLoading(true);
    try {
      const response = await adminApi.createStore(storePayload);

      if (response.success) {
        navigate("/admin/stores", {
          state: { message: "Store created successfully" },
        });
      } else {
        setSubmitError(response.message || "Failed to create store");
      }
    } catch (err) {
      console.error("Create store error:", err);
      setSubmitError(
        err.message || "An error occurred while creating the store"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/stores");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Store</h1>
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
              placeholder="Store name (20-60 characters)"
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
              Store Email *
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
              Store Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={storeData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Store address (max 400 characters)"
              rows="3"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="userId"
            >
              Store Owner *
            </label>
            {usersLoading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                <span>Loading users...</span>
              </div>
            ) : (
              <>
                <select
                  id="userId"
                  name="userId"
                  value={storeData.userId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    errors.userId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="text-yellow-600 text-xs mt-1">
                    No eligible users found. All users are already store owners.
                  </p>
                )}
                {errors.userId && (
                  <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              disabled={loading || usersLoading}
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
