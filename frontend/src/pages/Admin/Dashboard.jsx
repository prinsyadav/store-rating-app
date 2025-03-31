import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminApi.getDashboard();
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-3">
          <Link
            to="/admin/users/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add User
          </Link>
          <Link
            to="/admin/stores/add"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Add Store
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          <div className="mt-4">
            <Link
              to="/admin/users"
              className="text-blue-600 hover:text-blue-800"
            >
              View all users →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Stores
          </h3>
          <p className="text-3xl font-bold">{stats?.totalStores || 0}</p>
          <div className="mt-4">
            <Link
              to="/admin/stores"
              className="text-blue-600 hover:text-blue-800"
            >
              View all stores →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Ratings
          </h3>
          <p className="text-3xl font-bold">{stats?.totalRatings || 0}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/users"
              className="block p-4 border rounded-md hover:bg-gray-50 transition"
            >
              <div className="font-medium">Manage Users</div>
              <p className="text-sm text-gray-500">Add, edit or remove users</p>
            </Link>

            <Link
              to="/admin/stores"
              className="block p-4 border rounded-md hover:bg-gray-50 transition"
            >
              <div className="font-medium">Manage Stores</div>
              <p className="text-sm text-gray-500">
                Add, edit or remove stores
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border border-green-100">
              <span>API Server</span>
              <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Online
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border border-green-100">
              <span>Database</span>
              <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
