import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Briefcase, Phone, Mail, ChevronUp, ChevronDown, History, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import SUV from "../assets/SUV1.jfif";
import MiniVan from "../assets/MiniVan.jfif";
import Sedan from "../assets/sedan.jpg";
import Limo from "../assets/Limo.jpg";
import Van from "../assets/Van.jpg";
import Bus from "../assets/bus.jfif";
import BookingsDisplay from '../components/Bookingdisplay';

// UAK Transport Colors
const COLORS = {
  NAVY: "#0a1e3d",
  RED: "#c8102e",
  WHITE: "#ffffff",
  LIGHT_GRAY: "#f8f9fa",
  DARK_GRAY: "#2d3748",
  BORDER: "#e2e8f0"
};

// Leaflet Map Components (OpenStreetMap - free)
const MapSelector = ({ location, setLocation, label, error }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Initialize the map when component mounts
  useEffect(() => {
    // Create link for Leaflet CSS if not already present
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Load Leaflet JS if not already loaded
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (map) map.remove();
    };
  }, []);

  const initMap = () => {
    const usaCenter = [39.8283, -98.5795];
    const zoomLevel = 4;
    
    const mapInstance = window.L.map(mapRef.current).setView(usaCenter, zoomLevel);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    const markerInstance = window.L.marker(usaCenter, {
      draggable: true
    }).addTo(mapInstance);
    
    markerInstance.on('dragend', async () => {
      const position = markerInstance.getLatLng();
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`,
          { headers: { 'Accept-Language': 'en-US,en' } }
        );
        const data = await response.json();
        if (data && data.display_name) {
          setLocation(data.display_name);
        }
      } catch (error) {
        console.error('Error with reverse geocoding:', error);
      }
    });
    
    setMap(mapInstance);
    setMarker(markerInstance);
    
    if (location) {
      searchLocation(location);
    }
  };

  const searchLocation = async (query) => {
    if (!query) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        { headers: { 'Accept-Language': 'en-US,en' } }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSearchResults(data);
        
        if (query === location) {
          const result = data[0];
          const position = [parseFloat(result.lat), parseFloat(result.lon)];
          
          if (map && marker) {
            map.setView(position, 15);
            marker.setLatLng(position);
          }
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  useEffect(() => {
    if (location && map && marker) {
      searchLocation(location);
    }
  }, [location, map, marker]);

  const handleResultClick = (result) => {
    setLocation(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    
    const position = [parseFloat(result.lat), parseFloat(result.lon)];
    if (map && marker) {
      map.setView(position, 15);
      marker.setLatLng(position);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: COLORS.NAVY }}>{label}</label>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search for ${label.toLowerCase()}`}
          className={`w-full p-3 border rounded-lg pl-10 focus:outline-none transition ${
            error ? 'border-red-500' : ''
          }`}
          style={{
            borderColor: error ? '#ef4444' : COLORS.BORDER,
            backgroundColor: COLORS.WHITE
          }}
        />
        <MapPin className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
        
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto" style={{ backgroundColor: COLORS.WHITE }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 cursor-pointer text-sm hover:bg-blue-50"
                onClick={() => handleResultClick(result)}
                style={{ borderBottom: `1px solid ${COLORS.BORDER}` }}
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}
        
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div ref={mapRef} className="w-full h-48 rounded-lg border mt-2 z-0" style={{ borderColor: COLORS.BORDER }}></div>
    </div>
  );
};

