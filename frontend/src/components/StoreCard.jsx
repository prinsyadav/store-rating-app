import { useState } from "react";
import { Link } from "react-router-dom";
import RatingForm from "./RatingForm";

const StoreCard = ({
  store,
  userRole,
  onRatingSubmit,
  isDetailView = false,
}) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleRateButtonClick = () => {
    setShowRatingForm(true);
    setSuccessMessage("");
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      await onRatingSubmit(store.id, ratingData);
      setShowRatingForm(false);
      setSuccessMessage("Rating submitted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleRatingCancel = () => {
    setShowRatingForm(false);
  };

  // Calculate star display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500">
          ★
        </span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ½
        </span>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">{store.name}</h3>

      <div className="mb-3 flex items-center">
        <div className="text-xl mr-2">{renderStars(store.averageRating)}</div>
        <span className="text-gray-600 text-sm">
          ({store.averageRating.toFixed(1)}/5)
        </span>
      </div>

      <p className="text-gray-600 mb-4">{store.address}</p>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
          {successMessage}
        </div>
      )}

      {userRole === "user" && (
        <div className="mt-4">
          {!showRatingForm ? (
            <button
              onClick={handleRateButtonClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {store.userRating ? "Update Rating" : "Rate This Store"}
            </button>
          ) : (
            <RatingForm
              initialScore={store.userRating ? store.userRating.score : 0}
              initialComment={store.userRating ? store.userRating.comment : ""}
              onSubmit={handleRatingSubmit}
              onCancel={handleRatingCancel}
            />
          )}

          {store.userRating && !showRatingForm && (
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="font-medium">
                Your rating: {store.userRating.score}/5
              </p>
              {store.userRating.comment && (
                <p className="text-sm text-gray-600 mt-1">
                  {store.userRating.comment}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {userRole === "admin" && (
        <div className="flex gap-2 mt-4">
          <Link
            to={`/admin/stores/${store.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            View Details
          </Link>
          <Link
            to={`/admin/stores/edit/${store.id}`}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </Link>
        </div>
      )}

      {isDetailView && userRole === "user" && (
        <Link
          to="/user/stores"
          className="block mt-4 text-blue-500 hover:underline"
        >
          ← Back to all stores
        </Link>
      )}
    </div>
  );
};

export default StoreCard;
