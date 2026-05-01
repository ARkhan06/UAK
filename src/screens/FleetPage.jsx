import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Users, Gauge, Briefcase, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarDetailModal from '../components/CarDetail';
import SUV from "../assets/SUV1.jfif";
import MiniVan from "../assets/MiniVan.jfif";
import Sedan from "../assets/sedan.jpg";
import Limo from "../assets/Limo.jpg";
import Van from "../assets/Van.jpg";
import Bus from "../assets/bus.jfif";

const NAVY = "#0a1e3d";
const RED = "#c8102e";

const FleetPage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const cars = [
    {
      id: 1,
      image: Sedan,
      name: 'Luxury Sedan',
      transmission: 'Automatic',
      seats: 4,
      luggage: 5,
      speed: '200 km/h',
      year: '2024',
    },
    {
      id: 2,
      image: Van,
      name: 'Executive Van',
      transmission: 'Automatic',
      seats: 14,
      luggage: 8,
      speed: '180 km/h',
      year: '2024',
    },
    {
      id: 3,
      image: SUV,
      name: 'Luxury SUV',
      transmission: 'Automatic',
      seats: 6,
      luggage: 7,
      speed: '210 km/h',
      year: '2024',
    },
    {
      id: 4,
      image: Bus,
      name: 'Premium Coach',
      transmission: 'Automatic',
      seats: 35,
      luggage: 12,
      speed: '160 km/h',
      year: '2024',
    },
    {
      id: 5,
      image: MiniVan,
      name: 'Luxury Motorcoach',
      transmission: 'Automatic',
      seats: 50,
      luggage: 16,
      speed: '155 km/h',
      year: '2024',
    },
    {
      id: 6,
      image: Limo,
      name: 'Premium Limousine',
      transmission: 'Automatic',
      seats: 8,
      luggage: 6,
      speed: '200 km/h',
      year: '2024',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const featureVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Navbar — blurred when modal is open */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'filter 0.3s ease',
          filter: isModalOpen ? 'blur(4px)' : 'none',
          pointerEvents: isModalOpen ? 'none' : 'auto',
        }}
      >
        <Navbar />
      </div>

      {/* Hero Section — 100dvh so it fills the full first screen including behind navbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: NAVY,
          minHeight: '100dvh',
          paddingTop: '80px', // offset for fixed navbar height
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${RED} 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Decorative blobs */}
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: RED }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: RED }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg font-semibold mb-4 tracking-wider uppercase"
            style={{ color: RED }}
          >
            Premium Transportation
          </motion.p>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight"
          >
            UAK Transport
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Experience unparalleled luxury and comfort with our carefully curated fleet of premium
            vehicles. From corporate travel to special occasions, we deliver excellence.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/booking">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${RED}` }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 text-white flex items-center gap-2 justify-center"
                style={{ backgroundColor: RED }}
              >
                Book Your Ride
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              onClick={() => document.getElementById('fleet-section').scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Fleet
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Fleet Section */}
      <div id="fleet-section" className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p
            className="text-sm md:text-base font-semibold uppercase tracking-widest mb-4"
            style={{ color: RED }}
          >
            Our Collection
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
            Premium Vehicle Fleet
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: RED }} />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {cars.map((car) => (
            <motion.div
              key={car.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative overflow-hidden h-64 bg-gray-200">
                <motion.img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: NAVY }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">{car.name}</h3>

                <div className="grid grid-cols-4 gap-3 ">
                  {[
                    { Icon: Gauge, label: car.speed },
                    { Icon: Car, label: car.transmission },
                    { Icon: Users, label: `${car.seats} Seats` },
                    { Icon: Briefcase, label: `${car.luggage} Bags` },
                  ].map(({ Icon, label }, i) => (
                    <motion.div
                      key={i}
                      variants={featureVariants}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className="p-2 rounded-lg mb-2"
                        style={{ backgroundColor: RED + '15' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: RED }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0 border-t border-gray-200">
                <motion.button
                  whileHover={{ backgroundColor: RED + '15' }}
                  whileTap={{ scale: 0.98 }}
                  className="py-4 px-4 text-center font-semibold text-sm transition-all duration-300"
                  style={{ color: RED, borderRight: '1px solid #f0f0f0' }}
                  onClick={() => handleOpenModal(car)}
                >
                  Details
                </motion.button>
                <Link to="/booking" className="w-full">
                  <motion.button
                    whileHover={{ backgroundColor: RED, color: 'white' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-4 text-center font-semibold text-sm transition-all duration-300"
                    style={{ color: RED }}
                  >
                    Book Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Why Choose Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 md:py-24"
        style={{ backgroundColor: NAVY }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: RED }}>
              Why Choose Us
            </p>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Excellence in Every Journey
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Luxury Fleet', desc: 'Meticulously maintained premium vehicles for ultimate comfort' },
              { title: 'Professional Drivers', desc: 'Experienced and courteous drivers dedicated to your safety' },
              { title: '24/7 Support', desc: 'Round-the-clock customer service for your peace of mind' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: RED }}
                >
                  <ArrowRight className="text-white" size={24} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Modal */}
      <CarDetailModal isOpen={isModalOpen} onClose={handleCloseModal} car={selectedCar} />

      {/* Footer — also blurred when modal is open */}
      <div
        style={{
          transition: 'filter 0.3s ease',
          filter: isModalOpen ? 'blur(4px)' : 'none',
        }}
      >
      </div>
    </div>
  );
};

export default FleetPage;