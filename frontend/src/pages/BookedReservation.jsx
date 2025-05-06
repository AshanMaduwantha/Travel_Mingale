import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from 'react-modal';
import { Calendar, Phone, Mail, Home, Users, MessageSquare, Edit, Trash2, Check, X } from 'lucide-react';

ReactModal.setAppElement('#root');

const BookedReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [reservationToEdit, setReservationToEdit] = useState(null);
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        email: '',
        checkIn: '',
        checkOut: '',
        roomCount: 1,
        roomPrice: '',
        phone: '',
        message: '',
        status: 'pending'
    });

    const formatDate = (date) => new Date(date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

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
            message: reservation.message || '',
            status: reservation.status || 'pending'
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
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Invalid email format";
        if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Phone must be 10 digits";
        if (new Date(formData.checkIn) < new Date(today)) errors.checkIn = "Check-in must be today or later";
        if (new Date(formData.checkOut) <= new Date(formData.checkIn)) errors.checkOut = "Check-out must be after check-in";
        if (isNaN(formData.roomPrice) || formData.roomPrice <= 0) errors.roomPrice = "Invalid price";
        if (isNaN(formData.roomCount) || formData.roomCount < 1) errors.roomCount = "Invalid room count";

        return Object.keys(errors).length === 0 ? null : errors;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (formErrors) {
            Object.values(formErrors).forEach(error => toast.error(error));
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/reservations/${reservationToEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    checkIn: new Date(formData.checkIn),
                    checkOut: new Date(formData.checkOut)
                }),
            });

            if (!response.ok) throw new Error('Failed to update reservation');

            const updatedReservation = await response.json();
            setReservations(prev => 
                prev.map(res => (res._id === reservationToEdit ? updatedReservation : res))
            );

            toast.success('Reservation updated successfully!');
            closeEditModal();
        } catch (error) {
            console.error("Error updating reservation:", error);
            toast.error('Failed to update reservation.');
        }
    };

    const handleDelete = async () => {
        if (!reservationToDelete) return;

        try {
            const response = await fetch(`http://localhost:4000/api/reservations/${reservationToDelete}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete reservation");

            setReservations(prev => prev.filter(res => res._id !== reservationToDelete));
            toast.success("Reservation deleted successfully!");
        } catch (error) {
            console.error("Error deleting reservation:", error);
            toast.error("Failed to delete reservation.");
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white">Your Bookings</h1>
                        <p className="text-blue-100 mt-2">Manage your hotel reservations</p>
                    </div>

                    {/* Main Content Section */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {reservations.length > 0 ? (
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-left">
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Hotel</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Rooms</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {reservations.map((res) => (
                                                <tr key={res._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-800">{res.hotelName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-800">{res.name}</span>
                                                            <span className="text-sm text-gray-500 flex items-center">
                                                                <Mail className="mr-1 h-3 w-3" /> {res.email}
                                                            </span>
                                                            <span className="text-sm text-gray-500 flex items-center">
                                                                <Phone className="mr-1 h-3 w-3" /> {res.phone}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center">
                                                                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                                                                <span>{new Date(res.checkIn).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center mt-2">
                                                                <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                                                                <span>{new Date(res.checkOut).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <Home className="mr-2 h-4 w-4 text-gray-500" />
                                                            <span>{res.roomCount || 1}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-800">Rs {res.roomPrice}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                                                            res.status === "confirmed"
                                                                ? "bg-green-100 text-green-800"
                                                                : res.status === "cancelled"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                            {res.status ? res.status.charAt(0).toUpperCase() + res.status.slice(1) : "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex space-x-3">
                                                            <button 
                                                                onClick={() => openEditModal(res)} 
                                                                className="text-blue-600 hover:text-blue-800 flex items-center"
                                                            >
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => openDeleteModal(res._id)} 
                                                                className="text-red-600 hover:text-red-800 flex items-center"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="mx-auto h-16 w-16 text-gray-400">
                                            <Calendar className="h-full w-full" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-gray-600">No reservations found</h3>
                                        <p className="mt-2 text-gray-500">You don't have any active bookings at the moment.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
                            <p className="text-gray-700">Are you sure you want to delete this reservation? This action cannot be undone.</p>
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
        </div>
    );
};

export default BookedReservations;