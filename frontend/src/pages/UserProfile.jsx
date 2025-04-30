// src/components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
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

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/user/data', {
          data: { userID }, // GET with body (may need to change to POST or use query param if server doesn't support this)
        });
        setFormData(res.data.userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
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
    try {
      const res = await axios.put('http://localhost:4000/api/user/update', {
        userID,
        ...formData
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage('Update failed.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>User Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:<br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label><br /><br />

        <label>Email:<br />
          <input type="email" name="email" value={formData.email} disabled />
        </label><br /><br />

        <label>Phone:<br />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </label><br /><br />

        <label>Birthday:<br />
          <input type="date" name="birthday" value={formData.birthday?.substring(0, 10)} onChange={handleChange} />
        </label><br /><br />

        <label>Gender:<br />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Other">Other</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label><br /><br />

        <label>Address:<br />
          <textarea name="address" value={formData.address} onChange={handleChange} />
        </label><br /><br />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
