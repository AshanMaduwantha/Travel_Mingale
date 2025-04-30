import React from 'react';
import Featured from '../../components/featured/Featured';
import FeaturedProperties from '../../components/featuredProperties/FeaturedProperties';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import PropertyList from '../../components/propertyList/PropertyList';
import Navbar from '../../components/Navbar';

function Home() {
  return (
    <div className="flex flex-col">
      {/* Navbar fixed at the top */}
      <div className=" top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      
      {/* Add padding to push content below fixed navbar */}
      <div className="pt-24">
        {/* Header comes right after navbar */}
        <Header />
        
        {/* Main content */}
        <div className="mt-12 flex flex-col items-center gap-8">
          <Featured />
          <h1 className="text-2xl font-semibold">Browse by property type</h1>
          <PropertyList />
          <h1 className="text-2xl font-semibold">Homes guests love</h1>
          <FeaturedProperties />
          <MailList />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;