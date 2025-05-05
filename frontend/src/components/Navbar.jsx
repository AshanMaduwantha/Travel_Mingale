import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Menu, X, ChevronDown, User, LogOut, History, Mail, Compass } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');

      if(data.success) {
        navigate('/email-verify')
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout'); 
      
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false); 
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navItems = [
    { label: 'Destinations', link: '/destinations' },
    { label: 'Experiences', link: '/experiences' },
    { label: 'Deals', link: '/deals' },
    { label: 'About Us', link: '/about' }
  ];

  return (
    <div className="w-full bg-white/90 backdrop-blur-md fixed top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
            <Compass className="text-blue-600 h-6 w-6" />
            <span className="font-bold text-xl text-blue-600">Travel Mingel</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => navigate(item.link)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Account / Login Button */}
          <div className="flex items-center">
            {userData ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-full hover:bg-gray-100">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                    {userData.name[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">{userData.name.split(' ')[0]}</span>
                  <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                </div>
                
                <div className="absolute invisible group-hover:visible top-full right-0 z-10 rounded pt-2 min-w-52">
                  <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{userData.name}</p>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                    <ul>
                      <li onClick={() => navigate('/profile')} className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50 cursor-pointer">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>My Profile</span>
                      </li>
                      <li onClick={() => navigate('/BReservation')} className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50 cursor-pointer">
                        <History className="h-4 w-4 text-gray-500" />
                        <span>Booking History</span>
                      </li>
                      {!userData.isAccountVerified && (
                        <li onClick={sendVerificationOtp} className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50 cursor-pointer">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>Verify Email</span>
                        </li>
                      )}
                      <li onClick={logout} className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50 cursor-pointer text-red-600">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-full px-5 py-2 text-white font-medium transition-all"
              >
                Create account <ChevronDown className="h-4 w-4 rotate-270" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 md:hidden focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1 border-t">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.link);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;