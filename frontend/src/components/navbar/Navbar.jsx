import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className="h-12 bg-[#003580] flex justify-center">
      <div className="w-full max-w-screen-lg text-white flex items-center justify-between px-4">
        <Link to="/" className="">
        <span className="font-extrabold text-2xl">Travel Mingle</span>
        </Link>
        <div className="flex items-center">
          <button className="ml-5 border-none py-1 px-3 cursor-pointer text-[#003580]">
            Register
          </button>
          <button className="ml-5 border-none py-1 px-3 cursor-pointer text-[#003580]">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
