import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/reservations');
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
    const intervalId = setInterval(fetchReservations, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();

      setReservations(prev =>
        prev.map(r => (r._id === id ? { ...r, status: updated.status } : r))
      );

      toast.success('Status updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error updating status');
    }
  };

  const filteredReservations =
    statusFilter === 'all'
      ? reservations
      : reservations.filter(r => r.status === statusFilter);

  const statusClasses = {
    pending: 'bg-yellow-400 text-black',
    confirmed: 'bg-green-500 text-white',
    cancelled: 'bg-red-500 text-white',
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-zinc-200">
      <h1 className="text-4xl font-semibold text-center text-zinc-800 mb-8 font-[system-ui] tracking-tight">
        Admin Dashboard
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <label className="text-zinc-600 font-medium">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-zinc-300 rounded-xl bg-zinc-50 shadow-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-center mt-4">Loading reservations...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-zinc-800 text-sm">
            <thead className="bg-zinc-100 text-zinc-600 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Price ($)</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => (
                <tr
                  key={res._id}
                  className="even:bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  <td className="px-4 py-3">{res.name}</td>
                  <td className="px-4 py-3">{res.email}</td>
                  <td className="px-4 py-3">{new Date(res.checkIn).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(res.checkOut).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{res.roomType}</td>
                  <td className="px-4 py-3">${res.roomPrice}</td>
                  <td className="px-4 py-3">{res.message || 'No message'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusClasses[res.status]}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={res.status}
                      onChange={e => handleStatusChange(res._id, e.target.value)}
                      className="px-3 py-1 border border-zinc-300 rounded-xl bg-white shadow-sm text-sm text-zinc-800 focus:outline-none hover:border-blue-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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

export default AdminDashboard;
