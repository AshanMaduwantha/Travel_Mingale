import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/Profile'
import AdminHome from './pages/home/AdminHome';
import NewHotel from './pages/hotel/newHotel/NewHotel';
import UpdateHotel from './pages/hotel/updateHotel/UpdateHotel';
import UpdateRoom from './pages/room/updateRoom/UpdateRoom';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/profile' element={<Profile/>}/>

        /* Oshadhie routes */
        <Route path='/admin' element={<AdminHome />} />
          <Route path='/admin/add-hotel' element={<NewHotel />} />
          <Route path='/admin/edit-hotel' element={< UpdateHotel/>} />
          <Route path='/admin/edit-hotel' element={< UpdateRoom/>} />
      </Routes>
    </div>
  )
}

export default App