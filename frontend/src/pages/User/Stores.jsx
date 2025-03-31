import { useState, useEffect } from "react";
import { userApi } from "../../services/api";
import StoreCard from "../../components/StoreCard";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (filterParams = {}) => {
    setLoading(true);
    try {
      const response = await userApi.getStores(filterParams);
      if (response.success) {
        setStores(response.data.stores || []);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    // Debounce search requests
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      fetchStores({ ...filters, [name]: value });
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleRatingSubmit = async (storeId, ratingData) => {
    try {
      await userApi.submitRating({
        storeId,
        score: ratingData.score,
        comment: ratingData.comment,
      });

      // Refresh store list to show updated ratings
      fetchStores(filters);
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError("Failed to submit rating. Please try again.");
    }
  };

  const clearFilters = () => {
    setFilters({ name: "", address: "" });
    fetchStores({});
  };

  if (loading && stores.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Stores</h1>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded border-gray-300"
              placeholder="Search by store name"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded border-gray-300"
              placeholder="Search by location"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && stores.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700">No stores found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRatingSubmit={handleRatingSubmit}
              userRole="user"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;
