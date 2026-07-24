import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import Logo from "../assets/5987568110577323119_121-removebg-preview.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: isHomePage ? '#features' : '/#features' },
    { name: 'Pricing', href: '#' },
    { name: 'Waitlist', href: '/waitlist' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        duration: 0.6 
      }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const linkVariants = {
    hover: { 
      color: '#D4AF37',
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const renderLink = (link) => {
    if (link.href.startsWith('#')) {
      return (
        <ScrollLink
          to={link.href.substring(1)}
          smooth={true}
          duration={500}
          onClick={handleLinkClick}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 text-[#94A3B8] hover:text-white cursor-pointer"
          activeClass="text-[#D4AF37] bg-white/10"
          spy={true}
          offset={-80}
        >
          {link.name}
        </ScrollLink>
      );
    }
    return (
      <RouterLink
        to={link.href}
        onClick={handleLinkClick}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 text-[#94A3B8] hover:text-white"
      >
        {link.name}
      </RouterLink>
    );
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <RouterLink to="/">
              <img 
                src={Logo} 
                alt="Ventra Logo" 
                className="h-14 w-auto object-contain"
              />
            </RouterLink>
          </motion.div>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/10">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                variants={linkVariants}
                whileHover="hover"
              >
                {renderLink(link)}
              </motion.div>
            ))}
          </div>

          {/* Right Side - Desktop */}
          <motion.div 
            className="hidden md:block"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <RouterLink to="/waitlist">
              <button className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-105 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Join Waitlist
              </button>
            </RouterLink>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden overflow-hidden mt-4 bg-[#020617]/95 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <div className="flex flex-col p-6 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.href.startsWith('#') ? (
                      <ScrollLink
                        to={link.href.substring(1)}
                        smooth={true}
                        duration={500}
                        onClick={handleLinkClick}
                        className="block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 text-[#94A3B8] hover:text-white hover:bg-white/5"
                      >
                        {link.name}
                      </ScrollLink>
                    ) : (
                      <RouterLink
                        to={link.href}
                        onClick={handleLinkClick}
                        className="block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 text-[#94A3B8] hover:text-white hover:bg-white/5"
                      >
                        {link.name}
                      </RouterLink>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <RouterLink to="/waitlist" onClick={handleLinkClick}>
                    <button className="w-full bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Join Waitlist
                    </button>
                  </RouterLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;