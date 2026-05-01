import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/Authcontext';
// Page imports
import HomePage from './screens/HomePage';
import FleetPage from './screens/FleetPage';
import BookingPage from './screens/Bookingpage';
import Contact from './screens/Contact';
import AdminDashboard from './screens/AdminDashboard';
// import ServicesPage from './screens/ServicesPage';
// import AboutPage from './screens/AboutPage';

import './App.css';
import Login from './screens/Login';
import Signup from './screens/Signup';
import PrivacyPolicy from './screens/PrivacyPolicy';

const AppContent = () => {
  const location = useLocation();
  
  // Routes that should NOT show Navbar and Footer
  const noLayoutRoutes = ['/login', '/signup'];
  const shouldShowLayout = !noLayoutRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen">
      {/* Fixed Navbar */}
      {shouldShowLayout && <Navbar />}
      <ScrollToTop />
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/booking" element={<BookingPage />}/>
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} /> */}
        
        {/* Fallback route */}
        <Route path="*" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      
      {shouldShowLayout && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;