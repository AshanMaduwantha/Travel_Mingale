import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminHome from './pages/home/AdminHome';
import NewHotel from './pages/hotel/newHotel/NewHotel';
import NewRoom from './pages/room/newRoom/NewRoom';
import UpdateHotel from './pages/hotel/updateHotel/UpdateHotel';
import UpdateRoom from './pages/room/updateRoom/UpdateRoom';
import RoomTable from './components/roomTable/RoomTable';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/admin' element={<AdminHome />} />
          <Route path='/admin/add-hotel' element={<NewHotel />} />
          <Route path='/admin/edit-hotel' element={< UpdateHotel/>} />
          <Route path='/admin/room' element={<RoomTable/>} />
          <Route path='/admin/add-room' element={<NewRoom />} />
          <Route path='/admin/edit-hotel' element={< UpdateRoom/>} />

        </Routes>
      </Router>
    </>
  )
}

export default App
