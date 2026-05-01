import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import logo from '../assets/uak-logo.png'

const NAVY = "#0a1e3d";
const RED  = "#c8102e";

const NAV_LINKS = [
  { label: "Home",      href: "/", page: "/" },
  { label: "About",     href: "/", page: "/", section: "about" },
  { label: "Services",  href: "/", page: "/", section: "services" },
  { label: "Fleet",     href: "/fleet", page: "/fleet" },
  // { label: "Booking",   href: "/booking", page: "/booking" },
  { label: "Contact",   href: "/contact", page: "/contact" },
  { label: "Privacy",   href: "/privacy", page: "/privacy" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Pages that should have white background without scrolling
  const pagesWithWhiteNav = ['/booking', '/contact', '/admin', '/privacy'];
  const shouldHaveWhiteNav = pagesWithWhiteNav.includes(location.pathname);

  // Update active link based on current route
  useEffect(() => {
    const pathname = location.pathname;
    
    if (pathname === "/fleet") {
      setActive("Fleet");
    } 
    // else if (pathname === "/booking") {
    //   setActive("Booking");
    // } 
    else if (pathname === "/contact") {
      setActive("Contact");
    } else if (pathname === "/privacy") {
      setActive("Privacy");
    } else if (pathname === "/") {
      const hash = window.location.hash.substring(1);
      if (hash === "about") {
        setActive("About");
      } else if (hash === "services") {
        setActive("Services");
      } else if (hash === "contact") {
        setActive("Contact");
      } else {
        setActive("Home");
      }
    }
  }, [location]);

  // Listen for hash changes to update active state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === "about") {
        setActive("About");
      } else if (hash === "services") {
        setActive("Services");
      } else if (hash === "contact") {
        setActive("Contact");
      } else if (hash === "") {
        setActive("Home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleNavClick = (link) => {
    setMenuOpen(false);
    
    if (link.page === "/") {
      if (link.section) {
        if (location.pathname !== "/") {
          navigate("/");
          setTimeout(() => {
            const element = document.getElementById(link.section);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
            window.location.hash = link.section;
          }, 100);
        } else {
          const element = document.getElementById(link.section);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
          window.location.hash = link.section;
        }
      } else {
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.hash = "";
      }
    } else {
      navigate(link.page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    setActive(link.label);
  };

  const handleNavigation = (page) => {
    setMenuOpen(false);
    navigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  // Determine text color and background
  const textC = scrolled || shouldHaveWhiteNav ? NAVY : "#fff";
  const bgColor = scrolled || shouldHaveWhiteNav ? "rgba(255,255,255,0.97)" : "transparent";
  const borderColor = scrolled || shouldHaveWhiteNav ? "rgba(10,30,61,0.08)" : "none";
  const backdropFilterStyle = scrolled || shouldHaveWhiteNav ? "blur(12px)" : "none";

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 100,
          background: bgColor,
          backdropFilter: backdropFilterStyle,
          borderBottom: borderColor !== "none" ? `1px solid ${borderColor}` : "none",
          transition: "background 0.4s, border-color 0.4s",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          
          {/* Logo */}
          <a 
            href="/" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleNavClick({ label: "Home", page: "/" }); 
            }} 
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
          >
            <div style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img 
                src={logo} 
                alt="UAK Logo" 
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} 
              />
            </div>
            <div>
              <div style={{ color: textC, fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1, transition: "color 0.3s" }}>
                UAK Transport
              </div>
              <div style={{ color: RED, fontWeight: 600, fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>
                LLC
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <ul style={{ display: "flex", gap: 4, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }} className="nav-desktop">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a 
                  href={l.href} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(l);
                  }}
                  style={{ 
                    display: "block", 
                    padding: "8px 14px", 
                    color: active === l.label ? RED : textC, 
                    fontWeight: 600, 
                    fontSize: 11, 
                    letterSpacing: 1.5, 
                    textTransform: "uppercase", 
                    textDecoration: "none", 
                    transition: "color 0.2s", 
                    borderBottom: active === l.label ? `2px solid ${RED}` : "2px solid transparent" 
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section */}
         

          {/* Hamburger Menu */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }} 
            className="nav-hamburger"
          >
            <div style={{ width: 24, height: 2, background: textC, marginBottom: 5, transition: "transform 0.3s, opacity 0.3s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <div style={{ width: 24, height: 2, background: textC, marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }} />
            <div style={{ width: 24, height: 2, background: textC, transition: "transform 0.3s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: 0.35 }}
              style={{ overflow: "hidden", background: "#fff", borderTop: `1px solid rgba(10,30,61,0.08)` }}
            >
              <div style={{ padding: "12px 32px 20px" }}>
                {NAV_LINKS.map((l, i) => (
                  <motion.a 
                    key={l.label} 
                    href={l.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(l);
                    }}
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: i * 0.05 }}
                    style={{ 
                      display: "block", 
                      padding: "12px 0", 
                      color: NAVY, 
                      fontWeight: 600, 
                      fontSize: 12, 
                      letterSpacing: 1.5, 
                      textTransform: "uppercase", 
                      textDecoration: "none", 
                      borderBottom: `1px solid rgba(10,30,61,0.06)`,
                      cursor: "pointer"
                    }}
                  >
                    {l.label}
                  </motion.a>
                ))}

                {/* Mobile Auth Section */}
      
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop  { display: none !important; }
          .nav-hamburger{ display: block !important; }
        }
      `}</style>
    </>
  );
}