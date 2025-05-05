import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: "Accommodations",
      links: [
        { name: "Homes", url: "#" },
        { name: "Apartments", url: "#" },
        { name: "Resorts", url: "#" },
        { name: "Villas", url: "#" },
        { name: "Hostels", url: "#" },
        { name: "Guest houses", url: "#" }
      ]
    },
    {
      title: "Discover",
      links: [
        { name: "Unique places", url: "#" },
        { name: "Travel reviews", url: "#" },
        { name: "Travel articles", url: "#" },
        { name: "Communities", url: "#" },
        { name: "Seasonal deals", url: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", url: "#" },
        { name: "Partner Help", url: "#" },
        { name: "Safety Center", url: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", url: "#" },
        { name: "Careers", url: "#" },
        { name: "Sustainability", url: "#" },
        { name: "Press center", url: "#" },
        { name: "Investor relations", url: "#" }
      ]
    }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "far fa-credit-card" },
    { name: "Mastercard", icon: "fab fa-cc-mastercard" },
    { name: "PayPal", icon: "fab fa-paypal" },
    { name: "Apple Pay", icon: "fab fa-apple-pay" }
  ];

  const apps = [
    { name: "App Store", icon: "fab fa-apple", url: "#" },
    { name: "Google Play", icon: "fab fa-google-play", url: "#" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top section with logo and apps */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-10 border-b border-gray-200">
          <div className="mb-6 md:mb-0 w-full md:w-1/2">
            <div className="flex items-center">
              <div className="text-blue-600 bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                TravelMingle
              </span>
            </div>
            <p className="text-gray-500 mt-3 text-sm max-w-md">
              Discover your perfect stay with TravelMingle. From luxury resorts to cozy homes, we've got your next adventure covered.
            </p>
          </div>
          
          {/* Mobile app download section */}
          <div className="w-full md:w-auto">
            <p className="text-gray-700 font-medium mb-3">Get the app</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="flex items-center bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05,20.28a3.38,3.38,0,0,1-1.64-2.18A8.92,8.92,0,0,1,12,20.25a8.94,8.94,0,0,1-3.42-2.15,3.38,3.38,0,0,1-1.63,2.18,3.39,3.39,0,0,1-1.73.45A2.21,2.21,0,0,1,3,19.2V5.5A2.21,2.21,0,0,1,5.2,3.25a3.39,3.39,0,0,1,1.73.45A3.46,3.46,0,0,1,8.56,5.88,8.94,8.94,0,0,1,12,3.75a8.92,8.92,0,0,1,3.42,2.13A3.46,3.46,0,0,1,17.05,3.7a3.39,3.39,0,0,1,1.73-.45A2.21,2.21,0,0,1,21,5.5V19.2a2.21,2.21,0,0,1-2.2,2.25A3.39,3.39,0,0,1,17.05,20.28Z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.9,10.37c2.48,1.43,2.48,1.83,2.48,1.83s-2.48,0.4-2.48,1.83L5.1,22c0,0-0.16-8.32,0-9.8L20.9,10.37z"/>
                  <path d="M20.9,10.37L5.1,2.2c0.16,1.48,0,9.8,0,9.8L20.9,10.37z"/>
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-16">
          {footerSections.map((section, index) => (
            <div key={index} className="w-full">
              <h3 className="text-base font-bold mb-5 text-gray-800 relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.url} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center text-sm group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-12 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="mb-6 md:mb-0 w-full md:w-1/2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Join our newsletter</h3>
              <p className="text-gray-600 text-sm">Get weekly travel inspiration, exclusive deals, and travel tips straight to your inbox.</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex flex-col sm:flex-row w-full">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-t-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent mb-2 sm:mb-0"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-l-none transition-colors duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-8 pb-10 w-full">
          <div className="mb-6 md:mb-0">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Accepted payment methods</h4>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white p-2 rounded shadow-sm">
                <svg className="w-8 h-5" viewBox="0 0 48 16" fill="#1434CB">
                  <path d="M14.8636 1.45455H11.4545L7.36364 10.9091L6.09091 1.45455H2.72727L4.90909 14.5455H8.36364L12.4545 5.09091L13.7273 14.5455H17.0909L14.8636 1.45455Z"/>
                  <path d="M21.2727 14.5455H24.7273V1.45455H21.2727V14.5455Z"/>
                  <path d="M30.1818 5.09091C28.1818 5.09091 26.9091 6.36364 26.9091 8.36364C26.9091 10.3636 28.1818 11.6364 30.1818 11.6364C32.1818 11.6364 33.4545 10.3636 33.4545 8.36364C33.4545 6.36364 32.1818 5.09091 30.1818 5.09091Z"/>
                  <path d="M33.4545 1.45455H30V14.5455H33.4545V13.2727C34.7273 14.5455 36 14.5455 37.2727 14.5455H41.4545V11.6364H37.2727C36 11.6364 34.7273 10.3636 34.7273 9.09091V1.45455H33.4545Z"/>
                  <path d="M44.9091 5.09091H42.1818L45.6364 10.9091L42.1818 14.5455H46.1818L48 11.6364L49.8182 14.5455H53.1818L49.7273 10.9091L53.1818 5.09091H49.1818L48 8L46.1818 5.09091H44.9091Z"/>
                </svg>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <svg className="w-8 h-5" viewBox="0 0 48 16" fill="#FF5F00">
                  <path d="M16 8C16 11.3 14.3 14.1 11.6 16H27.4C24.7 14.1 23 11.3 23 8C23 4.7 24.7 1.9 27.4 0H11.6C14.3 1.9 16 4.7 16 8Z"/>
                  <path d="M16 8C16 11.3 17.7 14.1 20.4 16C23.1 14.1 24.8 11.3 24.8 8C24.8 4.7 23.1 1.9 20.4 0C17.7 1.9 16 4.7 16 8Z" fill="#EB001B"/>
                  <path d="M40.4 8C40.4 4.7 38.7 1.9 36 0H20.2C22.9 1.9 24.6 4.7 24.6 8C24.6 11.3 22.9 14.1 20.2 16H36C38.7 14.1 40.4 11.3 40.4 8Z" fill="#F79E1B"/>
                </svg>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <svg className="w-8 h-5" viewBox="0 0 48 16" fill="#003087">
                  <path d="M9.5 4.8C9.8 4.1 10.4 3.6 11.1 3.6H15.6C18.1 3.6 19.8 5.3 19.3 7.7C18.8 10.1 16.4 11.8 13.9 11.8H12.3C11.9 11.8 11.6 12.1 11.5 12.5L10.8 16H7.5L9.5 4.8ZM12.7 7.3C12.8 6.7 13.3 6.3 13.9 6.3H14.6C15.4 6.3 16 6.9 15.9 7.7C15.8 8.5 15.1 9.1 14.3 9.1H12.3L12.7 7.3Z"/>
                  <path d="M20.5 7.8C21 5.4 23.4 3.7 25.9 3.7H29.9C30.6 3.7 31.2 4.2 31.3 4.9L33.3 16H30L29.6 14H24.4L23.7 16H20.4L20.5 7.8ZM25.4 11.3H29.1L28.4 7.4C28.3 7 28 6.7 27.6 6.7H26.7C25.7 6.7 24.9 7.5 24.7 8.5L25.4 11.3Z"/>
                  <path d="M34.5 4.8C34.8 4.1 35.4 3.6 36.1 3.6H40.6C43.1 3.6 44.8 5.3 44.3 7.7C43.8 10.1 41.4 11.8 38.9 11.8H37.3C36.9 11.8 36.6 12.1 36.5 12.5L35.8 16H32.5L34.5 4.8ZM37.7 7.3C37.8 6.7 38.3 6.3 38.9 6.3H39.6C40.4 6.3 41 6.9 40.9 7.7C40.8 8.5 40.1 9.1 39.3 9.1H37.3L37.7 7.3Z"/>
                </svg>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <svg className="w-8 h-5" viewBox="0 0 48 16" fill="#000000">
                  <path d="M10.2 4.6C11.2 3.5 12.6 3 14.3 3C16 3 17.4 3.6 18.3 4.7C19.3 5.8 19.6 7.2 19.4 8.9H11.5C11.6 9.7 11.9 10.3 12.5 10.7C13 11.1 13.8 11.3 14.6 11.3C15.4 11.3 16.1 11.1 16.5 10.8C17 10.5 17.3 10.1 17.4 9.6H19.3C19.1 10.6 18.6 11.5 17.6 12.1C16.7 12.8 15.5 13.1 14.1 13.1C12.5 13.1 11.2 12.6 10.2 11.7C9.2 10.7 8.7 9.3 8.7 7.5C8.7 6 9.2 5 10.2 4.6ZM11.3 7.4H16.9C16.9 6.7 16.7 6.1 16.2 5.7C15.7 5.3 15.1 5.1 14.4 5.1C13.7 5.1 13 5.3 12.5 5.7C12 6.1 11.5 6.7 11.3 7.4Z" fill="black"/>
                  <path d="M20.4 3.2H22.2V5.3H24.1V7.1H22.2V10.1C22.2 10.5 22.3 10.8 22.5 10.9C22.7 11.1 23 11.1 23.3 11.1H24.1V12.9C23.7 13 23.1 13 22.6 13C21.7 13 20.9 12.7 20.5 12.2C20 11.7 19.9 11 19.9 10.2V7.1H18.5V5.3H19.9V3.2H20.4Z" fill="black"/>
                  <path d="M30.7 5.3H32.6V6.6C32.9 6.1 33.3 5.7 33.8 5.4C34.3 5.1 34.9 5 35.5 5C36.8 5 37.8 5.4 38.5 6.3C39.2 7.1 39.5 8.3 39.5 9.7C39.5 11.1 39.2 12.3 38.5 13.1C37.8 14 36.8 14.4 35.5 14.4C34.9 14.4 34.3 14.3 33.8 14C33.3 13.7 32.9 13.3 32.6 12.8V16.8H30.7V5.3ZM35 12.6C35.8 12.6 36.4 12.3 36.9 11.8C37.3 11.3 37.6 10.6 37.6 9.7C37.6 8.8 37.4 8.1 36.9 7.6C36.5 7.1 35.8 6.8 35 6.8C34.2 6.8 33.6 7.1 33.1 7.6C32.7 8.1 32.4 8.8 32.4 9.7C32.4 10.6 32.6 11.3 33.1 11.8C33.6 12.3 34.2 12.6 35 12.6Z" fill="black"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="mt-6 md:mt-0">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Connect with us</h4>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-gray-500 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="pt-6 border-t border-gray-200 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © {currentYear} TravelMingle. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Cookie Settings</a>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;