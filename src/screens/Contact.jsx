import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, User, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.phone.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your phone number' });
      return false;
    }
    if (!formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter a message' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Send email using EmailJS
      const response = await emailjs.send(
        'service_yy61nk5',
        'template_nqibspk',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
          to_email: 'info@uaktransport.com',
          reply_to: formData.email
        },
        'qBPXNATj43GZ-yrPw'
      );

      console.log('Email sent successfully:', response);

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you within 24 hours.'
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Auto-dismiss success message after 6 seconds
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 6000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: 'error',
        message: `Failed to send message: ${error.text || error.message}. Please try again or contact us at info@uaktransport.com`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (224) 464-9443"]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@uaktransport.com"]
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
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="md:w-7/12 p-8 md:p-12" style={{ backgroundColor: COLORS.WHITE }}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: COLORS.NAVY }}>
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none focus:ring-2 transition"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE,
                      '--tw-ring-color': COLORS.RED
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
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none focus:ring-2 transition"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE,
                      '--tw-ring-color': COLORS.RED
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
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none focus:ring-2 transition"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE,
                      '--tw-ring-color': COLORS.RED
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
                    className="w-full p-4 border rounded-lg pl-12 focus:outline-none focus:ring-2 transition resize-none"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.WHITE,
                      '--tw-ring-color': COLORS.RED
                    }}
                    placeholder="Your message here..."
                  />
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5" style={{ color: COLORS.NAVY }} />
                </div>
              </div>

              {submitStatus.message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg font-medium text-sm ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                  {submitStatus.message}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:shadow-lg"
                style={{ backgroundColor: COLORS.RED }}
              >
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
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