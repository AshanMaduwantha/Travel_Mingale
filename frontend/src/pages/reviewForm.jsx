import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hotelIdFromUrl = queryParams.get("hotelId");
  
  const [hotel, setHotel] = useState({
    id: hotelIdFromUrl || "661b41a95c45fcff7c5530a2", // Use the URL param or fallback to default
  });

  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isViewReviewsPopupVisible, setIsViewReviewsPopupVisible] = useState(false);
  const [bookingData, setBookingData] = useState({ bookingNumber: "", pin: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pinError, setPinError] = useState("");
  const [filter, setFilter] = useState({ rating: 0, user: "" });
  const [deleteMessage, setDeleteMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [hotelDetails, setHotelDetails] = useState("");
  //   name: "",
  //   price: "",
  //   description: "",
  //   image: []
  // });

  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);

  // Fetch hotel details based on the hotelId
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/hotels/${hotel.id}`);
        setHotelDetails({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          image: res.data.images
        });
      } catch (err) {
        console.error("Error fetching hotel details:", err);
        // Set default values if API call fails
 
      }
    };
    
    fetchHotelDetails();
  }, [hotel.id]);

  useEffect(() => {
    if (hotelIdFromUrl) {
      setHotel(prevHotel => ({
        ...prevHotel,
        id: hotelIdFromUrl
      }));
    }
  }, [hotelIdFromUrl]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/reviews?hotelId=${hotel.id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [hotel.id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/reviews", {
        hotelId: hotel.id,
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      setReviews([...reviews, response.data]);
      setSubmitSuccess("Review submitted successfully!");
      setTimeout(() => setSubmitSuccess(""), 4500);
      setNewReview({ name: "", rating: 0, comment: "" });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Try again later.");
    }
  };

  const handleSubmitEditReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/reviews/${editingReview._id}`, {
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      const updatedReviews = reviews.map((review) =>
        review._id === editingReview._id ? response.data : review
      );
      setReviews(updatedReviews);
      setEditingReview(null);
      setNewReview({ name: "", rating: 0, comment: "" });
      setEditSuccess("Review updated successfully!");
      setTimeout(() => setEditSuccess(""), 4500);
      setIsEditPopupVisible(false);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleBookingDataSubmit = async (e) => {
    e.preventDefault();
    const { bookingNumber, pin } = bookingData;

    if (!bookingNumber || !pin) {
      alert("Please enter valid booking details.");
      return;
    }

    const pinRegex = /^[0-9]{10}$/;
    if (!pinRegex.test(pin)) {
      setPinError("PIN must be exactly 10 digits.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/reviews/validate-booking", {
        bookingNumber,
        pin,
      });

      if (response.data.valid) {
        setNewReview((prev) => ({ ...prev, name: bookingNumber }));
        setIsFormVisible(true);
        setIsPopupVisible(false);
        setPinError("");
      } else {
        setPinError("Invalid booking number or PIN.");
      }
    } catch (error) {
      console.error("Validation error:", error);
      setPinError("Server error. Please try again later.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:4000/api/reviews/${reviewId}`);
      const updatedReviews = reviews.filter((review) => review._id !== reviewId);
      setReviews(updatedReviews);
      setDeleteMessage("Review deleted successfully!");
      setTimeout(() => setDeleteMessage(""), 4500);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Try again later.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({ name: review.name, rating: review.rating, comment: review.comment });
    setIsEditPopupVisible(true);
  };

  const handleViewAllReviews = () => setIsViewReviewsPopupVisible(true);
  const handleCloseViewReviewsPopup = () => setIsViewReviewsPopupVisible(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesRating = filter.rating ? review.rating === Number(filter.rating) : true;
    const matchesUser = filter.user ? review.name.toLowerCase().includes(filter.user.toLowerCase()) : true;
    return matchesRating && matchesUser;
  });

  const latestReview = reviews.reduce((latest, current) =>
    new Date(current.createdAt) > new Date(latest?.createdAt || 0) ? current : latest
  , reviews[0] || {});

  const handleMostReviewsClick = () => navigate("/");

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        {hotelDetails.image && hotelDetails.image[0] && (
          <img src={hotelDetails.image[0]} alt={hotelDetails.name} className="w-full h-64 object-cover rounded-lg" />
        )}
        <h1 className="text-3xl font-bold mt-4 text-gray-800">{hotelDetails.name}</h1>
        <p className="text-xl font-semibold text-blue-600 my-2">{hotelDetails.price}</p>
        <p className="text-gray-600 mb-6">{hotelDetails.description}</p>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h3>
        {deleteMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{deleteMessage}</div>}
        {submitSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{submitSuccess}</div>}
        {editSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{editSuccess}</div>}

        <div className="space-y-4 mb-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <h4 className="font-semibold text-lg">{review.name}</h4>
              <div className="flex my-1">
                {Array(review.rating).fill().map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {review._id === latestReview._id && (
                <div className="flex mt-2 space-x-2">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" 
                    onClick={() => handleEditReview(review)}>
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDeleteReview(review._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded" 
            onClick={handleViewAllReviews}>
            View All Reviews
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" 
            onClick={() => setIsPopupVisible(true)}>
            Write a Review
          </button>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded" 
            onClick={handleMostReviewsClick}>
            Back To Home
          </button>
        </div>

        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Enter Booking Details</h3>
              <form onSubmit={handleBookingDataSubmit} className="space-y-4">
                <input
                  type="text"
                  name="bookingNumber"
                  value={bookingData.bookingNumber}
                  onChange={(e) => setBookingData({ ...bookingData, bookingNumber: e.target.value })}
                  placeholder="Booking Number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="pin"
                  value={bookingData.pin}
                  onChange={(e) => setBookingData({ ...bookingData, pin: e.target.value })}
                  placeholder="PIN"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setIsPopupVisible(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    Close
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Review</h3>
              <form onSubmit={handleSubmitEditReview} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
                />
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl cursor-pointer ${newReview.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  placeholder="Your Review"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditPopupVisible(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    Close
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Update Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isFormVisible && (
          <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {!newReview.name ? (
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleReviewChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="text"
                  value={newReview.name}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
                />
              )}
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-2xl cursor-pointer ${newReview.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
                placeholder="Your Review"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              ></textarea>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>

      {isViewReviewsPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">All Reviews</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="md:w-1/2">
                <label className="block text-gray-700 mb-1">
                  Filter by Rating:
                  <select 
                    name="rating" 
                    value={filter.rating} 
                    onChange={handleFilterChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Ratings</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </label>
              </div>
              <div className="md:w-1/2">
                <label className="block text-gray-700 mb-1">
                  Filter by User:
                  <input
                    type="text"
                    name="user"
                    value={filter.user}
                    onChange={handleFilterChange}
                    placeholder="Search by User"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
            {filteredReviews.length > 0 ? (
              <div className="space-y-4 mb-4">
                {filteredReviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <h4 className="font-semibold text-lg">{review.name}</h4>
                    <div className="flex my-1">
                      {Array(review.rating).fill().map((_, idx) => (
                        <FaStar key={idx} className="text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No reviews match your filters.</p>
            )}
            <div className="flex justify-end">
              <button 
                onClick={handleCloseViewReviewsPopup}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;