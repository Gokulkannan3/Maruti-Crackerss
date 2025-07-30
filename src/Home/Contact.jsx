"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../Component/Navbar"
import { MapPin, Phone, Mail, Globe, Clock, ArrowRight } from "lucide-react"
import { API_BASE_URL } from "../../Config"
import '../App.css'

// New SketchFireworkAnimation component
const SketchFireworkAnimation = ({ delay = 0, startPosition, endPosition, burstPosition }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const burstColors = ["#ef4444", "#000000", "#ffffff"] // Red, Black, White

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Rocket Trail (simple red line) */}
      <motion.div
        className="absolute w-2 h-6 bg-red-500 transform rotate-45"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          boxShadow: `0 0 10px #ef4444`,
        }}
        animate={{
          x: [0, endPosition.x - startPosition.x],
          y: [0, endPosition.y - startPosition.y],
          opacity: [1, 1, 0],
          scale: [1, 1.2, 0.8],
        }}
        transition={{
          duration: 2.2,
          delay: delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 10,
          ease: "easeOut",
        }}
      />
      {/* Main Burst */}
      <motion.div
        className="absolute"
        style={{
          left: burstPosition.x,
          top: burstPosition.y,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 0] }}
        transition={{
          duration: 5,
          delay: delay + 2.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 10,
        }}
      >
        {/* Primary burst particles (diamonds) */}
        {Array.from({ length: 28 }).map((_, i) => {
          const angle = i * 12.86 * (Math.PI / 180)
          const distance = dimensions.width * 0.25
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance
          return (
            <motion.div
              key={`primary-${i}`}
              className="absolute w-4 h-4 border-2 border-black transform rotate-45"
              style={{
                background: burstColors[i % burstColors.length],
                boxShadow: `0 0 15px ${burstColors[i % burstColors.length]}`,
              }}
              animate={{
                x: [0, x * 0.3, x * 0.7, x],
                y: [0, y * 0.3, y * 0.7, y],
                opacity: [1, 0.9, 0.5, 0],
                scale: [1, 1.3, 0.8, 0],
              }}
              transition={{
                duration: 4.5,
                delay: delay + 2.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 10,
                ease: "easeOut",
              }}
            />
          )
        })}
        {/* Secondary sparkles (smaller diamonds) */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = i * 9 * (Math.PI / 180)
          const distance = dimensions.width * 0.15
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance
          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-2 h-2 border-2 border-black transform rotate-45"
              style={{
                background: burstColors[i % burstColors.length],
                boxShadow: `0 0 10px ${burstColors[i % burstColors.length]}`,
              }}
              animate={{
                x: [0, x * 0.4, x * 0.8, x * 1.3],
                y: [0, y * 0.4, y * 0.8, y * 1.3],
                opacity: [1, 0.8, 0.4, 0],
                scale: [1, 0.8, 0.4, 0],
              }}
              transition={{
                duration: 4,
                delay: delay + 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 10,
                ease: "easeOut",
              }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

const ContactCard = ({ icon: Icon, title, content, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
      className="group relative bg-white border-4 border-black border-dashed shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform rotate-1 hover:-rotate-1"
    >
      <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 15 }}
          className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
        >
          <Icon className="w-8 h-8 text-white transform -rotate-45" />
        </motion.div>
      </div>

      <div className="relative pt-12 p-8 z-10">
        <h2 className="text-xl font-black text-black mb-6 text-center group-hover:text-red-500 transition-colors duration-500 transform -rotate-1">
          {title}
        </h2>
        <div className="space-y-3">
          {content.map((item, itemIndex) => (
            <div key={itemIndex}>
              {typeof item === "string" ? (
                <p className="text-black text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-500 font-bold transform rotate-1">
                  {item}
                </p>
              ) : (
                <motion.a
                  href={item.href}
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="block text-red-500 hover:text-red-600 text-center transition-colors duration-200 hover:underline font-black transform -rotate-1"
                >
                  {item.text}
                </motion.a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sketch decorative corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
    </motion.div>
  )
}

export default function Contact() {
  const [screenDimensions, setScreenDimensions] = useState({ width: 1920, height: 1080 })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const contactCards = [
    {
      icon: MapPin,
      title: "Our Shop Location",
      content: ["Madhu Nisha Crackers", "Pernayakkanpatti, Pachayapuram,", "Kil Thayilapatti", "Sivakasi, Tamil Nadu"],
    },
    {
      icon: Phone,
      title: "Call Information",
      content: [
        { text: "Online Enquiry: 9487524689", href: "tel:9487524689" },
        { text: "Whole Sale Enquiry: 9487524689", href: "tel:9487524689" },
        { text: "Order & Payment Confirm: 9487594689", href: "tel:9487594689" },
        { text: "Dispatch: 9487594689", href: "tel:9487594689" },
      ],
    },
    {
      icon: Mail,
      title: "Email Address",
      content: [{ text: "madhunishapyrotechsivakasi@gmail.com", href: "mailto:madhunishapyrotechsivakasi@gmail.com" }],
    },
  ]

  const fireworkConfigs = [
    {
      delay: 0,
      startPosition: { x: -50, y: screenDimensions.height * 0.8 },
      endPosition: { x: screenDimensions.width * 0.2, y: screenDimensions.height * 0.3 },
      burstPosition: { x: screenDimensions.width * 0.2, y: screenDimensions.height * 0.3 },
    },
    {
      delay: 2.5,
      startPosition: { x: screenDimensions.width + 50, y: screenDimensions.height * 0.9 },
      endPosition: { x: screenDimensions.width * 0.8, y: screenDimensions.height * 0.25 },
      burstPosition: { x: screenDimensions.width * 0.8, y: screenDimensions.height * 0.25 },
    },
    {
      delay: 5,
      startPosition: { x: screenDimensions.width * 0.1, y: -50 },
      endPosition: { x: screenDimensions.width * 0.5, y: screenDimensions.height * 0.4 },
      burstPosition: { x: screenDimensions.width * 0.5, y: screenDimensions.height * 0.4 },
    },
    {
      delay: 7.5,
      startPosition: { x: screenDimensions.width * 0.9, y: screenDimensions.height + 50 },
      endPosition: { x: screenDimensions.width * 0.7, y: screenDimensions.height * 0.35 },
      burstPosition: { x: screenDimensions.width * 0.7, y: screenDimensions.height * 0.35 },
    },
  ]

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{
        backgroundImage: `
          linear-gradient(90deg, #00000005 1px, transparent 1px),
          linear-gradient(#00000005 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Background Fireworks */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {fireworkConfigs.map((config, index) => (
          <SketchFireworkAnimation
            key={index}
            delay={config.delay}
            startPosition={config.startPosition}
            endPosition={config.endPosition}
            burstPosition={config.burstPosition}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto pt-32 pb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-8 shadow-lg"
            >
              <Phone className="w-10 h-10 text-white transform -rotate-45" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black text-black mb-6 transform -rotate-1">
              <span className="text-red-500">Contact</span> <span className="text-black">Us</span>
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-2 bg-red-500 border-2 border-black transform rotate-1 mx-auto mb-8"
            />

            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed font-bold transform rotate-1">
              Ready to light up your celebrations? Get in touch with{" "}
              <span className="font-black text-red-500">Maruti Crackers</span> for all your premium fireworks needs.
              We're here to make your special moments truly unforgettable.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contactCards.map((card, index) => (
              <ContactCard key={index} icon={card.icon} title={card.title} content={card.content} delay={index * 0.2} />
            ))}
          </div>

          {/* Business Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02, rotate: -2 }}
            className="group relative bg-white border-4 border-black border-dashed shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform -rotate-1 hover:rotate-1 mb-16"
          >
            <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -15 }}
                className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <Clock className="w-8 h-8 text-white transform -rotate-45" />
              </motion.div>
            </div>

            <div className="relative pt-12 p-8 z-10 text-center">
              <h2 className="text-2xl font-black text-black mb-6 group-hover:text-red-500 transition-colors duration-500 transform rotate-1">
                Business Hours
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-black transform -rotate-1">Regular Days</h3>
                  <div className="space-y-2 text-black font-bold">
                    <p className="transform rotate-1">Monday - Saturday</p>
                    <p className="font-black text-red-500 transform -rotate-1">9:00 AM - 8:00 PM</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-black transform rotate-1">Festival Season</h3>
                  <div className="space-y-2 text-black font-bold">
                    <p className="transform -rotate-1">Extended Hours</p>
                    <p className="font-black text-red-500 transform rotate-1">8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-red-50 border-4 border-red-500 border-dashed transform rotate-1">
                <p className="text-sm text-red-700 font-black transform -rotate-1">
                  <strong>Note:</strong> We're available for emergency orders and bulk purchases. Call us anytime!
                </p>
              </div>
            </div>

            {/* Sketch decorative corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          </motion.div>

          {/* Wholesale Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white border-4 border-black border-dashed shadow-2xl p-10 max-w-3xl mx-auto mb-20 transform rotate-1"
          >
            <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

            <h2 className="text-3xl font-black text-center text-red-500 mb-6 transform -rotate-1 relative z-10">
              Wholesale Enquiry Form
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target
                const data = {
                  name: form.name.value,
                  email: form.email.value,
                  mobile: form.mobile.value,
                  message: form.message.value,
                }

                fetch(`${API_BASE_URL}/api/send-wholesale-enquiry`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
                  .then((res) => {
                    if (res.ok) {
                      form.reset()
                      setShowSuccess(true)
                      setTimeout(() => setShowSuccess(false), 4000)
                    } else {
                      alert("Failed to send. Try again.")
                    }
                  })
                  .catch(() => alert("Error sending enquiry."))
              }}
              className="space-y-6 relative z-10"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full border-4 border-black border-dashed p-4 focus:outline-none focus:ring-2 focus:ring-red-400 font-bold transform rotate-1 focus:-rotate-1 transition-all duration-300"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full border-4 border-black border-dashed p-4 focus:outline-none focus:ring-2 focus:ring-red-400 font-bold transform -rotate-1 focus:rotate-1 transition-all duration-300"
                />
              </div>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                required
                className="w-full border-4 border-black border-dashed p-4 focus:outline-none focus:ring-2 focus:ring-red-400 font-bold transform rotate-1 focus:-rotate-1 transition-all duration-300"
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                required
                className="w-full border-4 border-black border-dashed p-4 focus:outline-none focus:ring-2 focus:ring-red-400 font-bold transform -rotate-1 focus:rotate-1 transition-all duration-300"
              />
              <div className="text-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black py-3 px-8 shadow-lg transition duration-300 transform rotate-2 hover:-rotate-2"
                >
                  Submit Enquiry
                </motion.button>
              </div>
            </form>

            {showSuccess && (
              <motion.div
                onClick={() => setShowSuccess(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer bg-white/90 backdrop-blur-sm"
              >
                <div className="relative">
                  {/* Sketch-style confetti burst */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const angle = (i / 20) * 2 * Math.PI
                    const radius = 120 + Math.random() * 40
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius
                    const colors = ["#ef4444", "#000000"]
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x,
                          y,
                          opacity: 0,
                          scale: 0.5,
                          rotate: Math.random() * 360,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-4 h-4 border-2 border-black transform rotate-45"
                        style={{
                          backgroundColor: colors[i % colors.length],
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )
                  })}

                  {/* Success Message Box */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white border-4 border-black border-dashed px-10 py-6 shadow-2xl text-center z-10 transform rotate-2"
                  >
                    <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
                    <h2 className="text-3xl font-black text-red-500 mb-2 relative z-10 transform -rotate-1">
                      🎉 Enquiry Sent!
                    </h2>
                    <p className="text-black font-bold relative z-10 transform rotate-1">
                      We'll get in touch with you shortly.
                    </p>

                    {/* Sketch decorative corners */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Sketch decorative corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.01, rotate: 2 }}
            className="group relative bg-white border-4 border-black border-dashed shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform -rotate-1 hover:rotate-1"
          >
            <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <Globe className="w-8 h-8 text-white transform -rotate-45" />
              </motion.div>
            </div>

            <div className="relative pt-12 p-8 z-10">
              <h2 className="text-2xl font-black text-black mb-6 text-center group-hover:text-red-500 transition-colors duration-500 transform -rotate-1">
                Find Us on Map
              </h2>
              <div className="border-4 border-black border-dashed overflow-hidden shadow-lg transform rotate-1">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500.0!2d77.7896921!3d9.3995273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x16131213162085675321!2sMadhu%20Nisha%20Pyrotech!5e0!3m2!1sen!2sin!4v1695299019912!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="mt-6 text-center">
                <motion.a
                  href="https://www.google.com/maps/place/Madhu+Nisha+Pyrotech/@9.3995273,77.7896921,18z/data=!4m5!3m4!1s0x0:0x16131213162085675321!8m2!3d9.3995273!4d77.7896921"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform rotate-1 hover:-rotate-1"
                >
                  <MapPin className="w-5 h-5" />
                  Get Directions
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>

            {/* Sketch decorative corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          </motion.div>
        </section>

        {/* Sketch Footer */}
        <footer className="bg-black text-white py-16 border-t-4 border-red-500 relative">
          <div className="absolute inset-0 bg-red-500/5"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 mobile:mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500 border-4 border-white transform rotate-45 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white transform rotate-45"></div>
                  </div>
                  <h2 className="text-2xl font-black transform -rotate-1">Maruti Crackers</h2>
                </div>
                <p className="text-red-400 font-black mb-2 transform rotate-1">Premium Fireworks</p>
                <p className="text-white leading-relaxed font-bold transform -rotate-1">
                  Spark joy, spread light—fireworks crafted for your celebration. Creating magical moments with quality
                  and safety as our top priorities.
                </p>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-black mb-6 text-red-400 transform rotate-1">Contact Us</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-black">Maruti Crackers</p>
                      <p className="text-white font-bold">
                        Pernayakkanpatti, Pachayapuram.,
                        <br />
                        Kil Thayilapatti, Sivakasi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-red-400" />
                    <div className="space-y-1">
                      <a
                        href="tel:+919487524689"
                        className="text-white hover:text-red-400 transition-colors block font-bold"
                      >
                        +91 94875 24689
                      </a>
                      <a
                        href="tel:+919497594689"
                        className="text-white hover:text-red-400 transition-colors block font-bold"
                      >
                        +91 94975 94689
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-red-400" />
                    <a
                      href="mailto:info@maruticrackers.com"
                      className="text-white hover:text-red-400 transition-colors font-bold"
                    >
                      info@maruticrackers.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-black mb-6 text-red-400 transform -rotate-1">Quick Links</h2>
                <ul className="space-y-3">
                  {["Home", "About Us", "Price List", "Safety Tips", "Contact Us"].map((link) => (
                    <li key={link}>
                      <a
                        href={link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`}
                        className="text-white hover:text-red-400 transition-colors duration-300 font-bold flex items-center gap-2 group transform hover:rotate-1"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-12 pt-8 border-t-4 border-red-500 text-center">
              <p className="text-white mb-4 leading-relaxed font-bold">
                As per 2018 Supreme Court regulations, online sales of firecrackers are restricted. We respect all legal
                guidelines and offer consultation services. Add products to your inquiry list and we'll respond within
                24 hours with detailed quotations.
              </p>
              <p className="text-white font-black">
                Copyright © 2025 <span className="text-red-400 font-black">Maruti Crackers</span>. All rights reserved.
                Developed by <span className="text-red-400 font-black">Tech Innovations</span>
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating sketch elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 bg-red-500 transform rotate-45 pointer-events-none"
          animate={{
            x: [0, Math.cos(i * 45) * 100, 0],
            y: [0, Math.sin(i * 45) * 100, 0],
            opacity: [0, 0.6, 0],
            rotate: [45, 225, 45],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.8,
          }}
          style={{
            left: `${20 + (i % 4) * 20}%`,
            top: `${30 + Math.floor(i / 4) * 40}%`,
          }}
        />
      ))}
    </div>
  )
}
