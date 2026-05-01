import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, User, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from '../components/Navbar';


// Colors
const COLORS = {
  NAVY: "#0a1e3d",
  RED: "#c8102e",
  WHITE: "#ffffff",
  LIGHT_GRAY: "#f8f9fa",
  DARK_GRAY: "#2d3748",
  BORDER: "#e2e8f0"
};

// Initialize Email.js
emailjs.init('qBPXNATj43GZ-yrPw');

const Contact = () => {
  const form = useRef();
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Check if reCAPTCHA script is loaded properly
  useEffect(() => {
    const checkRecaptchaLoaded = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        setRecaptchaLoaded(true);
      }
    };

    checkRecaptchaLoaded();
    const intervalId = setInterval(checkRecaptchaLoaded, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecaptchaChange = (value) => {
    setCaptchaValue(value);
    console.log("reCAPTCHA value:", value);
  };

  const handleRecaptchaError = () => {
    console.error("reCAPTCHA failed to load or encountered an error");
    setSubmitStatus({ 
      type: 'error', 
      message: 'There was a problem loading the reCAPTCHA. Please refresh the page and try again.'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaValue) {
      setSubmitStatus({ type: 'error', message: 'Please complete the reCAPTCHA verification' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const formElement = form.current;
      const captchaInput = document.createElement('input');
      captchaInput.type = 'hidden';
      captchaInput.name = 'g-recaptcha-response';
      captchaInput.value = captchaValue;
      formElement.appendChild(captchaInput);

      await emailjs.sendForm(
        'service_yy61nk5',
        'template_nqibspk',
        formElement,
        'qBPXNATj43GZ-yrPw'
      );

      formElement.removeChild(captchaInput);

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you soon.'
      });
      
      setFormData({ name: '', email: '', phone: '', message: '' });
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaValue(null);

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@uaktransport.com", "support@uaktransport.com"]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["123 Luxury Lane", "Premium City, ST 12345"]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.LIGHT_GRAY }}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.NAVY }}>
            Get in Touch
          </h1>
          <p className="text-lg" style={{ color: COLORS.DARK_GRAY }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row mb-16"
        >
          {/* Left Side - Contact Information */}
          <div className="md:w-5/12 p-8 md:p-12 text-white" style={{ backgroundColor: COLORS.NAVY }}>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Contact Information</h2>
                <p className="text-gray-300 mb-8">
                  Fill up the form and we will get back to you within 24 hours.
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: `${COLORS.RED}20` }}>
                    <div style={{ color: COLORS.RED }}>
                      {info.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-300">{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Social Media */}
              <div className="pt-8 mt-8" style={{ borderTop: `1px solid rgba(255, 255, 255, 0.2)` }}>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full transition-colors"
                    style={{ backgroundColor: `${COLORS.RED}20`, color: COLORS.RED }}
                  >
                    <Facebook className="w-5 h-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full transition-colors"
                    style={{ backgroundColor: `${COLORS.RED}20`, color: COLORS.RED }}
                  >
                    <Twitter className="w-5 h-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full transition-colors"
                    style={{ backgroundColor: `${COLORS.RED}20`, color: COLORS.RED }}
                  >
                    <Instagram className="w-5 h-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full transition-colors"
                    style={{ backgroundColor: `${COLORS.RED}20`, color: COLORS.RED }}
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="md:w-7/12 p-8 md:p-12" style={{ backgroundColor: COLORS.WHITE }}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: COLORS.NAVY }}>
              Send us a Message
            </h2>
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none transition"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE,
                      boxShadow: 'focus:ring-2'
                    }}
                    placeholder="John Doe"
                  />
                  <User className="absolute left-4 top-4 w-5 h-5" style={{ color: COLORS.NAVY }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none transition"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                    placeholder="john@example.com"
                  />
                  <Mail className="absolute left-4 top-4 w-5 h-5" style={{ color: COLORS.NAVY }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none transition"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                  <Phone className="absolute left-4 top-4 w-5 h-5" style={{ color: COLORS.NAVY }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.NAVY }}>
                  Message
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none transition resize-none"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE
                    }}
                    placeholder="Your message here..."
                  />
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5" style={{ color: COLORS.NAVY }} />
                </div>
              </div>

              <div className="recaptcha-container flex justify-center">
                {!recaptchaLoaded && (
                  <p className="text-amber-600 text-sm mb-2">
                    Loading reCAPTCHA verification...
                  </p>
                )}
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="YOUR_RECAPTCHA_SITE_KEY" 
                  onChange={handleRecaptchaChange}
                  onError={handleRecaptchaError}
                  onExpired={() => setCaptchaValue(null)}
                />
              </div>

              {submitStatus.message && (
                <div className={`p-4 rounded-lg font-medium ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || !captchaValue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                style={{ backgroundColor: COLORS.RED }}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Contact;