import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { motion, AnimatePresence } from 'framer-motion';

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
  <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
    {/* Toast Notifications */}
    <AnimatePresence>
      {deleteMessage && (
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2"
          transition={{ duration: 0.3 }}
        >
          <span>{deleteMessage}</span>
          <button onClick={() => setDeleteMessage("")} className="ml-2 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}
      
      {submitSuccess && (
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2"
          transition={{ duration: 0.3 }}
        >
          <span>{submitSuccess}</span>
          <button onClick={() => setSubmitSuccess("")} className="ml-2 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}
      
      {editSuccess && (
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2"
          transition={{ duration: 0.3 }}
        >
          <span>{editSuccess}</span>
          <button onClick={() => setEditSuccess("")} className="ml-2 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Main Content */}
    <div className="bg-gray shadow-xl rounded-2xl overflow-hidden p-8 transition-all duration-300 hover:shadow-2xl">
      {hotelDetails.image && hotelDetails.image[0] && (
        <div className="relative overflow-hidden rounded-xl mb-6">
          <img src={hotelDetails.image[0]} alt={hotelDetails.name} className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold">{hotelDetails.name}</h1>
              <p className="text-2xl font-semibold text-blue-300 my-2">{hotelDetails.price}</p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-gray-600 mb-8 text-lg leading-relaxed">{hotelDetails.description}</p>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Guest Reviews</h3>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors duration-300 flex items-center gap-2 font-medium" 
            onClick={handleViewAllReviews}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View All
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg" 
            onClick={() => setIsPopupVisible(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Write a Review
          </button>
          <button 
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg" 
            onClick={handleMostReviewsClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </button>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <div key={review._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg text-gray-800">{review.name}</h4>
                <div className="flex my-1">
                  {Array(review.rating).fill().map((_, idx) => (
                    <FaStar key={idx} className="text-yellow-400" />
                  ))}
                  {Array(5 - review.rating).fill().map((_, idx) => (
                    <FaStar key={idx} className="text-gray-200" />
                  ))}
                </div>
              </div>
              {review._id === latestReview._id && (
                <div className="flex gap-2">
                  <button 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition-colors duration-300" 
                    onClick={() => handleEditReview(review)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors duration-300"
                    onClick={() => handleDeleteReview(review._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Booking Popup */}
      <AnimatePresence>
        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Enter Booking Details</h3>
                <button 
                  onClick={() => setIsPopupVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleBookingDataSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Number</label>
                  <input
                    type="text"
                    name="bookingNumber"
                    value={bookingData.bookingNumber}
                    onChange={(e) => setBookingData({ ...bookingData, bookingNumber: e.target.value })}
                    placeholder="Enter your booking number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                  <input
                    type="text"
                    name="pin"
                    value={bookingData.pin}
                    onChange={(e) => setBookingData({ ...bookingData, pin: e.target.value })}
                    placeholder="Enter your PIN"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {pinError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {pinError}
                    </motion.p>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsPopupVisible(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Review Popup */}
      <AnimatePresence>
        {isEditPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Review</h3>
                <button 
                  onClick={() => setIsEditPopupVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmitEditReview} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newReview.name}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaStar
                          className={`text-2xl cursor-pointer ${newReview.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                          onClick={() => handleRatingChange(star)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                  <textarea
                    name="comment"
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    placeholder="Share your experience"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditPopupVisible(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
                    Update Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Form */}
      {isFormVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-md"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-800">Add Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-5">
            {!newReview.name ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleReviewChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaStar
                      className={`text-2xl cursor-pointer ${newReview.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => handleRatingChange(star)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
                placeholder="Share your experience"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
              ></textarea>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
              Submit Review
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* View All Reviews Popup */}
      <AnimatePresence>
        {isViewReviewsPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-screen overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">All Reviews</h3>
                <button 
                  onClick={handleCloseViewReviewsPopup}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Rating:
                  </label>
                  <select 
                    name="rating" 
                    value={filter.rating} 
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">All Ratings</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by User:
                  </label>
                  <input
                    type="text"
                    name="user"
                    value={filter.user}
                    onChange={handleFilterChange}
                    placeholder="Search by user name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-grow" style={{ maxHeight: "calc(80vh - 200px)" }}>
                {filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <motion.div 
                        key={review._id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:shadow-md transition-all duration-300"
                      >
                        <h4 className="font-semibold text-lg text-gray-800">{review.name}</h4>
                        <div className="flex my-1">
                          {Array(review.rating).fill().map((_, idx) => (
                            <FaStar key={idx} className="text-yellow-400" />
                          ))}
                          {Array(5 - review.rating).fill().map((_, idx) => (
                            <FaStar key={idx} className="text-gray-200" />
                          ))}
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-center py-4 text-gray-500">No reviews match your filters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
};

export default ReviewForm;