"use client"

import { useEffect } from "react"

import { useState } from "react"

import { motion } from "framer-motion"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flame,
  Droplets,
  Eye,
  Users,
  Heart,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react"
import Navbar from "../Component/Navbar"
import "../App.css"

// New SketchFireworkAnimation component (copied from contact.tsx for self-containment)
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

const dosData = [
  {
    icon: CheckCircle,
    title: "Follow Instructions",
    description: "Always read and follow the instructions printed on each firework package carefully before use.",
  },
  {
    icon: Shield,
    title: "Buy from Authorized Dealers",
    description: "Purchase fireworks only from licensed and reputable manufacturers like Maruti Crackers.",
  },
  {
    icon: Eye,
    title: "Use in Open Spaces",
    description: "Light fireworks only in outdoor areas with plenty of open space, away from buildings.",
  },
  {
    icon: Users,
    title: "Maintain Safe Distance",
    description: "Only one person should light fireworks while others maintain a safe distance of at least 10 feet.",
  },
  {
    icon: Droplets,
    title: "Keep Water Ready",
    description: "Always have water buckets or a garden hose nearby for emergency fire suppression.",
  },
  {
    icon: Heart,
    title: "Supervise Children",
    description: "Adult supervision is mandatory when children are around fireworks. Never leave them unattended.",
  },
]

const dontsData = [
  {
    icon: XCircle,
    title: "Don't Make Homemade Fireworks",
    description: "Never attempt to make your own fireworks or modify existing ones - it's extremely dangerous.",
  },
  {
    icon: Flame,
    title: "Don't Relight Duds",
    description: "Never try to relight fireworks that failed to ignite properly. Wait and dispose safely.",
  },
  {
    icon: AlertTriangle,
    title: "Don't Wear Loose Clothing",
    description: "Avoid loose, flowing clothes that can easily catch fire. Wear cotton clothing instead.",
  },
  {
    icon: XCircle,
    title: "Don't Handle Used Fireworks",
    description: "Never pick up or handle fireworks after use - they may still contain active components.",
  },
  {
    icon: Shield,
    title: "Don't Store Improperly",
    description: "Never carry fireworks in pockets or store them near heat sources or in damp places.",
  },
  {
    icon: Eye,
    title: "Don't Use Indoors",
    description: "Never use fireworks inside buildings, near vehicles, or in confined spaces.",
  },
]

