import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShield,
  FiStar,
  FiZap,
  FiSearch
} from "react-icons/fi";

const backgroundImages = [
  "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  "https://plus.unsplash.com/premium_photo-1664475347754-f633cb166d13?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  "https://plus.unsplash.com/premium_photo-1683984171269-04c84ee23234?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500"
];

const HeroSection = ({ loading = false }) => {
  const [bgIndex, setBgIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-green-800">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={backgroundImages[bgIndex]}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-lime-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8 animate-pulse">
              <div className="w-56 h-10 bg-white/20 rounded-full" />
              <div className="space-y-4">
                <div className="w-4/5 h-14 lg:h-20 bg-white/25 rounded-2xl" />
                <div className="w-3/5 h-12 lg:h-16 bg-white/20 rounded-2xl" />
                <div className="w-2/5 h-10 bg-white/15 rounded-xl" />
              </div>
              <div className="space-y-3 max-w-xl">
                <div className="w-full h-5 bg-white/15 rounded-lg" />
                <div className="w-5/6 h-5 bg-white/10 rounded-lg" />
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <div className="w-48 h-14 bg-white/25 rounded-2xl" />
                <div className="w-40 h-14 bg-white/15 rounded-2xl" />
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="w-32 h-6 bg-white/15 rounded-lg" />
                <div className="w-px h-6 bg-white/20" />
                <div className="w-40 h-6 bg-white/15 rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column */}
          <div className="text-left space-y-8">

            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white">
                  50,000+ Happy Customers
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Find the
                <span className="block bg-gradient-to-r from-green-300 via-lime-400 to-yellow-400 bg-clip-text text-transparent">
                  Best Products
                </span>
                <span className="block text-4xl lg:text-5xl text-green-100">
                  at the Best Prices
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-green-100 max-w-xl leading-relaxed"
            >
              Compare products from hundreds of verified vendors and make smarter purchasing decisions with confidence.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
            >
              <Link
                to="/products"
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <FiSearch className="w-6 h-6" />
                <span>Start Shopping</span>
                <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                to="/compare"
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-lg rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-200"
              >
                <FiZap className="w-6 h-6" />
                <span>Compare Now</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8">
              <div className="flex items-center space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">4.8/5</span>
                </div>
                <div className="h-6 w-px bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <FiShield className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">Secure & Trusted</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
        )}
      </motion.div>

      {/* Indicators */}
      {!loading && (
        <>
          <div className="absolute bottom-11 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center space-x-3">
              {backgroundImages.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === bgIndex
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/40 hover:bg-white/60'
                    }`}
                  onClick={() => setBgIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 right-8 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center space-y-2 text-white/60">
              <span className="text-sm font-medium">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-4 h-4 bg-lime-400/60 rounded-full"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-6 h-6 bg-green-400/40 rounded-full"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-emerald-400/50 rounded-full"
          animate={{
            x: [0, 20, 0],
            y: [0, -25, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  loading: PropTypes.bool,
};

export default HeroSection;
