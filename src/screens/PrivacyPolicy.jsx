import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Phone, Mail, Calendar, CheckCircle, AlertTriangle, Globe } from 'lucide-react';

const NAVY = "#0a1e3d";
const RED = "#c8102e";

const PrivacyPolicyPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number)",
        "Billing address and payment information for service reservations",
        "Pick-up and drop-off locations for transportation services",
        "Special requests and preferences for your transportation needs",
        "Communication records and service history",
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and coordinate vehicle transportation services",
        "To process payments and manage your reservations",
        "To communicate with you about your service requests and updates",
        "To improve our services and customer experience",
        "To comply with legal and regulatory requirements",
        "To ensure safety and security of our services"
      ]
    },
    {
      icon: Shield,
      title: "Information Sharing and Disclosure",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Information may be shared with our drivers to provide services",
        "We may share information with payment processors for secure transactions",
        "Data may be shared with insurance companies for coverage purposes",
        "Information may be disclosed if required by law or legal process",
        "In case of business transfer, customer information may be transferred with proper notice"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "All information is encrypted using secure SSL technology",
        "Access to personal information is restricted to authorized personnel only",
        "Regular security audits and updates to our systems",
        "Secure data storage with backup and recovery procedures",
      ]
    }
  ];

  const rightsData = [
    { icon: Eye, title: "Access Your Data", description: "Request access to your personal information we have on file" },
    { icon: FileText, title: "Correct Information", description: "Request correction of any inaccurate or incomplete data" },
    { icon: AlertTriangle, title: "Delete Your Data", description: "Request deletion of your personal information from our systems" },
    { icon: Globe, title: "Data Portability", description: "Request transfer of your data in a portable format" }
  ];

  const contactMethods = [
    { icon: Mail, label: "Email", value: "info@uaktransport.com" },
    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" }
  ];

  const smsOptInMethods = [
    "Verbally during a conversation with our team",
    "Through consent forms on our website",
    "During the booking process for transportation services"
  ];

  const smsOptOutMethods = [
    "Reply \"STOP\" to any SMS message you receive",
    "Contact us directly to request removal from our messaging list",
    "Choose not to check the SMS consent box on our forms"
  ];

  const smsHelpOptions = [
    "Reply \"HELP\" to any SMS message for immediate assistance",
    "Contact our dispatch team directly at +1 (555) 123-4567",
    "Visit our Privacy Policy page at https://uaktransport.com/privacy"
  ];

  const smsTypesOfCommunications = [
    { title: "Reservation Confirmations & Updates", description: "Booking confirmations, itinerary changes, and service reminders" },
    { title: "Driver Dispatch Notifications", description: "Real-time driver arrival updates, delays, and trip status" },
    { title: "Trip Reminders", description: "Pre-trip reminders and itinerary change notifications" },
    { title: "Customer Support Communications", description: "Service inquiries, issues resolution, and account support" },
    { title: "Billing & Payment Notifications", description: "Invoice confirmations, payment reminders, and receipt delivery" },
    { title: "Service-Specific Updates", description: "Pickup instructions, meet-and-greet coordination, and special protocol updates" }
  ];

  const smsTerms = [
    {
      num: "1",
      title: "Consent to Receive Messages",
      content: "Users may opt in to receive SMS messages verbally during a conversation. By opting in, you consent to receive SMS/text messages from UAK Transport related to reservation confirmations and updates, driver dispatch notifications (arrival, delays, trip status), trip reminders and itinerary changes, customer support communications, and billing and payment notifications. Mobile opt in. SMS consent and phone numbers collected for SMS communication purposes will not be shared with any third party or affiliates for marketing purposes."
    },
    {
      num: "2",
      title: "Message Frequency",
      content: "Message frequency varies depending on your bookings, account activity, and service usage. Clients with active reservations may receive multiple updates per trip. You may receive up to 2 SMS messages per week regarding your appointments or account status, though this may vary based on your service needs."
    },
    {
      num: "3",
      title: "Message & Data Rates",
      content: "Standard message and data rates may apply based on your wireless carrier plan. These fees may vary if messages are sent domestically or internationally. UAK Transport is not responsible for any carrier charges. Please contact your wireless carrier for information about your specific messaging plan and applicable rates."
    },
    {
      num: "4",
      title: "Opt-Out Instructions",
      content: "You may opt out at any time by replying \"STOP\" to any message. Once opted out, you will no longer receive SMS communications unless you opt in again. You can also contact us directly at +1 (555) 123-4567 to request removal from our messaging list, or choose not to check the SMS consent box on our forms."
    },
    {
      num: "5",
      title: "Help & Support",
      content: "For assistance, reply \"HELP\" to any SMS message or contact our dispatch team directly at +1 (555) 123-4567. You can also visit our Privacy Policy page at https://uaktransport.com/privacy for additional support options and information."
    },
    {
      num: "6",
      title: "Privacy & Data Protection",
      content: "Your phone number and SMS consent will never be shared, sold, or distributed to third parties or affiliates for marketing purposes. Information is used strictly for service-related communication in accordance with our Privacy Policy. We maintain the highest standards of data security and confidentiality for all SMS communications."
    },
    {
      num: "7",
      title: "Service-Specific Communications",
      content: "As a professional transportation provider serving corporate and private clients, SMS communications may include real-time driver status updates, pickup instructions and meet-and-greet coordination, business trip coordination, and special protocol-related trip updates."
    },
    {
      num: "8",
      title: "Delivery Disclaimer",
      content: "SMS delivery is subject to carrier network availability. UAK Transport is not responsible for delayed or undelivered messages. Please ensure your phone number is current and that you have active service to receive messages."
    },
    {
      num: "9",
      title: "Eligibility",
      content: "By subscribing, you confirm you are the account holder or have authorization from the account holder to receive messages. You must be 18 years of age or older to opt in to SMS communications from UAK Transport."
    },
    {
      num: "10",
      title: "Changes to Terms",
      content: "UAK Transport reserves the right to modify these SMS Terms at any time. Updates will be posted on our website at https://uaktransport.com/privacy. Your continued use of our services following any changes constitutes acceptance of the updated terms."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        {...fadeInUp}
        className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: NAVY }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: RED }}></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: RED }}></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="p-4 rounded-full" style={{ backgroundColor: RED }}>
              <Shield className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl sm:text-7xl font-bold text-white text-center mb-6"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="h-1 w-24 rounded-full" style={{ backgroundColor: RED }}></div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-center text-white opacity-95 max-w-3xl mx-auto leading-relaxed"
          >
            At UAK Transport, we are committed to protecting your privacy and ensuring that your personal information is handled with the utmost care and security. Your trust is our priority.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div 
          {...fadeInUp}
          className="relative mb-16 p-10 sm:p-12 rounded-xl overflow-hidden"
          style={{ backgroundColor: "#f8f9fa", borderTop: `4px solid ${RED}` }}
        >
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-5 rounded-full" style={{ backgroundColor: NAVY }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: RED }}></div>
              <h2 className="text-4xl font-bold" style={{ color: NAVY }}>Welcome to UAK Transport</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              This Privacy Policy outlines how we collect, use, and protect your information when you use our premium vehicle services. By using our services, you agree to the collection and use of information in accordance with this policy. We are committed to maintaining the highest standards of data protection and transparency in all our operations.
            </p>
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-lg p-8 border-l-4 hover:shadow-lg transition-shadow"
              style={{ borderColor: index % 2 === 0 ? NAVY : RED }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: index % 2 === 0 ? NAVY : RED }}
                >
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <h3 
                  className="text-2xl font-bold"
                  style={{ color: index % 2 === 0 ? NAVY : RED }}
                >
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle 
                      className="h-5 w-5 flex-shrink-0 mt-0.5"
                      style={{ color: index % 2 === 0 ? NAVY : RED }}
                    />
                    <span className="text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Your Rights Section */}
        <motion.div 
          {...fadeInUp}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: RED }}>
            Your Privacy Rights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rightsData.map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 border-t-4 hover:shadow-lg transition-shadow"
                style={{ borderColor: index % 2 === 0 ? RED : NAVY }}
              >
                <div 
                  className="inline-block p-3 rounded-lg mb-4"
                  style={{ backgroundColor: index % 2 === 0 ? RED : NAVY }}
                >
                  <right.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg" style={{ color: NAVY }}>{right.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cookies & Tracking */}
        <motion.div 
          {...fadeInUp}
          className="bg-white rounded-lg p-8 mb-16 border-l-4"
          style={{ borderColor: NAVY }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: RED }}>
            <Globe className="h-7 w-7" />
            Cookies and Tracking Technologies
          </h3>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              "Remember your preferences and settings",
              "Analyze website traffic and user behavior", 
              "Provide personalized content and advertisements",
              "Improve our services and website functionality"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: NAVY }} />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-6 text-white" style={{ backgroundColor: NAVY }}>
            <p className="text-base">
              <strong>Note:</strong> You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our website.
            </p>
          </div>
        </motion.div>

        {/* Data Retention */}
        <motion.div 
          {...fadeInUp}
          className="bg-white rounded-lg p-8 mb-16 border-r-4"
          style={{ borderColor: RED }}
        >
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: NAVY }}>
            <Calendar className="h-7 w-7" />
            Data Retention
          </h3>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Service Records", desc: "Maintained for 7 years for business and tax purposes", color: NAVY },
              { title: "Payment Information", desc: "Processed securely and not stored on our servers", color: RED },
              { title: "Marketing Data", desc: "Retained until you opt-out or request deletion", color: NAVY },
              { title: "Website Analytics", desc: "Anonymized data retained for 26 months", color: RED }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg p-6 text-white border-l-4"
                style={{ backgroundColor: item.color, borderColor: item.color }}
              >
                <h4 className="font-bold mb-2 text-lg">{item.title}</h4>
                <p className="text-base opacity-90">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SMS/Text Messaging Terms */}
        <motion.div 
          {...fadeInUp}
          className="mb-16"
        >
          <div className="bg-white rounded-lg p-8 border-l-4" style={{ borderColor: NAVY }}>
            <h3 className="text-2xl font-bold mb-10 flex items-center gap-3" style={{ color: RED }}>
              <Phone className="h-7 w-7" />
              SMS/Text Messaging Terms & Conditions
            </h3>
            
            <div className="space-y-8 mb-10 pb-10 border-b-2 border-gray-200">
              {smsTerms.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4"
                >
                  <div 
                    className="flex items-center justify-center h-10 w-10 rounded-lg text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: index % 2 === 0 ? NAVY : RED }}
                  >
                    {item.num}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2 text-lg" style={{ color: NAVY }}>{item.title}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Types of SMS Communications */}
            <div className="mb-10">
              <h4 className="text-xl font-bold mb-6" style={{ color: RED }}>Types of SMS Communications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smsTypesOfCommunications.map((type, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg p-4 text-white border-l-4"
                    style={{ backgroundColor: index % 2 === 0 ? NAVY : RED, borderColor: index % 2 === 0 ? RED : NAVY }}
                  >
                    <h5 className="font-bold mb-2 text-sm">{type.title}</h5>
                    <p className="text-xs opacity-90">{type.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SMS Opt-In Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                  <CheckCircle className="h-5 w-5" style={{ color: RED }} />
                  Opt-In Methods
                </h4>
                <ul className="space-y-2">
                  {smsOptInMethods.map((method, index) => (
                    <li key={index} className="text-gray-700 text-sm">• {method}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: RED }} />
                  Opt-Out Methods
                </h4>
                <ul className="space-y-2">
                  {smsOptOutMethods.map((method, index) => (
                    <li key={index} className="text-gray-700 text-sm">• {method}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                  <Phone className="h-5 w-5" style={{ color: RED }} />
                  Get Help
                </h4>
                <ul className="space-y-2">
                  {smsHelpOptions.map((option, index) => (
                    <li key={index} className="text-gray-700 text-sm">• {option}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SMS Consent Reminder */}
            <div className="rounded-lg p-6 text-white" style={{ backgroundColor: RED }}>
              <p className="text-base">
                <strong>Important:</strong> SMS consent and phone numbers collected for SMS communication purposes will not be shared with any third party or affiliates for marketing purposes. Your data is protected in accordance with our comprehensive Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          {...fadeInUp}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: NAVY }}>
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg p-8 text-white text-center"
                style={{ backgroundColor: index % 2 === 0 ? NAVY : RED }}
              >
                <div className="mb-4 flex justify-center">
                  <method.icon className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-3 text-xl">{method.label}</h4>
                <p className="text-lg break-all opacity-95">{method.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Policy Updates */}
        <motion.div 
          {...fadeInUp}
          className="rounded-lg p-10 text-center text-white border-t-4"
          style={{ backgroundColor: NAVY, borderColor: RED }}
        >
          <AlertTriangle className="h-10 w-10 mx-auto mb-4" style={{ color: RED }} />
          <h3 className="text-3xl font-bold mb-4">Policy Updates</h3>
          <p className="text-lg leading-relaxed max-w-4xl mx-auto opacity-95">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website. Your continued use of our services following any changes constitutes acceptance of the updated terms.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;