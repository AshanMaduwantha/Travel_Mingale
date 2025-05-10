import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Trash2, AlertTriangle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reviews");
      setReviews(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await axios.delete(`http://localhost:4000/api/reviews/${deleteId}`);
      setReviews(reviews.filter((review) => review._id !== deleteId));
      toast.success("Deleted successfully!");
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review.");
      closeDeleteModal();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Reviews", 14, 15);

    const tableColumn = ["#", "Hotel ID", "Name", "Rating", "Comment", "Date"];
    const tableRows = [];

    reviews.forEach((review, index) => {
      const row = [
        index + 1,
        review.hotelId,
        review.name,
        `${review.rating} ⭐`,
        review.comment,
        new Date(review.createdAt).toLocaleDateString(),
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Customer_Reviews.pdf");
  };

  const filteredReviews = reviews.filter((review) => {
    const query = searchQuery.toLowerCase();
    return (
      review.hotelId.toLowerCase().includes(query) ||
      review.name.toLowerCase().includes(query) ||
      new Date(review.createdAt).toLocaleDateString().includes(query)
    );
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-10 max-w-screen-xl mx-auto font-sans bg-gray-100 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-center sm:text-left text-gray-800 mb-4 sm:mb-0">
          All Customer Reviews
        </h3>
        <button
          onClick={generatePDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Download PDF
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Hotel ID, Name or Date..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Hotel ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review, index) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-100 border-b border-gray-200"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{review.hotelId}</td>
                  <td className="px-4 py-2">{review.name}</td>
                  <td className="px-4 py-2">{review.rating} ⭐</td>
                  <td className="px-4 py-2">{review.comment}</td>
                  <td className="px-4 py-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openDeleteModal(review._id)}
                      className=" text-red-600 p-2 rounded hover:text-blue-800 transition flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />

{/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black opacity-100 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
      {/* Header */}
      <div className="bg-red-600 text-white px-6 py-4">
        <h3 className="text-xl font-bold">Confirm Deletion</h3>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="flex mb-4">
          <div className="bg-red-100 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-gray-700">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
        <button
          onClick={closeDeleteModal}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
        
       
              </div>
            </div>
          </div>
        
      )}
    </div>
  );
}
export default AdminReview;