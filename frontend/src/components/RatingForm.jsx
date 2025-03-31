import { useState } from "react";

const RatingForm = ({
  initialScore = 0,
  initialComment = "",
  onSubmit,
  onCancel,
}) => {
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (score < 1 || score > 5) {
      setError("Please select a rating between 1 and 5");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onSubmit({ score, comment });
    } catch (err) {
      setError(err.message || "An error occurred while submitting your rating");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h4 className="text-lg font-medium mb-3">Rate this Store</h4>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating:</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScore(value)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-xl 
                  ${
                    score >= value
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="comment">
            Comment (optional):
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your experience with this store..."
            rows={3}
          ></textarea>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
