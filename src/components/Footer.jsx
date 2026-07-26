import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from "../assets/ventra-logo.png";

const Footer = () => {
  // SVG Icon components
  const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );

  const TiktokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.11-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const socialLinks = [
    { icon: TwitterIcon, label: 'Twitter', href: '#' },
    { icon: InstagramIcon, label: 'Instagram', href: '#' },
    { icon: TiktokIcon, label: 'TikTok', href: '#' },
    { icon: FacebookIcon, label: 'Facebook', href: '#' },
  ];

  const productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#' },
    { name: 'Waitlist', href: '/waitlist' },
  ];

  const companyLinks = [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Careers (Coming Soon)', href: '#', className: 'opacity-60' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const socialVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  const renderLink = (link) => {
    if (link.href.startsWith('#')) {
      return (
        <a 
          href={link.href}
          className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-300"
        >
          {link.name}
        </a>
      );
    }
    return (
      <RouterLink
        to={link.href}
        className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-300"
      >
        {link.name}
      </RouterLink>
    );
  };

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="bg-[#020617] border-t border-white/5 py-16 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Left Section - Brand */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="mb-4">
              <RouterLink to="/">
                <img 
                  src={Logo} 
                  alt="Ventra Logo" 
                  className="h-16 w-auto object-contain"
                />
              </RouterLink>
            </div>
            <p className="text-[#94A3B8] max-w-sm leading-relaxed">
              Helping businesses build, launch, and grow online.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Launching soon • Early access</span>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className={`text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-300 ${link.className || ''}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-lg mb-4">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  variants={socialVariants}
                  whileHover="hover"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 text-[#94A3B8] hover:text-[#D4AF37]"
                  aria-label={social.label}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <span className="text-[#94A3B8] text-sm">
            © 2026 Ventra. All rights reserved.
          </span>
          
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;