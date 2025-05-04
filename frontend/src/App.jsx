import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Profile from './pages/UserProfile'

import Hotel from './pages/hotel/Hotel';
import List from './pages/list/List';



import ReservationPage from './pages/ReservationPage';
import BookedReservations from './pages/BookedReservation';




import ReviewForm from "./pages/reviewForm"
import AdminReview from "./pages/adminReview"
import ReviewPerformance from "./pages/reviewPerformance"





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
        <Route path='/hotels' element={<List />} />
        <Route path='/hotels/:id' element={<Hotel />} />


        {/*  Kavindu */ }
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/BReservation" element={<BookedReservations />} />



        {/* pamuditha */}
        <Route path="/reviewForm" element={<ReviewForm />} />
        <Route path="/adminreview" element={<AdminReview />} />
        <Route path="/reviewPerformance" element={<ReviewPerformance />} />



        
       
        
      </Routes>
    </div>
  )
}

export default App