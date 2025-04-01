import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminApi.getUserById(id);
        if (response.success) {
          setUserData(response.data);
        } else {
          setSubmitError(response.message || "Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setSubmitError(
          err.message || "An error occurred while loading user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name (20-60 chars)
    if (
      !userData.name ||
      userData.name.length < 2 ||
      userData.name.length > 60
    ) {
      newErrors.name = "Name must be between 2 and 60 characters";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    // Validate address (max 400 chars)
    if (userData.address && userData.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }

    // Validate role
    const validRoles = ["admin", "user", "storeOwner"];
    if (!validRoles.includes(userData.role)) {
      newErrors.role = "Please select a valid role";
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
      const response = await adminApi.updateUser(id, userData);

      if (response.success) {
        navigate("/admin/users", {
          state: { message: "User updated successfully" },
        });
      } else {
        setSubmitError(response.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Update user error:", err);
      setSubmitError(
        err.message || "An error occurred while updating the user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
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
        <h1 className="text-3xl font-bold">Edit User</h1>
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Users
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
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Full name (2-60 characters)"
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
              value={userData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Email address"
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
              Address (Optional)
            </label>
            <textarea
              id="address"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="User address (max 400 characters)"
              rows="3"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="storeOwner">Store Owner</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
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
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
