import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">Hotel_Name Reservation Form</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Field Template */}
                    {[
                        { label: "Name", name: "name", type: "text", required: true },
                        { label: "Email", name: "email", type: "email", required: true, error: errors.email },
                        { label: "Check In", name: "checkIn", type: "date", required: true, min: today, error: errors.checkIn },
                        { label: "Check Out", name: "checkOut", type: "date", required: true, min: formData.checkIn || today, error: errors.checkOut },
                        { label: "Room Price", name: "roomPrice", type: "number", required: true },
                        { label: "Phone", name: "phone", type: "text", required: true, error: errors.phone },
                    ].map(({ label, name, type, required, min, error }) => (
                        <div key={name}>
                            <label className="block text-gray-700 font-medium mb-1">{label}:</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required={required}
                                min={min}
                                className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                            />
                            {error && (
                                <p className="text-sm text-red-600 mt-1">{error}</p>
                            )}
                        </div>
                    ))}

                    {/* Room Type Dropdown */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Room Type:</label>
                        <select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Deluxe">Deluxe Suite</option>
                            <option value="Standard">Standard Room</option>
                            <option value="Executive">Executive Suite</option>
                        </select>
                    </div>

                    {/* Message Box */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Message:</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row sm:space-x-4 gap-3 sm:gap-0 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
                        >
                            Submit Reservation
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition duration-200"
                        >
                            Reset All Fields
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast container must be rendered */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ReservationPage;
