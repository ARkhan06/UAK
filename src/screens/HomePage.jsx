import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import SUV from "../assets/SUV1.jfif";
import MiniVan from "../assets/MiniVan.jfif";
import Sedan from "../assets/sedan.jpg";
import Limo from "../assets/Limo.jpg";
import Van from "../assets/Van.jpg";
import Bus from "../assets/bus.jfif";
import Home1 from "../assets/Home1.jfif";
import Home2 from "../assets/Home2.jfif";
import services from "../assets/Services.jfif";

const NAVY = "#0a1e3d";
const RED  = "#c8102e";



const SERVICES = [
  {
    title: "Airport Transfers",
    desc:  "Seamless, punctual airport pickups and drop-offs with flight tracking and meet-and-greet service.",
    img:   Home2,
  },
  {
    title: "Corporate Chauffeur",
    desc:  "Dedicated executive transport for business meetings, roadshows, and corporate events nationwide.",
    img:   services,
  },
  {
    title: "Special Occasions",
    desc:  "Arrive in style for weddings, galas, anniversaries, and every milestone that deserves a grand entrance.",
    img:   Home1,
  },
];

const FEATURES = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 17H5m14 0a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2m14 0v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1m5-9V5a2 2 0 012-2h2a2 2 0 012 2v3" />
      </svg>
    ),
    title: "Premium Fleet",
    desc: "Luxury and performance vehicles",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
      </svg>
    ),
    title: "Flexible Booking",
    desc: "Daily to monthly chauffeur services",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Multiple Locations",
    desc: "Convenient pickup points nationwide",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "24/7 Support",
    desc: "Always here to help",
  },
];

const FLEET = [
  { name: "Mercedes-Benz S-Class", category: "Executive Sedan", img: Sedan, seats: 3 },
  { name: "Cadillac Escalade",     category: "Luxury SUV",      img: SUV, seats: 6 },
  { name: "Lincoln Navigator",     category: "Premium SUV",     img: SUV, seats: 6 },
  { name: "Mercedes Sprinter",     category: "Executive Van",   img: Van, seats: 12 },
];

