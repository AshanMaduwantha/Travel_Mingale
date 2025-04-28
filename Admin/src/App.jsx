import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminHome from './pages/home/AdminHome';
import NewHotel from './pages/hotel/newHotel/NewHotel';
import NewRoom from './pages/hotel/newHotel/NewHotel'
import UpdateRoom from './pages/hotel/updateHotel/UpdateHotel'




function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/admin' element={<AdminHome />} />
          <Route path='/admin/add-hotel' element={<NewHotel />} />
          <Route path='/admin/edit-hotel' element={< UpdateRoom/>} />
          <Route path='/admin/add-room' element={<NewRoom />} />
          <Route path='/admin/edit-hotel' element={< UpdateRoom/>} />

        </Routes>
      </Router>
    </>
  )
}

export default App
