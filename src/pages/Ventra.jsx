import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Sparkles, 
  Rocket, 
  CreditCard, 
  Package, 
  BarChart3, 
  Smartphone, 
  Shield,
  ArrowUp,
  ArrowRight,
  Check
} from 'lucide-react';
import HeroImage from "../assets/5987568110577323118_121.jpg"; 

const Ventra = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Features data
  const features = [
    {
      icon: Rocket,
      title: 'Launch in Minutes',
      description: 'Create a professional website without hiring a developer or dealing with complicated setup.'
    },
    {
      icon: CreditCard,
      title: 'Accept Online Payments',
      description: 'Connect your Paystack account and start receiving payments directly from your customers with ease.'
    },
    {
      icon: Package,
      title: 'Manage Products',
      description: 'Add, edit, organize, and showcase your products through an intuitive dashboard built for business owners.'
    },
    {
      icon: BarChart3,
      title: 'Business Insights',
      description: 'Monitor orders, customers, and business performance with easy-to-understand analytics.'
    },
    {
      icon: Smartphone,
      title: 'Fully Responsive',
      description: 'Every website is optimized for desktop, tablet, and mobile devices, ensuring an exceptional experience everywhere.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with modern technologies to provide speed, security, and reliability for both you and your customers.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        id="home" 
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#020617]/40"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#D4AF37]/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-white/80 text-sm font-medium">Launching Soon</span>
                <span className="text-[#D4AF37] text-xs bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">Early Access</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                Build. Launch. Grow.
                <br />
                <span className="text-[#D4AF37]">
                  Your Business.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-xl">
                Ventra helps modern businesses create beautiful websites, accept online payments, 
                manage products, and grow their brand—all from one powerful platform.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <RouterLink to="/waitlist">
                  <button className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 flex items-center gap-2">
                    Join Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </RouterLink>
                <a href="#features">
                  <button className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-[#D4AF37]/30 flex items-center gap-2 backdrop-blur-sm">
                    Learn More
                  </button>
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Check, label: 'Launching Soon' },
                  { icon: Check, label: 'Online Payments Ready' },
                  { icon: Check, label: 'Built for Modern Businesses' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <div className="p-1.5 bg-[#D4AF37]/20 rounded-lg">
                      <stat.icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Empty */}
            <div className="hidden lg:block"></div>
          </div>
        </div>

    
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative bg-[#020617]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Build, <br />
              <span className="text-[#D4AF37]">Sell & Grow.</span>
            </h2>
            <p className="text-[#94A3B8] text-base max-w-2xl mx-auto">
              Ventra combines beautiful website design, business tools, and secure online payments 
              into one seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl w-fit mb-3 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="waitlist" className="py-20 px-6 relative overflow-hidden bg-[#020617]">
        {/* Gold Glow Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-3xl relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-white/80 text-sm font-medium">Get Started</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Your Business?
            </h2>
            
            <p className="text-[#94A3B8] text-base max-w-2xl mx-auto mb-8">
              Join the Ventra waitlist today and be among the first businesses to experience a 
              smarter way to launch and grow online.
            </p>
            
            <RouterLink to="/waitlist">
              <button className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-10 py-3 rounded-full transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 flex items-center gap-2 mx-auto">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] rounded-full shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Ventra;