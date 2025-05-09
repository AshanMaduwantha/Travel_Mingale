import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactModal from "react-modal";
import {
  Calendar,
  Phone,
  Mail,
  Home,
  Users,
  MessageSquare,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  DollarSign,
  Info,
  Lightbulb,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import Navbar from "../components/Navbar";

ReactModal.setAppElement("#root");

const BookedReservations = () => {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyB84l8pn4aV6pZPxRtRGEkyvYNyYBjh7sw",
  });

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [reservationToEdit, setReservationToEdit] = useState({});
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    roomCount: 1,
    roomPrice: "",
    phone: "",
    message: "",
    status: "pending",
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [travelTips, setTravelTips] = useState(null);


  const openDetailsModal = (reservation) => {

    setSelectedReservation(reservation);
    setTravelTips(null);
    setIsDetailsModalOpen(true);


    generateAndDisplayTips(reservation);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedReservation(null);
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const calculateNights = (checkIn, checkOut) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/reservations");
        if (!response.ok) throw new Error("Failed to fetch reservations");
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const openEditModal = (reservation) => {
    setFormData({
      _id: reservation._id,
      name: reservation.name,
      email: reservation.email,
      checkIn: formatDate(reservation.checkIn),
      checkOut: formatDate(reservation.checkOut),
      roomCount: reservation.roomCount || 1,
      roomPrice: reservation.roomPrice,
      phone: reservation.phone,
      message: reservation.message || "",
      status: reservation.status || "pending",
    });
    setReservationToEdit(reservation._id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setReservationToEdit(null);
  };

  const openDeleteModal = (id) => {
    setIsDeleteModalOpen(true);
    setReservationToDelete(id);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setReservationToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Invalid email format";
    if (!/^\d{10}$/.test(formData.phone))
      errors.phone = "Phone must be 10 digits";
    if (new Date(formData.checkIn) < new Date(today))
      errors.checkIn = "Check-in must be today or later";
    if (new Date(formData.checkOut) <= new Date(formData.checkIn))
      errors.checkOut = "Check-out must be after check-in";
    if (isNaN(formData.roomPrice) || formData.roomPrice <= 0)
      errors.roomPrice = "Invalid price";
    if (isNaN(formData.roomCount) || formData.roomCount < 1)
      errors.roomCount = "Invalid room count";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (formErrors) {
      Object.values(formErrors).forEach((error) => toast.error(error));
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/reservations/${reservationToEdit}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            checkIn: new Date(formData.checkIn),
            checkOut: new Date(formData.checkOut),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update reservation");

      const updatedReservation = await response.json();
      setReservations((prev) =>
        prev.map((res) =>
          res._id === reservationToEdit ? updatedReservation : res
        )
      );

      toast.success("Reservation updated successfully!");
      closeEditModal();

      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation.");
    }
  };

  const handleDelete = async () => {
    if (!reservationToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/reservations/${reservationToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete reservation");

      setReservations((prev) =>
        prev.filter((res) => res._id !== reservationToDelete)
      );
      toast.success("Reservation deleted successfully!");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation.");
    } finally {
      closeDeleteModal();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };
  const myTravelDetails = {
    destination: "Tokyo, Japan",
    startDate: "2024-04-15",
    endDate: "2024-04-22",
    purpose: "leisure",
    weather: "Mild with occasional rain, 15-20°C",
    hotel: {
      name: "Sakura Garden Hotel",
      area: "Shinjuku",
    },
    travelers: 2,
  };

  async function generateAndDisplayTips(reservation) {
    try {

      const weather = await fetchWeather(reservation.city);

      const tipsres = await getTravelTips(reservation, weather);
      const cleanJson = tipsres.slice(7, -3).trim();

      let tips;
      if (typeof tipsres === 'string') {
        tips = JSON.parse(cleanJson);
      }

      setTravelTips(tips);

    } catch (err) {
      console.error(err);
    }
  }
  const getTravelTips = async (travelDetails, weather) => {
    try {
      const prompt = `
        Generate comprehensive travel tips in bullet point format based on the following details and use given spesific names as more as possible(cities, hotel names , etc) :
        
       
        Weather Forecast: ${weather.forecast}
        City: ${weather.city}
        humidity: ${weather.humidity}
        temperature: ${weather.temperature}
        windSpeed: ${weather.windSpeed}
        visibility: ${weather.visibility}

        Traveler name: ${travelDetails.name}
        checking in date: ${travelDetails.checkIn}
        checking out date: ${travelDetails.checkOut}
        hotel name: ${travelDetails.hotelName}
        

        Travelers: ${travelDetails.travelers} ${travelDetails.travelers > 1 ? "people" : "person"
        }
        use above details to generate tips. but keep it between 5-10 tips. call the user by the first name of the traveler.

        Provide tips in the following categories no need additional details before or after in the response:

        i need those like in a json object but use keys as Preparation Checklist,Destination-Specific Advice,Weather Considerations. keep the tips in arrays as values. i need jsonparse this response in my code. so no additional things before or after the response.
      
        
        1. Preparation Checklist:
        - Essential items to pack
        - Documents needed
        - Health precautions
        
        2. Destination-Specific Advice:
        - Cultural norms to be aware of
        - Must-visit places
        - Local customs
        
        3. Weather Considerations:
        - How to dress appropriately
        - Activities suited for the forecast
        - Any weather-related precautions
        
        Keep each bullet point concise but informative.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      if (response && response.text) {
        return response.text;
      } else {
        throw new Error("No response text received from the API");
      }
    } catch (error) {
      console.error("Error generating travel tips:", error);
      return "Could not generate travel tips at this time. Please try again later.";
    }
  };

  const API_KEY = "27981ac19354bda01216eb6a960337e8"; // OpenWeatherMap API key

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) throw new Error("City not found");

      const currentWeather = await response.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) throw new Error("Forecast data not available");

      const forecastData = await forecastResponse.json();

      const weatherData = {
        city: currentWeather.name,
        country: currentWeather.sys.country,
        temperature: currentWeather.main.temp,
        condition: currentWeather.weather[0].main,
        description: currentWeather.weather[0].description,
        humidity: currentWeather.main.humidity,
        windSpeed: currentWeather.wind.speed * 3.6, // m/s to km/h
        pressure: currentWeather.main.pressure, // Atmospheric pressure in hPa
        visibility: currentWeather.visibility / 1000, // Visibility in km
        feelsLike: currentWeather.main.feels_like,
        forecast: forecastData.list,
      };

      return weatherData;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch weather data");
    }
  };

  return (
    <div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 mt-14">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 ">
              <h1 className="text-3xl font-bold text-white">Your Bookings</h1>
              <p className="text-blue-100 mt-2">Manage your hotel reservations</p>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="mb-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div>
                {reservations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations.map((res) => {
                      const nights = calculateNights(res.checkIn, res.checkOut);
                      const statusColor = getStatusColor(res.status);

                      return (
                        <div
                          key={res._id}
                          className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                        >
                          {/* Status Banner */}
                          <div
                            className={`px-4 py-2 ${statusColor} border-l-4 ${res.status === "confirmed"
                              ? "border-green-500"
                              : res.status === "cancelled"
                                ? "border-red-500"
                                : "border-yellow-500"
                              } flex justify-between items-center`}
                          >
                            <span className="font-medium capitalize">
                              {res.status || "Pending"}
                            </span>
                            <div className="text-sm">#{res._id.slice(-6)}</div>
                          </div>

                          {/* Hotel Name */}
                          <div className="px-6 pt-4 pb-2 border-b flex justify-between">
                            <h3 className="text-xl font-bold text-gray-800">
                              {res.hotelName || "Hotel Name"}
                            </h3>
                            {/*TODO add a proper icon*/}
                            <Lightbulb
                              className="text-yellow-600 drop-shadow-glow-extreme"
                              onClick={() => openDetailsModal(res)}
                            />
                          </div>

                          {/* Reservation Details */}
                          <div className="px-6 py-4">
                            {/* Guest Info */}
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <Users className="h-5 w-5 text-blue-500 mr-2" />
                                <h4 className="font-semibold text-gray-800">
                                  {res.name}
                                </h4>
                              </div>
                              <div className="ml-7 text-sm text-gray-600 flex flex-col space-y-1">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-2" />
                                  <span>{res.email}</span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-2" />
                                  <span>{res.phone}</span>
                                </div>
                              </div>
                            </div>

                            {/* Date Info */}
                            <div className="mb-4 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                                  <span className="text-sm font-medium">
                                    Check-in
                                  </span>
                                </div>
                                <span className="text-sm">
                                  {new Date(res.checkIn).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                                  <span className="text-sm font-medium">
                                    Check-out
                                  </span>
                                </div>
                                <span className="text-sm">
                                  {new Date(res.checkOut).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm font-medium">
                                    Duration
                                  </span>
                                </div>
                                <span className="text-sm">
                                  {nights} {nights === 1 ? "night" : "nights"}
                                </span>
                              </div>
                            </div>

                            {/* Room and Price Info */}
                            <div className="flex justify-between mb-4">
                              <div className="flex items-center">
                                <Home className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">
                                  {res.roomCount || 1}{" "}
                                  {(res.roomCount || 1) === 1 ? "Room" : "Rooms"}
                                </span>
                              </div>
                              <div className="flex items-center font-semibold text-gray-800">
                                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                <span>Rs {res.roomPrice}</span>
                              </div>
                            </div>

                            {/* Message if any */}
                            {res.message && (
                              <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-start">
                                  <MessageSquare className="h-4 w-4 text-blue-500 mr-2 mt-1" />
                                  <div className="text-sm text-gray-700">
                                    {res.message}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                            {res.status !== "confirmed" &&
                              res.status !== "cancelled" ? (
                              <button
                                onClick={() => openEditModal(res)}
                                className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                            ) : (
                              <button
                                className="text-gray-400 cursor-not-allowed flex items-center text-sm"
                                disabled
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => openDeleteModal(res._id)}
                              className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <div className="mx-auto h-16 w-16 text-gray-400">
                      <Calendar className="h-full w-full" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-600">
                      No reservations found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      You don't have any active bookings at the moment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <ToastContainer position="bottom-right" />

        {/* Edit Modal */}
        <ReactModal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          className="bg-white w-full max-w-2xl mx-auto my-10 p-0 rounded-xl shadow-2xl overflow-hidden"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4"
        >
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Modify Reservation</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="text-gray-400 h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400 h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Check In Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="text-gray-400 h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      min={today}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Check Out Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="text-gray-400 h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      min={formData.checkIn || today}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Room Count Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className="text-gray-400 h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      name="roomCount"
                      value={formData.roomCount}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Room Price Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">Rs.</span>
                    </div>
                    <input
                      type="number"
                      name="roomPrice"
                      value={formData.roomPrice}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-gray-400 h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Message Box */}
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="text-gray-400 h-4 w-4" />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Special requests or notes"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ReactModal>

        {/* Delete Modal */}
        <ReactModal
          isOpen={isDeleteModalOpen}
          onRequestClose={closeDeleteModal}
          className="bg-white w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4"
        >
          <div>
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-gray-700">
                  Are you sure you want to delete this reservation? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ReactModal>

        {/* Details Modal */}
        <ReactModal
          isOpen={isDetailsModalOpen}
          onRequestClose={closeDetailsModal}
          className="bg-white w-full max-w-2xl mx-auto my-10 p-0 rounded-xl shadow-2xl overflow-hidden"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4"
        >
          {selectedReservation && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white">
                  Travel Tips for {selectedReservation.name}
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {selectedReservation.hotelName}, {selectedReservation.city}
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[70vh]">
                {travelTips ? (
                  <>
                    {/* Preparation Checklist */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-bold text-blue-800 flex items-center mb-2">
                        <Check className="h-5 w-5 mr-2" />
                        Preparation Checklist
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {travelTips["Preparation Checklist"]?.map((tip, index) => (
                          <li key={index} className="text-sm md:text-base">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Destination-Specific Advice */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-bold text-purple-800 flex items-center mb-2">
                        <Info className="h-5 w-5 mr-2" />
                        Destination-Specific Advice
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {travelTips["Destination-Specific Advice"]?.map((tip, index) => (
                          <li key={index} className="text-sm md:text-base">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Weather Considerations */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-bold text-green-800 flex items-center mb-2">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        Weather Considerations
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {travelTips["Weather Considerations"]?.map((tip, index) => (
                          <li key={index} className="text-sm md:text-base">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-600">Generating personalized travel tips...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This may take a few moments
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with Close Button */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </ReactModal>
      </div>
    </div>
  );
};

export default BookedReservations;
