import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge, Users, Briefcase, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAVY = "#0a1e3d";
const RED = "#c8102e";

const CarDetailModal = ({ isOpen, onClose, car }) => {
  if (!car) return null;

  const specs = [
    { label: 'Transmission', value: car.transmission },
    { label: 'Seats', value: `${car.seats} Passengers` },
    { label: 'Luggage', value: `${car.luggage} Bags` },
    { label: 'Top Speed', value: car.speed },
  ];

  const features = [
    'GPS Navigation',
    'Bluetooth Audio',
    'Leather Seats',
    'Climate Control',
    'Premium Sound',
    'Parking Sensors',
    'Tinted Windows',
    'WiFi Onboard',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10, 30, 61, 0.75)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-2xl flex flex-col md:flex-row mt-10"
            style={{
              backgroundColor: NAVY,
              border: `1px solid rgba(200, 16, 46, 0.3)`,
              maxHeight: '85vh',
            }}
          >
            {/* Left — Image */}
            <div className="w-full md:w-1/2 relative" style={{ minHeight: '260px' }}>
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
                style={{ minHeight: '260px' }}
              />
              {/* Red gradient overlay at bottom of image */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24"
                style={{
                  background: `linear-gradient(to top, ${NAVY}, transparent)`,
                }}
              />
              {/* Year badge */}
              
            </div>

            {/* Right — Content */}
            <div
              className="w-full md:w-1/2 flex flex-col overflow-y-auto"
              style={{ color: 'white' }}
            >
              {/* Header */}
              <div
                className="flex items-start justify-between p-6 pb-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: RED }}
                  >
                    UAK Transport
                  </p>
                  <h2 className="text-3xl font-bold text-white">{car.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors ml-3 flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = RED)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6 flex-1">
                {/* Specs grid */}
                <div className="grid grid-cols-2 gap-3">
                  {specs.map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {label}
                      </p>
                      <p className="font-semibold text-white text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: RED }}
                  >
                    Included Features
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ backgroundColor: RED + '30', color: RED }}
                        >
                          ✓
                        </span>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CarDetailModal;