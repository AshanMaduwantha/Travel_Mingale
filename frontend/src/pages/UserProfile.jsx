import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Phone, Mail, Calendar, MapPin, Save, Loader2, CheckCircle, AlertCircle, Camera } from 'lucide-react';

export default function UserProfile() {
  const [userID] = useState('your-user-id-here'); // Replace with actual user ID
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
    address: ''
  });

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setStatus('loading');
      try {
        const res = await axios.get('http://localhost:4000/api/user/data', {
          data: { userID },
        });
        setFormData(res.data.userData);
        setStatus('idle');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setStatus('error');
      }
    };

    fetchUserData();
  }, [userID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.put('http://localhost:4000/api/user/update', {
        userID,
        ...formData
      });
      setMessage(res.data.message);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Update failed.');
      setStatus('error');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mb-4 overflow-hidden">
              <User className="w-12 h-12 text-white" />
            </div>
            <button className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">User Profile</h2>
          <p className="text-gray-500">Manage your personal information</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 py-3 px-4 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field - Disabled */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 py-3 px-4 text-gray-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 py-3 px-4 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Birthday Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday?.substring(0, 10)}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 py-3 px-4 transition-colors"
                />
              </div>
            </div>

            {/* Gender Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 py-3 px-4"
              >
                <option value="Other">Other</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Address Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 py-3 px-4 transition-colors"
                  placeholder="Enter your address"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white shadow-sm hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}