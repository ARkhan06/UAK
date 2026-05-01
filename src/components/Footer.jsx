import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate, useLocation } from "react-router-dom";

const NAVY = "#0a1e3d";
const RED  = "#c8102e";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (link) => {
    if (link.href.startsWith("/")) {
      navigate(link.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link.href === "contact") {
      navigate("/contact");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

   return (
      <footer style={{ background: NAVY, padding: "72px 32px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="footer-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>UAK</span>
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1, fontFamily: "'Montserrat', sans-serif" }}>UAK Transport</div>
                  <div style={{ color: RED, fontWeight: 600, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif" }}>LLC</div>
                </div>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
                America's premier chauffeur service. Professional drivers, immaculate vehicles, and an unwavering commitment to your comfort.
              </p>
            </div>
  
            {[
              { title: "Services",  links: [
                { name: "Airport Transfers", href: "/" },
                { name: "Corporate Chauffeur", href: "/" },
                { name: "Wedding Transport", href: "/" },
                { name: "Hourly Hire", href: "/" },
                { name: "Event Shuttle", href: "/" }
              ]},
              { title: "Fleet",     links: [
                { name: "Executive Sedans", href: "/fleet" },
                { name: "Luxury SUVs", href: "/fleet" },
                { name: "Sprinter Vans", href: "/fleet" },
                { name: "VIP Limousines", href: "/fleet" },
                { name: "View All Vehicles", href: "/fleet" }
              ]},
              { title: "Company",   links: [
                { name: "About Us", href: "/" },
                { name: "Our Chauffeurs", href: "/" },
                { name: "Careers", href: "/contact" },
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" }
              ]},
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, color: RED, letterSpacing: 2.5, textTransform: "uppercase", margin: "0 0 20px" }}>{col.title}</h4>
                {col.links.map((link) => (
                  <motion.button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    whileHover={{ color: RED }}
                    style={{
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                      marginBottom: 10,
                      textDecoration: "none",
                      transition: "color 0.2s",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                      font: "inherit"
                    }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>
  
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.28)", fontSize: 12, margin: 0 }}>&copy; 2026 UAK Transport LLC. All rights reserved.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.28)", fontSize: 11 }}>24/7 Concierge Active</span>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </footer>
    );
}