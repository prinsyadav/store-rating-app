import { useState, useEffect } from "react";
import { storeApi } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await storeApi.getDashboard();
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
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-600">
            Average Rating
          </h3>
          <p className="text-3xl font-bold">
            {stats?.averageRating.toFixed(1)} / 5
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-600">Total Ratings</h3>
          <p className="text-3xl font-bold">{stats?.totalRatings}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
        {stats?.ratingDistribution && (
          <div className="space-y-4">
            {stats.ratingDistribution.map((item) => (
              <div key={item.score} className="flex items-center">
                <span className="w-10 text-lg font-medium">{item.score} ★</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-5">
                  <div
                    className="bg-yellow-400 h-5 rounded-full"
                    style={{
                      width: `${
                        stats.totalRatings > 0
                          ? (item.count / stats.totalRatings) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="w-10 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Ratings</h2>
        {stats?.recentRatings && stats.recentRatings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {stats.recentRatings.map((rating) => (
              <div key={rating.id} className="py-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg font-bold">
                      {rating.score}/5
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-gray-700">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ratings yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
