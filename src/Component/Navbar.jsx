"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Home, Users, List, Shield, Phone } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname)
  }, [location.pathname])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about-us", icon: Users },
    { name: "Prices", path: "/price-list", icon: List },
    { name: "Safety", path: "/safety-tips", icon: Shield },
    { name: "Contact", path: "/contact-us", icon: Phone },
  ]

  const handleNavigation = (path) => {
    navigate(path, { replace: true })
    window.scrollTo(0, 0)
    setActiveTab(path)
  }

  return (
    <>
      {/* Top Navbar - Sketch Style */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-4 border-black border-dashed shadow-2xl transform rotate-1 px-6 py-4 relative"
        >
          {/* Sketch-style inner border */}
          <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

          <div className="flex items-center justify-between relative z-10">
            {/* Logo - Sketch Style */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 cursor-pointer transform -rotate-1"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-10 h-10 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white transform -rotate-45" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-black transform rotate-1">
                  <span className="hidden sm:inline">Maruti Crackers</span>
                  <span className="inline sm:hidden">Maruti</span>
                </h1>
                <p className="text-xs text-red-500 font-bold hidden md:block transform -rotate-1">Premium Fireworks</p>
              </div>
            </motion.div>

            {/* Desktop Navigation - Sketch Style */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavigation(item.path)}
                  whileHover={{ scale: 1.05, rotate: activeTab === item.path ? 0 : 2 }}
                  className={`relative px-4 py-2 font-black transition-all duration-300 border-2 border-black transform h-10 flex items-center justify-center ${
                    activeTab === item.path
                      ? "text-white bg-red-500 rotate-2 shadow-lg"
                      : "text-black bg-white hover:text-red-500 hover:bg-red-50 rotate-1 hover:-rotate-1"
                  }`}
                >
                  {item.name}
                  {activeTab === item.path && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-black transform rotate-45"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Order Now Button - Sketch Style */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5 }}
              onClick={() => handleNavigation("/price-list")}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-4 py-2 md:px-6 md:py-2.5 transform -rotate-2 hover:rotate-2 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Order Now</span>
              <span className="inline sm:hidden">Order</span>
            </motion.button>
          </div>
        </motion.div>
      </nav>

      {/* Bottom Navigation - Sketch Style with Clocked Active Item */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden hundred:hidden onefifty:hidden mobile:block max-w-md w-full px-5"
      >
        <div className="bg-white border-4 border-black border-dashed shadow-2xl transform rotate-1 p-3 flex justify-around items-center relative">
          {/* Sketch-style inner border */}
          <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-30"></div>

          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.path

            return (
              <div key={item.name} className="relative flex-1">
                {isActive ? (
                  // Active item - Clocked, separated, and raised
                  <motion.div
                    initial={{ scale: 0, rotate: 0, y: 0 }}
                    animate={{ scale: 1, rotate: 15, y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 -m-2 bg-red-500 border-4 border-black shadow-2xl transform z-20"
                    style={{
                      clipPath: "polygon(10% 0%, 90% 10%, 100% 90%, 10% 100%, 0% 10%)",
                    }}
                  />
                ) : null}

                <motion.button
                  onClick={() => handleNavigation(item.path)}
                  whileHover={{ scale: isActive ? 1 : 1.1, rotate: isActive ? 15 : index % 2 === 0 ? 3 : -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-full p-3 flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive ? "transform rotate-12 -translate-y-2 z-30" : "transform hover:rotate-2"
                  }`}
                >
                  {/* Background for non-active items */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white border-2 border-black border-dashed transform rotate-1 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  )}

                  <Icon
                    className={`w-6 h-6 relative z-10 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-black hover:text-red-500"
                    }`}
                  />

                  {/* Active item decorative elements */}
                  {isActive && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-black transform rotate-45"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-2 border-black transform rotate-45"
                      />
                    </>
                  )}
                </motion.button>

                {/* Sketch-style connection lines for active item */}
                {isActive && (
                  <>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black transform rotate-12 origin-left"
                    />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-red-500 transform -rotate-12 origin-right"
                    />
                  </>
                )}
              </div>
            )
          })}

          {/* Sketch-style decorative corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
        </div>
      </motion.div>

      {/* Spacer for mobile content */}
      <div className="h-20 sm:h-20 lg:h-0"></div>
    </>
  )
}