const OCCASIONS = [
  { name: "Corporate",  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
  { name: "Weddings",   img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
  { name: "Airport",    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80" },
  { name: "Events",     img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
];

const TESTIMONIALS = [
  { name: "Michael Torres", role: "CEO, Meridian Capital",        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80", text: "UAK Transport has been our go-to chauffeur service for three years. Immaculate vehicles, professional drivers — never a single delay." },
  { name: "Sarah Johnson",  role: "VP of Operations, Nexus Group", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80", text: "From airport pickups to executive roadshows, their team handles every detail flawlessly. Truly a world-class experience." },
  { name: "David Kim",      role: "Director, Pacific Ventures",    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80", text: "We prioritize your needs is not just their tagline — it is exactly how they operate. Outstanding professionalism on every ride." },
];


// ─── Label ────────────────────────────────────────────────────────────────────
function Label({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 2, background: RED }} />
      <span style={{ color: RED, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif" }}>{text}</span>
    </div>
  );
}

// ─── Hero (exactly one screen tall) ──────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

  return (
    <section ref={ref} id="home" style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: 0, y }}>
        <img src={SUV} alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, ${NAVY}f2 0%, ${NAVY}88 55%, rgba(200,16,46,0.3) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,30,61,0.9) 0%, transparent 55%)" }} />
      </motion.div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 32px", width: "100%" , marginTop:'50px'}}>
        <motion.div initial={{ opacity: 0, x: -24 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3, duration: 0.6 }}>
          <Label text="We Prioritize Your Needs" />
        </motion.div>

        <div style={{ maxWidth: 740 }}>
          {["Premium", "Chauffeur", "Services"].map((word, i) => (
            <motion.div key={word}
              initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 6vw, 5.8rem)", lineHeight: 1, color: i === 1 ? RED : "#fff", letterSpacing: "-2px", textTransform: "uppercase" }}>
              {word}
            </motion.div>
          ))}

          <motion.p initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.85, duration: 0.6 }}
            style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.8, maxWidth: 520, marginTop: 20, marginBottom: 36 }}>
            UAK Transport LLC delivers world-class chauffeur services across all 50 states — airport transfers, corporate rides, and special occasions handled with discretion and precision.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.0, duration: 0.5 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="/fleet"
              whileHover={{ scale: 1.05, boxShadow: "0 16px 48px rgba(200,16,46,0.45)" }}
              whileTap={{ scale: 0.97 }}
              style={{ background: RED, color: "#fff", padding: "14px 32px", borderRadius: 50, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              Explore Fleet
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </motion.a>
            <motion.a href="/contact"
              whileHover={{ borderColor: "rgba(255,255,255,0.9)" }}
              style={{ background: "transparent", color: "#fff", padding: "14px 32px", borderRadius: 50, border: "2px solid rgba(255,255,255,0.35)", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", transition: "border-color 0.2s" }}>
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </div>

      
    </section>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────
function FeatureCards() {
  return (
    <section style={{ background: "#fff", padding: "0 32px" , marginTop : "80px"}}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", transform: "translateY(-40px)", boxShadow: "0 20px 60px rgba(10,30,61,0.1)", borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid rgba(10,30,61,0.08)" }} className="feature-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.55 }}
              whileHover={{ background: NAVY }}
              style={{ padding: "36px 28px", borderRight: i < 3 ? `1px solid rgba(10,30,61,0.08)` : "none", cursor: "default", transition: "background 0.3s", display: "flex", flexDirection: "column", gap: 14 }}
              className="feat-card">
              <div style={{ color: NAVY, transition: "color 0.3s" }} className="feat-icon">{f.icon}</div>
              <div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 13, color: NAVY, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5, transition: "color 0.3s" }} className="feat-title">{f.title}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: 13, margin: 0, transition: "color 0.3s" }} className="feat-desc">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .feat-card:hover .feat-icon  { color: #fff !important; }
        .feat-card:hover .feat-title { color: #fff !important; }
        .feat-card:hover .feat-desc  { color: rgba(255,255,255,0.6) !important; }
        @media (max-width: 768px) { .feature-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .feature-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ padding: "60px 32px 10px", background: "#f8f9fb" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end", marginBottom: 60 }} className="srv-header">
          <div>
            <Label text="Our Services" />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.6rem)", color: NAVY, lineHeight: 1.05, textTransform: "uppercase", margin: 0 }}>
              Refined Chauffeur <span style={{ color: RED }}>Experiences</span>
            </h2>
          </div>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: 15, lineHeight: 1.8, margin: "0 0 20px" }}>
              Every journey is tailored to your schedule and expectations. Our professional chauffeurs ensure your comfort from the first mile to the last.
            </p>
            <a href="/fleet" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: RED, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
              View Full Fleet
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="srv-grid">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title}
              initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              style={{ borderRadius: 20, overflow: "hidden", position: "relative", cursor: "pointer", height: 380 }}>
              <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s", display: "block" }} className="srv-img" />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${NAVY}f0 0%, ${NAVY}33 55%, transparent 100%)` }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px" }}>
                <div style={{ width: 32, height: 2, background: RED, marginBottom: 12 }} />
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", textTransform: "uppercase", margin: "0 0 8px", letterSpacing: 0.5 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
              <div style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s" }} className="srv-arrow">
                <svg width="13" height="13" fill="none" stroke={NAVY} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M7 7h10v10" /></svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        *:hover .srv-img   { transform: scale(1.06); }
        *:hover .srv-arrow { opacity: 1 !important; }
        @media (max-width: 900px) { .srv-grid { grid-template-columns: 1fr !important; } .srv-header { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "100px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
        <div style={{ position: "relative", height: 500 }}>
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", top: 0, left: 0, width: "72%", height: "72%", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(10,30,61,0.15)" }}>
            <img src={Van} alt="Chauffeur" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.18 }}
            style={{ position: "absolute", bottom: 0, right: 0, width: "60%", height: "60%", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(10,30,61,0.18)", border: "4px solid #fff" }}>
            <img src={SUV} alt="Executive Car" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
         
        </div>

        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Label text="About UAK Transport LLC" />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3.2vw, 3rem)", color: NAVY, lineHeight: 1.1, textTransform: "uppercase", margin: "0 0 20px" }}>
              Your Trusted Chauffeur <span style={{ color: RED }}>Partner</span> Nationwide
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
              Founded on the belief that every passenger deserves an extraordinary experience, UAK Transport LLC has become America's most trusted name in professional chauffeur services. We combine meticulous attention to detail with an unwavering commitment to punctuality.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              Our licensed chauffeurs undergo rigorous training, background checks, and ongoing service evaluations — ensuring your safety, privacy, and comfort on every journey.
            </p>
          </motion.div>

          {["Fully Licensed & Insured Nationwide", "Real-Time Flight & Traffic Monitoring", "Discreet, Professional Chauffeurs", "24/7 Concierge Dispatch Support"].map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: NAVY, fontWeight: 500 }}>{item}</span>
            </motion.div>
          ))}

          <motion.a href="/booking" whileHover={{ scale: 1.04 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", padding: "14px 32px", borderRadius: 50, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", marginTop: 28 }}>
            Book a Chauffeur
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.a>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}


// ─── Occasions ────────────────────────────────────────────────────────────────
function Occasions() {
  return (
    <section style={{ padding: "100px 32px", background: NAVY }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 2, background: RED }} />
            <span style={{ color: RED, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif" }}>Occasions We Serve</span>
            <div style={{ width: 28, height: 2, background: RED }} />
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3.6rem)", color: "#fff", textTransform: "uppercase", margin: 0, lineHeight: 1.05 }}>
            Every Journey, <span style={{ color: RED }}>Perfected</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="occ-grid">
          {OCCASIONS.map((ind, i) => (
            <motion.div key={ind.name}
              initial={{ scale: 0.88, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
              style={{ borderRadius: 18, overflow: "hidden", position: "relative", height: 240, cursor: "pointer" }}>
              <img src={ind.img} alt={ind.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s", display: "block" }} className="occ-img" />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${NAVY}f0 0%, transparent 60%)` }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, padding: "20px" }}>
                <div style={{ width: 24, height: 2, background: RED, marginBottom: 8 }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 13, color: "#fff", textTransform: "uppercase", letterSpacing: 2, margin: 0 }}>{ind.name}</p>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s" }} className="occ-arrow">
                <svg width="11" height="11" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M7 7h10v10" /></svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        *:hover .occ-img   { transform: scale(1.07); }
        *:hover .occ-arrow { opacity: 1 !important; }
        @media (max-width: 768px) { .occ-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .occ-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}





// ─── Root ─────────────────────────────────────────────────────────────────────
export default function UAKHomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
      `}</style>
      
      <Hero />
      <FeatureCards />
      <Services />
      <About />
      <Occasions />
      
    </>
  );
}