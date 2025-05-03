import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminHome from './pages/home/AdminHome';
import NewHotel from './pages/hotel/newHotel/NewHotel';
import NewRoom from './pages/hotel/newHotel/NewHotel'
import UpdateRoom from './pages/hotel/updateHotel/UpdateHotel'
import UserManage from './pages/users/UserHome';
import AdminDashboard from './pages/reservation/reshome';
import { ToastContainer } from 'react-toastify'




function App() {
  

  return (
    <>
    
      <Router>
      <ToastContainer/>
        <Routes>
          <Route path='/admin' element={<AdminHome />} />
          <Route path='/admin/add-hotel' element={<NewHotel />} />
          <Route path='/admin/edit-hotel' element={< UpdateRoom/>} />
          <Route path='/admin/add-room' element={<NewRoom />} />
          <Route path='/admin/edit-hotel' element={< UpdateRoom/>} />
          <Route path='/usermanage' element={< UserManage/>} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
