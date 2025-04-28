import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HotelTable = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  // Fetch hotels from backend on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("http://localhost:8070/api/hotels/all"); 
        setHotels(res.data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      }
    };
    fetchHotels();
  }, []);

  // Delete hotel by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/hotels/${id}`);
      setHotels(hotels.filter((hotel) => hotel._id !== id));
      alert("Hotel deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete hotel.");
    }
  };

  // Navigate to edit hotel page
  const handleEdit = (hotel) => {
    navigate("/admin/edit-hotel", { state: { hotel } });
  };

  return (
    <div className="w-4/5 mx-auto mt-5 text-center">
      <h2 className="text-2xl font-semibold mb-4">Hotel List</h2>
      <button
        className="px-4 py-2 mb-4 bg-blue-700 text-white rounded-lg hover:bg-blue-900 float-right"
        onClick={() => navigate("/admin/add-hotel")}
      >
        Add Hotel
      </button>
      <table className="w-full border-collapse border border-gray-300 shadow-lg ml-10">
        <thead>
          <tr className="bg-blue-200">
            <th className="border border-gray-300 p-3">Hotel ID</th>
            <th className="border border-gray-300 p-3">Hotel Name</th>
            <th className="border border-gray-300 p-3">Hotel Type</th>
            <th className="border border-gray-300 p-3">City</th>
            <th className="border border-gray-300 p-3">Address</th>
            <th className="border border-gray-300 p-3">Distance (KM)</th>
            <th className="border border-gray-300 p-3">Cheapest Price</th>
            <th className="border border-gray-300 p-3">Title</th>
            <th className="border border-gray-300 p-3">Description</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-3">{hotel.hotelId}</td>
              <td className="border border-gray-300 p-3">{hotel.name}</td>
              <td className="border border-gray-300 p-3">{hotel.type}</td>
              <td className="border border-gray-300 p-3">{hotel.city}</td>
              <td className="border border-gray-300 p-3">{hotel.address}</td>
              <td className="border border-gray-300 p-3">{hotel.distance}</td>
              <td className="border border-gray-300 p-3">Rs.{hotel.price}</td>
              <td className="border border-gray-300 p-3">{hotel.title}</td>
              <td className="border border-gray-300 p-3 text-xs">{hotel.desc}</td>
              <td className="border border-gray-300 p-3 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => handleEdit(hotel)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700"
                  onClick={() => handleDelete(hotel._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelTable;
