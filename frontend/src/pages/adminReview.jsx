import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/reviews/${id}`);
      setReviews(reviews.filter((review) => review._id !== id));
      toast.success("Deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review.");
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
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminReview;
