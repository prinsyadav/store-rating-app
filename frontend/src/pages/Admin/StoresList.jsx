import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(location.state?.message || "");

  // Add sorting state variables
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await adminApi.getStores();
        if (response.success) {
          setStores(response.data);
        } else {
          setError(response.message || "Failed to load stores");
        }
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();

    // Clear location state message after showing it
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Add sort function
  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new field, set it with ascending direction
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort the stores array based on current sort field and direction
  const sortedStores = [...stores].sort((a, b) => {
    // Determine the values to compare based on the field
    let aValue, bValue;

    if (sortField === "rating") {
      aValue = a.averageRating || 0;
      bValue = b.averageRating || 0;
    } else if (sortField === "owner") {
      aValue = (a.User ? a.User.name : "").toLowerCase();
      bValue = (b.User ? b.User.name : "").toLowerCase();
    } else {
      aValue = (a[sortField] || "").toLowerCase();
      bValue = (b[sortField] || "").toLowerCase();
    }

    // Compare based on direction
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const handleDeleteStore = async (storeId, storeName) => {
    if (
      window.confirm(`Are you sure you want to delete store: ${storeName}?`)
    ) {
      try {
        const response = await adminApi.deleteStore(storeId);
        if (response.success) {
          setStores(stores.filter((store) => store.id !== storeId));
          setMessage("Store deleted successfully");
        } else {
          setError(response.message || "Failed to delete store");
        }
      } catch (err) {
        console.error("Error deleting store:", err);
        setError("Failed to delete store. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to render sort indicators
  const renderSortIndicator = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stores</h1>
        <Link
          to="/admin/stores/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Store
        </Link>
      </div>

      {message && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                Name {renderSortIndicator("name")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIndicator("email")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("rating")}
              >
                Rating {renderSortIndicator("rating")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("owner")}
              >
                Owner {renderSortIndicator("owner")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStores.length > 0 ? (
              sortedStores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {store.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{store.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-1">
                        {store.averageRating
                          ? store.averageRating.toFixed(1)
                          : "N/A"}
                      </span>
                      {store.averageRating && (
                        <span className="text-yellow-500">★</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {store.User ? store.User.name : "No owner"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/stores/edit/${store.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.id, store.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoresList;
