import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Phone, Mail, Home, Users, MessageSquare, Send, RefreshCw } from "lucide-react";

const ReservationPage = () => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomType: 'SINGLE',
    roomPrice: 695,
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.checkIn < today) {
      newErrors.checkIn = "Check-in date cannot be in the past.";
    }

    if (formData.checkOut && formData.checkOut <= formData.checkIn) {
      newErrors.checkOut = "Check-out date must be after check-in.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits (10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedData = {
      ...formData,
      checkIn: formData.checkIn.split("T")[0],
      checkOut: formData.checkOut.split("T")[0],
    };

    try {
      await axios.post('http://localhost:4000/api/reservations/', formattedData);
      toast.success('Reservation submitted successfully!');
      resetForm();
    } catch (error) {
      toast.error('Error submitting reservation');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      checkIn: '',
      checkOut: '',
      roomType: 'SINGLE',
      roomPrice: 695,
      phone: '',
      message: '',
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar - Hotel Image/Info */}
          <div className="bg-indigo-600 text-white p-8 md:w-1/3">
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6">LuxStay Hotel</h2>
              <div className="mb-8">
                <div className="h-1 w-12 bg-white rounded mb-6"></div>
                <p className="text-indigo-100 mb-4">Experience luxury like never before with our premium accommodations and world-class service.</p>
              </div>
              <div className="mt-auto">
                <div className="flex items-center mb-3">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">Available 365 days</span>
                </div>
                <div className="flex items-center mb-3">
                  <Phone size={16} className="mr-2" />
                  <span className="text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span className="text-sm">info@luxstay.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Your Stay</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Check In Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={today}
                    required
                    className={`w-full pl-10 pr-3 py-2 border ${errors.checkIn ? "border-red-500" : "border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.checkIn && (
                    <p className="text-xs text-red-600 mt-1">{errors.checkIn}</p>
                  )}
                </div>

                {/* Check Out Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || today}
                    required
                    className={`w-full pl-10 pr-3 py-2 border ${errors.checkOut ? "border-red-500" : "border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.checkOut && (
                    <p className="text-xs text-red-600 mt-1">{errors.checkOut}</p>
                  )}
                </div>

                {/* Room Type Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home size={16} className="text-gray-400" />
                  </div>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Deluxe">Deluxe Suite</option>
                    <option value="Standard">Standard Room</option>
                    <option value="Executive">Executive Suite</option>
                  </select>
                </div>

                {/* Room Price Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    name="roomPrice"
                    value={formData.roomPrice}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Field */}
                <div className="relative md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Message Box */}
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare size={16} className="text-gray-400" />
                </div>
                <textarea
                  name="message"
                  placeholder="Special requests or notes"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <Send size={16} className="mr-2" />
                  Complete Reservation
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast container must be rendered */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ReservationPage;