export default function Safety() {
  const [screenDimensions, setScreenDimensions] = useState({ width: 1920, height: 1080 })

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

  const fireworkConfigs = [
    {
      delay: 0,
      startPosition: { x: -50, y: screenDimensions.height * 0.8 },
      endPosition: { x: screenDimensions.width * 0.2, y: screenDimensions.height * 0.3 },
      burstPosition: { x: screenDimensions.width * 0.2, y: screenDimensions.height * 0.3 },
    },
    {
      delay: 3,
      startPosition: { x: screenDimensions.width + 50, y: screenDimensions.height * 0.9 },
      endPosition: { x: screenDimensions.width * 0.8, y: screenDimensions.height * 0.25 },
      burstPosition: { x: screenDimensions.width * 0.8, y: screenDimensions.height * 0.25 },
    },
    {
      delay: 6,
      startPosition: { x: screenDimensions.width * 0.1, y: -50 },
      endPosition: { x: screenDimensions.width * 0.4, y: screenDimensions.height * 0.4 },
      burstPosition: { x: screenDimensions.width * 0.4, y: screenDimensions.height * 0.4 },
    },
    {
      delay: 9,
      startPosition: { x: screenDimensions.width * 0.9, y: screenDimensions.height + 50 },
      endPosition: { x: screenDimensions.width * 0.6, y: screenDimensions.height * 0.35 },
      burstPosition: { x: screenDimensions.width * 0.6, y: screenDimensions.height * 0.35 },
    },
  ]

  return (
    <div
      className="min-h-screen bg-white text-black overflow-x-hidden relative"
      style={{
        backgroundImage: `
          linear-gradient(90deg, #00000005 1px, transparent 1px),
          linear-gradient(#00000005 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Background Fireworks Animation */}
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

      {/* All content with higher z-index */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <Shield className="w-10 h-10 text-white transform -rotate-45" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black text-black mb-6 transform -rotate-1">
                <span className="text-red-500">Safety</span> <span className="text-black">Guidelines</span>
              </h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-2 bg-red-500 border-2 border-black transform rotate-1 mx-auto mb-8"
              />

              <p className="text-2xl md:text-3xl font-black text-red-500 mb-6 transform rotate-1">Maruti Crackers</p>

              <p className="text-xl md:text-2xl text-black leading-relaxed max-w-4xl mx-auto font-bold transform -rotate-1">
                Your safety is our priority. Follow these essential guidelines for a safe and enjoyable fireworks
                experience. A moment of caution prevents a lifetime of regret.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Do's Section */}
        <section className="py-20 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-black mb-6 flex items-center justify-center gap-4 mobile:flex-col mobile:gap-2">
                <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white transform -rotate-45" />
                </div>
                <span className="text-red-500 transform -rotate-1">Safety Do's</span>
              </h2>
              <div className="w-24 h-2 bg-red-500 border-2 border-black transform rotate-1 mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dosData.map(({ icon: Icon, title, description }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
                  className="group relative bg-white border-4 border-black border-dashed p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform rotate-1 hover:-rotate-1 overflow-hidden"
                >
                  <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-white transform -rotate-45" />
                    </div>
                    <h3 className="text-xl font-black text-black mb-4 group-hover:text-red-500 transition-colors duration-500 transform -rotate-1">
                      {title}
                    </h3>
                    <p className="text-black leading-relaxed group-hover:text-gray-700 transition-colors duration-500 font-bold transform rotate-1">
                      {description}
                    </p>
                  </div>

                  {/* Sketch decorative corners */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Don'ts Section */}
        <section className="py-20 px-4 sm:px-6 relative bg-red-50/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-black mb-6 flex items-center justify-center gap-4 mobile:flex-col mobile:gap-2">
                <div className="w-16 h-16 bg-black border-4 border-red-500 transform rotate-45 flex items-center justify-center shadow-lg">
                  <XCircle className="w-8 h-8 text-white transform -rotate-45" />
                </div>
                <span className="text-black transform rotate-1">Safety Don'ts</span>
              </h2>
              <div className="w-24 h-2 bg-black border-2 border-red-500 transform -rotate-1 mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dontsData.map(({ icon: Icon, title, description }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02, rotate: -2 }}
                  className="group bg-white border-4 border-black border-dashed p-8 shadow-2xl hover:shadow-black/25 transition-all duration-500 transform -rotate-1 hover:rotate-1 overflow-hidden"
                >
                  <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-black border-4 border-red-500 transform rotate-45 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-white transform -rotate-45" />
                    </div>
                    <h3 className="text-xl font-black text-black mb-4 group-hover:text-red-500 transition-colors duration-500 transform rotate-1">
                      {title}
                    </h3>
                    <p className="text-black leading-relaxed group-hover:text-gray-700 transition-colors duration-500 font-bold transform -rotate-1">
                      {description}
                    </p>
                  </div>

                  {/* Sketch decorative corners */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Guidelines */}
        <section className="py-20 px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-black border-dashed p-8 text-black text-center overflow-hidden relative shadow-2xl transform rotate-1"
            >
              <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <AlertTriangle className="w-10 h-10 text-white transform -rotate-45" />
                </motion.div>

                <h3 className="text-3xl font-black mb-6 transform -rotate-1">Emergency Guidelines</h3>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-red-50 border-4 border-red-500 border-dashed p-6 transform rotate-1">
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2 transform -rotate-1">
                      <Flame className="w-5 h-5" />
                      In Case of Fire
                    </h4>
                    <ul className="space-y-2 text-black font-bold">
                      <li>• Use water or sand to extinguish flames</li>
                      <li>• Never use your hands to put out fires</li>
                      <li>• Call emergency services if needed</li>
                      <li>• Move away from unburned fireworks</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border-4 border-red-500 border-dashed p-6 transform -rotate-1">
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2 transform rotate-1">
                      <Heart className="w-5 h-5" />
                      In Case of Injury
                    </h4>
                    <ul className="space-y-2 text-black font-bold">
                      <li>• Seek immediate medical attention</li>
                      <li>• Do not remove embedded particles</li>
                      <li>• Cool burns with cold water</li>
                      <li>• Keep first aid kit accessible</li>
                    </ul>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-4 bg-red-50 border-4 border-red-500 border-dashed transform rotate-1"
                >
                  <p className="text-lg font-black transform -rotate-1">
                    Remember: Safety is not just a guideline, it's a responsibility. Enjoy fireworks responsibly and
                    create beautiful memories safely.
                  </p>
                </motion.div>
              </div>

              {/* Sketch decorative corners */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
            </motion.div>
          </div>
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
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 bg-red-500 transform rotate-45 pointer-events-none"
          animate={{
            x: [0, Math.cos(i * 36) * 120, 0],
            y: [0, Math.sin(i * 36) * 120, 0],
            opacity: [0, 0.8, 0],
            rotate: [45, 225, 45],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 1,
          }}
          style={{
            left: `${15 + (i % 5) * 17}%`,
            top: `${25 + Math.floor(i / 5) * 35}%`,
          }}
        />
      ))}
    </div>
  )
}