// Route map component
const RouteMap = ({ pickup, dropoff }) => {
  const mapRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);
  
  useEffect(() => {
    if (!window.L || !pickup || !dropoff) return;
    
    const map = window.L.map(mapRef.current);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const getCoordinates = async (location) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
          { headers: { 'Accept-Language': 'en-US,en' } }
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
      } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
      }
    };
    
    const getRoute = async (from, to) => {
      try {
        const fromCoord = `${from[1]},${from[0]}`;
        const toCoord = `${to[1]},${to[0]}`;
        
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromCoord};${toCoord}?overview=full&geometries=polyline`
        );
        const data = await response.json();
        
        if (data && data.routes && data.routes.length > 0) {
          return {
            geometry: data.routes[0].geometry,
            distance: (data.routes[0].distance / 1000).toFixed(1),
            duration: Math.round(data.routes[0].duration / 60)
          };
        }
        return null;
      } catch (error) {
        console.error('Error getting route:', error);
        return null;
      }
    };
    
    const showRoute = async () => {
      try {
        const pickupCoords = await getCoordinates(pickup);
        const dropoffCoords = await getCoordinates(dropoff);
        
        if (!pickupCoords || !dropoffCoords) {
          console.error('Could not find coordinates for one or both locations');
          return;
        }
        
        const pickupMarker = window.L.marker(pickupCoords, {
          icon: window.L.divIcon({
            html: `<div class="w-4 h-4 rounded-full border-2 border-white" style="background-color: ${COLORS.RED}"></div>`,
            className: 'custom-div-icon'
          })
        }).addTo(map).bindPopup('Pickup');
        
        const dropoffMarker = window.L.marker(dropoffCoords, {
          icon: window.L.divIcon({
            html: `<div class="w-4 h-4 rounded-full border-2 border-white" style="background-color: ${COLORS.NAVY}"></div>`,
            className: 'custom-div-icon'
          })
        }).addTo(map).bindPopup('Dropoff');
        
        const route = await getRoute(pickupCoords, dropoffCoords);
        
        if (route) {
          const decodedPolyline = window.L.Polyline.fromEncoded(route.geometry).getLatLngs();
          
          const routeLine = window.L.polyline(decodedPolyline, {
            color: COLORS.NAVY,
            weight: 6,
            opacity: 0.8,
            lineJoin: 'round'
          }).addTo(map);
          
          const bounds = routeLine.getBounds();
          map.fitBounds(bounds, { padding: [30, 30] });
          
          setRouteInfo({
            distance: `${route.distance} km`,
            duration: `${route.duration} min`
          });
        } else {
          const bounds = window.L.latLngBounds([pickupCoords, dropoffCoords]);
          map.fitBounds(bounds, { padding: [30, 30] });
          
          const distance = map.distance(pickupCoords, dropoffCoords) / 1000;
          const estimatedSpeed = 50;
          const duration = Math.round((distance / estimatedSpeed) * 60);
          
          setRouteInfo({
            distance: `~${distance.toFixed(1)} km (straight line)`,
            duration: `~${duration} min (estimated)`
          });
        }
      } catch (error) {
        console.error('Error displaying route:', error);
      }
    };
    
    if (!window.L.Polyline.fromEncoded) {
      window.L.Polyline.fromEncoded = function(encoded, options) {
        const decode = function(encoded) {
          let points = [];
          let index = 0, len = encoded.length;
          let lat = 0, lng = 0;
          
          while (index < len) {
            let b, shift = 0, result = 0;
            
            do {
              b = encoded.charAt(index++).charCodeAt(0) - 63;
              result |= (b & 0x1f) << shift;
              shift += 5;
            } while (b >= 0x20);
            
            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            
            shift = 0;
            result = 0;
            
            do {
              b = encoded.charAt(index++).charCodeAt(0) - 63;
              result |= (b & 0x1f) << shift;
              shift += 5;
            } while (b >= 0x20);
            
            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            
            points.push([lat * 1e-5, lng * 1e-5]);
          }
          
          return points;
        };
        
        return new window.L.Polyline(decode(encoded), options);
      };
    }
    
    showRoute();
    
    return () => {
      map.remove();
    };
  }, [pickup, dropoff]);
  
  return (
    <div className="space-y-2">
      <div ref={mapRef} className="w-full h-64 rounded-lg border mt-2" style={{ borderColor: COLORS.BORDER }}></div>
      {routeInfo && (
        <div className="flex justify-between text-sm mt-2" style={{ color: COLORS.NAVY }}>
          <div>Distance: <span className="font-medium">{routeInfo.distance}</span></div>
          <div>Duration: <span className="font-medium">{routeInfo.duration}</span></div>
        </div>
      )}
    </div>
  );
};

// Booking History Modal
const BookingHistoryModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-96 overflow-y-auto rounded-xl shadow-2xl"
            style={{ backgroundColor: COLORS.WHITE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex justify-between items-center p-6" style={{ backgroundColor: COLORS.NAVY, color: COLORS.WHITE }}>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="w-6 h-6" />
                Booking History
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:opacity-70 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <BookingsDisplay inModal={true} showAll={true} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main BookingPage component
const BookingPage = () => {
// ✅ FIXED: useAuth destructuring
const { user, login, isAuthenticated } = useAuth();

// ✅ FIXED: guest session init
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isGuestSessionSet, setIsGuestSessionSet] = useState(() => {
    return !!localStorage.getItem('guestEmail') && !isAuthenticated;
  });  
  const cars = [
    {
      id: 1,
      image: Sedan,
      name: 'Luxury Sedan',
      price: "1500",
      transmission: "Automatic",
      seats: 5,
      luggage: 4,
      speed: 4800,
      year: "2024"
    },
    {
      id: 2,
      image: MiniVan,
      name: 'Executive Vans',
      price: "2000",
      transmission: "Automatic",
      seats: 14,
      luggage: 6,
      speed: 4200,
      year: "2024"
    },
    {
      id: 3,
      image: SUV,
      name: 'Luxury SUVs',
      price: "2500",
      transmission: "Automatic",
      seats: 6,
      luggage: 5,
      speed: 5000,
      year: "2024"
    },
    {
      id: 4,
      image: Van,
      name: 'Luxury MiniBus',
      price: "3000",
      transmission: "Automatic",
      seats: 35,
      luggage: 12,
      speed: 3800,
      year: "2024"
    },
    {
      id: 5,
      image: Bus,
      name: 'Luxury Motor Coach',
      price: "4000",
      transmission: "Automatic",
      seats: 50,
      luggage: 16,
      speed: 3500,
      year: "2024"
    },
    {
      id: 6,
      image: Limo,
      name: 'Stretch Limo',
      price: "5000",
      transmission: "Automatic",
      seats: 8,
      luggage: 4,
      speed: 4500,
      year: "2024"
    }
  ];

  // Initialize form data from localStorage if it exists
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('bookingFormData');
    return saved ? JSON.parse(saved) : {
      pickupDate: '',
      pickupTime: '',
      pickupLocation: '',
      dropoffLocation: '',
      phoneNumber: '',
      email: '',
    };
  });

  // Pre-fill email for authenticated users after component mounts
  useEffect(() => {
    if (isAuthenticated && user?.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [isAuthenticated, user]);
  
  const [selectedCar, setSelectedCar] = useState(() => {
    const saved = localStorage.getItem('selectedCar');
    return saved ? JSON.parse(saved) : null;
  });

  const [passengers, setPassengers] = useState(() => {
    const saved = localStorage.getItem('passengers');
    return saved ? parseInt(saved) : 1;
  });

  const [luggage, setLuggage] = useState(() => {
    const saved = localStorage.getItem('luggage');
    return saved ? parseInt(saved) : 0;
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [routeDetails, setRouteDetails] = useState(null);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('selectedCar', JSON.stringify(selectedCar));
  }, [selectedCar]);

  useEffect(() => {
    localStorage.setItem('passengers', passengers.toString());
  }, [passengers]);

  useEffect(() => {
    localStorage.setItem('luggage', luggage.toString());
  }, [luggage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const updatePickupLocation = (value) => {
    setFormData(prev => ({ ...prev, pickupLocation: value }));
    if (errors.pickupLocation) {
      setErrors(prev => ({ ...prev, pickupLocation: '' }));
    }
  };

  const updateDropoffLocation = (value) => {
    setFormData(prev => ({ ...prev, dropoffLocation: value }));
    if (errors.dropoffLocation) {
      setErrors(prev => ({ ...prev, dropoffLocation: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+1|1)?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation) newErrors.dropoffLocation = 'Drop-off location is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number format';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!selectedCar) newErrors.car = 'Please select a vehicle';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    
    if (!validateForm()) {
      setSubmitMessage('Please fill in all required fields correctly.');
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        ...formData,
        passengers,
        luggage,
        selectedCar: {
          id: selectedCar.id,
          name: selectedCar.name,
          price: selectedCar.price
        }
      };

      if (routeDetails) {
        bookingData.routeDetails = routeDetails;
      }

      // Get token if logged in
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // API endpoint
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setSubmitMessage('Booking created successfully!');
      
      // If guest user, set guest session and show confirmation
      if (!isAuthenticated && formData.email) {
        localStorage.setItem('guestEmail', formData.email);
        localStorage.setItem('guestSessionTime', new Date().getTime().toString());
        setIsGuestSessionSet(true);
      }
      
      // Clear form data from localStorage
      localStorage.removeItem('bookingFormData');
      localStorage.removeItem('selectedCar');
      localStorage.removeItem('passengers');
      localStorage.removeItem('luggage');
      
      // Reset form
      setFormData({
        pickupDate: '',
        pickupTime: '',
        pickupLocation: '',
        dropoffLocation: '',
        phoneNumber: '',
        email: '',
      });
      setSelectedCar(null);
      setPassengers(1);
      setLuggage(0);
      setRouteDetails(null);

      // Reload to refresh bookings display
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Booking error:', error);
      setSubmitMessage(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.LIGHT_GRAY }}>
      
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ color: COLORS.NAVY }}>Book Your Luxury Ride</h1>
              <p style={{ color: COLORS.DARK_GRAY }} className="text-lg mt-2">Experience premium transportation with UAK Transport's luxury fleet.</p>
            </div>
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition text-white whitespace-nowrap"
                style={{ backgroundColor: COLORS.RED }}
              >
                <History className="w-5 h-5" />
                <span>Booking History</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Guest User Disclaimer - Show only if guest and no session warning */}
        {!isAuthenticated && !isGuestSessionSet && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg flex gap-3"
            style={{ backgroundColor: '#fef3c7', borderLeft: `4px solid ${COLORS.RED}` }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.RED }} />
            <div>
              <p className="font-medium" style={{ color: COLORS.NAVY }}>Booking as Guest</p>
              <p style={{ color: COLORS.DARK_GRAY }} className="text-sm">
                You're booking as a guest. Your booking details will be saved and can be accessed using the email address you provide. 
                <strong> <a href="/login" className="underline ml-1" style={{ color: COLORS.RED }}>Create an account</a></strong> to save your bookings and access exclusive benefits.
              </p>
            </div>
          </motion.div>
        )}

        {/* Guest Session Active - Show confirmation */}
        {!isAuthenticated && isGuestSessionSet && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg flex gap-3"
            style={{ backgroundColor: '#dcfce7', borderLeft: `4px solid #22c55e` }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
            <div>
              <p className="font-medium" style={{ color: COLORS.NAVY }}>You have a guest session active</p>
              <p style={{ color: COLORS.DARK_GRAY }} className="text-sm">
                Your bookings are saved. Use your email to retrieve your bookings. 
                <strong> <a href="/login" className="underline ml-1" style={{ color: COLORS.RED }}>Log in or create account</a></strong> to manage your bookings more easily.
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl shadow-lg p-6"
            style={{ backgroundColor: COLORS.WHITE }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.NAVY }}>Booking Details</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Pickup Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg pl-10 focus:outline-none transition"
                    style={{
                      borderColor: errors.pickupDate ? '#ef4444' : COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                  />
                  <Calendar className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
                  {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Pickup Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg pl-10 focus:outline-none transition"
                    style={{
                      borderColor: errors.pickupTime ? '#ef4444' : COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                  />
                  <Clock className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
                  {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
                </div>
              </div>

              {showMap ? (
                <>
                  <MapSelector
                    location={formData.pickupLocation}
                    setLocation={updatePickupLocation}
                    label="Pickup Location"
                    error={errors.pickupLocation}
                  />
                  
                  <MapSelector
                    location={formData.dropoffLocation}
                    setLocation={updateDropoffLocation}
                    label="Drop-off Location"
                    error={errors.dropoffLocation}
                  />
                  
                  {formData.pickupLocation && formData.dropoffLocation && (
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: COLORS.LIGHT_GRAY, borderColor: COLORS.BORDER }}>
                      <h3 className="font-medium mb-2" style={{ color: COLORS.NAVY }}>Route Information</h3>
                      <RouteMap pickup={formData.pickupLocation} dropoff={formData.dropoffLocation} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Pickup Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        placeholder="Enter pickup location"
                        className="w-full p-3 border rounded-lg pl-10 focus:outline-none transition"
                        style={{
                          borderColor: errors.pickupLocation ? '#ef4444' : COLORS.BORDER,
                          backgroundColor: COLORS.WHITE
                        }}
                      />
                      <MapPin className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
                      {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Drop-off Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleInputChange}
                        placeholder="Enter drop-off location"
                        className="w-full p-3 border rounded-lg pl-10 focus:outline-none transition"
                        style={{
                          borderColor: errors.dropoffLocation ? '#ef4444' : COLORS.BORDER,
                          backgroundColor: COLORS.WHITE
                        }}
                      />
                      <MapPin className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
                      {errors.dropoffLocation && <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>}
                    </div>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-sm underline focus:outline-none mb-2 transition hover:opacity-70"
                style={{ color: COLORS.RED }}
              >
                {showMap ? "Hide Map Selection" : "Use Map to Select Locations"}
              </button>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-lg pl-10 focus:outline-none transition"
                    style={{
                      borderColor: errors.email ? '#ef4444' : COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                  />
                  <Mail className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full p-3 border rounded-lg pl-10 focus:outline-none transition"
                    style={{
                      borderColor: errors.phoneNumber ? '#ef4444' : COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                  />
                  <Phone className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.NAVY }} />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Passengers</label>
                  <div className="flex items-center border rounded-lg" style={{ borderColor: COLORS.BORDER }}>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="p-3 hover:opacity-70"
                      style={{ color: COLORS.NAVY }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <span className="flex-1 text-center" style={{ color: COLORS.NAVY }}>{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(16, passengers + 1))}
                      className="p-3 hover:opacity-70"
                      style={{ color: COLORS.NAVY }}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>Luggage</label>
                  <div className="flex items-center border rounded-lg" style={{ borderColor: COLORS.BORDER }}>
                    <button
                      type="button"
                      onClick={() => setLuggage(Math.max(0, luggage - 1))}
                      className="p-3 hover:opacity-70"
                      style={{ color: COLORS.NAVY }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <span className="flex-1 text-center" style={{ color: COLORS.NAVY }}>{luggage}</span>
                    <button
                      type="button"
                      onClick={() => setLuggage(Math.min(16, luggage + 1))}
                      className="p-3 hover:opacity-70"
                      style={{ color: COLORS.NAVY }}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {submitMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                submitMessage.includes('success') ? 'text-green-700' : 'text-red-700'
              }`}
              style={{
                backgroundColor: submitMessage.includes('success') ? '#dcfce7' : '#fee2e2'
              }}>
                {submitMessage}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: COLORS.RED }}
            >
              {isLoading ? 'Processing...' : 'Proceed to Book'}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.NAVY }}>Select Vehicle</h2>
            {errors.car && <p className="text-red-500 text-sm mb-4">{errors.car}</p>}
            
            <div className="grid grid-cols-1 gap-4">
              {cars.map((car) => (
                <motion.div
                  key={car.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                  style={{
                    borderColor: selectedCar?.id === car.id ? COLORS.RED : COLORS.BORDER,
                    backgroundColor: selectedCar?.id === car.id ? COLORS.NAVY : COLORS.WHITE,
                    color: selectedCar?.id === car.id ? COLORS.WHITE : COLORS.DARK_GRAY
                  }}
                  onClick={() => setSelectedCar(car)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{car.name}</h3>
                      <p className="text-sm opacity-75">{car.transmission}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {car.seats} Seats
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {car.luggage} Luggage
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </form>

        {/* Booking History Modal for Logged-in Users */}
      </div>

      {/* Booking History Modal */}
      <BookingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
};

export default BookingPage;