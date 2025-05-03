import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ReactModal from 'react-modal'; 

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
        roomType: '',
        roomPrice: '',
        phone: '',
        message: '',
        status: 'pending'
    });

    const formatDate = (date) => new Date(date).toISOString().split('T')[0];

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/reservations");
                if (!response.ok) throw new Error("Failed to fetch reservations");
                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
        const intervalId = setInterval(fetchReservations, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const openEditModal = (reservation) => {
        setFormData({
            _id: reservation._id,
            name: reservation.name,
            email: reservation.email,
            checkIn: formatDate(reservation.checkIn),
            checkOut: formatDate(reservation.checkOut),
            roomType: reservation.roomType,
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

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) return toast.error("Name is required.");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return toast.error("Please enter a valid email address.");

        if (!formData.checkIn || !formData.checkOut) return toast.error("Both check-in and check-out dates are required.");

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const formattedCheckIn = new Date(formData.checkIn);
        const formattedCheckOut = new Date(formData.checkOut);

        if (formattedCheckIn < today) return toast.error("Check-in date must be today or a future date.");
        if (formattedCheckOut <= formattedCheckIn) return toast.error("Check-out date must be after check-in date.");

        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(formData.phone)) return toast.error("Phone number must be at least 10 digits.");
        if (isNaN(formData.roomPrice) || formData.roomPrice <= 0) return toast.error("Room price must be a positive number.");

        const updatedFormData = {
            ...formData,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
        };

        try {
            const response = await fetch(`http://localhost:4000/api/reservations/${reservationToEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
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

    // Get unique room types for filtering if needed
    const roomTypes = [...new Set(reservations.map(res => res.roomType))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
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
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Room</th>
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
                                                            <span className="font-medium text-gray-800">{res.name}</span>
                                                            <span className="text-sm text-gray-500">{res.email}</span>
                                                            <span className="text-sm text-gray-500">{res.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center">
                                                                <span className="mr-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded">Check-in</span>
                                                                <span>{new Date(res.checkIn).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center mt-2">
                                                                <span className="mr-2 text-xs bg-indigo-100 text-indigo-800 py-1 px-2 rounded">Check-out</span>
                                                                <span>{new Date(res.checkOut).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-800">{res.roomType}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-800">${res.roomPrice}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-2 inline-flex text-xs font-medium rounded-full ${
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
                                                            <button onClick={() => openEditModal(res)} 
                                                                className="text-blue-600 hover:text-blue-800 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button onClick={() => openDeleteModal(res._id)} 
                                                                className="text-red-600 hover:text-red-800 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
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

            {/* Modern Edit Modal */}
            <ReactModal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                className="bg-white w-full max-w-2xl mx-auto my-10 p-0 rounded-xl shadow-2xl overflow-hidden"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4"
            >
                <div>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Modify Your Reservation</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                    <select 
                                        name="roomType" 
                                        value={formData.roomType} 
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    >
                                        <option value="Deluxe">Deluxe Suite</option>
                                        <option value="Standard">Standard Room</option>
                                        <option value="Executive">Executive Suite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={formData.checkIn}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={formData.checkOut}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Price ($)</label>
                                    <input
                                        type="number"
                                        name="roomPrice"
                                        value={formData.roomPrice}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                ></textarea>
                            </div>
                            
                            <div className="flex justify-end space-x-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={closeEditModal} 
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </ReactModal>

            {/* Modern Delete Modal */}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-700">Are you sure you want to delete this reservation? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button 
                                onClick={closeDeleteModal} 
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Reservation
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};

export default BookedReservations;