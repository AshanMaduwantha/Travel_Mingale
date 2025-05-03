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

    return (
        <div className="p-6">
            <div className="bg-white shadow-xl rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Booking History</h1>

                {loading ? (
                    <p className="text-gray-500">Loading reservations...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Check-in</th>
                                    <th className="px-4 py-2">Check-out</th>
                                    <th className="px-4 py-2">Room Type</th>
                                    <th className="px-4 py-2">Price ($)</th>
                                    <th className="px-4 py-2">Message</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((res) => (
                                        <tr key={res._id} className="border-b text-sm text-gray-700">
                                            <td className="px-4 py-2">{res.name}</td>
                                            <td className="px-4 py-2">{res.email}</td>
                                            <td className="px-4 py-2">{new Date(res.checkIn).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{new Date(res.checkOut).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{res.roomType}</td>
                                            <td className="px-4 py-2">${res.roomPrice}</td>
                                            <td className="px-4 py-2">{res.message || 'No message'}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    res.status === "confirmed"
                                                        ? "bg-green-500 text-white"
                                                        : res.status === "cancelled"
                                                        ? "bg-red-500 text-white"
                                                        : "bg-yellow-400 text-black"
                                                }`}>
                                                    {res.status ? res.status.charAt(0).toUpperCase() + res.status.slice(1) : "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 space-x-2">
                                                <button onClick={() => openEditModal(res)} className="text-blue-600 hover:underline">Edit</button>
                                                <button onClick={() => openDeleteModal(res._id)} className="text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-gray-500 py-4">No reservations found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ToastContainer />

            {/* Edit Modal */}
            <ReactModal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                className="bg-white w-[800px] h-auto max-h-[90vh] mx-auto p-6 rounded-lg shadow-xl overflow-y-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"

            >
                <div>
                    <h2 className="text-2xl font-bold mb-4">Edit Reservation</h2>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        {Object.keys(formData).map((key) => {
                            if (key === '_id' || key === 'status') return null;
                            return (
                                <div key={key}>
                                    <label className="block font-medium capitalize mb-1">{key}</label>
                                    {key === 'roomType' ? (
                                        <select name="roomType" value={formData.roomType} onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2">
                                            <option value="Deluxe">Deluxe Suite</option>
                                            <option value="Standard">Standard Room</option>
                                            <option value="Executive">Executive Suite</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={key.includes("check") ? "date" : key === "roomPrice" ? "number" : "text"}
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            required
                                        />
                                    )}
                                </div>
                            );
                        })}
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                        </div>
                    </form>
                </div>
            </ReactModal>

            {/* Delete Modal */}
            <ReactModal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                className="bg-white max-w-md mx-auto mt-20 p-6 rounded-lg shadow-xl"
                overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
            >
                <div>
                    <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this reservation?</h2>
                    <div className="flex justify-end space-x-4">
                        <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Delete</button>
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};

export default BookedReservations;
