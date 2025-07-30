"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Target, Eye, Rocket, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'
import Navbar from "../Component/Navbar"
import fire from '../../public/fire.jpg' // Assuming this image is available or will be provided

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const FloatingSketchParticle = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-red-500 border-2 border-black transform rotate-45 opacity-60"
      animate={{
        y: [-20, -100, -20],
        x: [0, Math.random() * 40 - 20, 0],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        rotate: [45, 225, 45],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "easeInOut",
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  )
}

const SketchCard = ({ icon: Icon, title, content, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
      className="group relative bg-white border-4 border-black border-dashed p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform rotate-1 hover:-rotate-1 overflow-hidden"
    >
      <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-8 h-8 text-white transform -rotate-45" />
        </div>
        <h3 className="text-2xl font-black text-black mb-4 group-hover:text-red-500 transition-colors duration-500 transform -rotate-1">
          {title}
        </h3>
        <p className="text-black leading-relaxed group-hover:text-gray-700 transition-colors duration-500 font-bold transform rotate-1">
          {content}
        </p>
      </div>
      {/* Sketch decorative corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
    </motion.div>
  )
}

export default function About() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  const companyValues = [
    {
      icon: Target,
      title: "Our Mission",
      content:
        "We respect consumer's benefit, safety, good quality, beautiful packing, effective service, and reasonable price. Our products are market-oriented and meet high-quality standards with innovative designs that bring joy to every celebration.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      content:
        "To be the leading fireworks company across India, establishing our presence amongst retailers and making our premium products accessible to all. Our vision is to create magical moments through quality fireworks that light up every celebration.",
    },
    {
      icon: Sparkles,
      title: "Our Values",
      content:
        "Safety first is our motto. Maruti Crackers has adopted stringent quality testing measures and norms defined by the fireworks industry. We believe in innovation, customer satisfaction, and creating unforgettable experiences through our products.",
    },
  ]

  return (
    <div
      className="min-h-screen bg-white text-black overflow-x-hidden"
      style={{
        backgroundImage: `
          linear-gradient(90deg, #00000005 1px, transparent 1px),
          linear-gradient(#00000005 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <Navbar />
      <div className="relative z-10 mt-20">
        {/* Main About Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 hundred:mt-0 mobile:-mt-25">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl border-4 border-black border-dashed bg-white transform rotate-2">
                <img
                  src={fire || "/placeholder.svg?height=400&width=600&query=fireworks display"}
                  alt="Fireworks display"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black/20 transform rotate-45 opacity-20 -z-10" />
            </motion.div>

            {/* Text Content Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
              }}
              className="space-y-8"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-black mb-4 transform -rotate-1">
                  Discover{" "}
                  <span className="text-red-500 transform rotate-1 inline-block">Maruti Crackers</span>
                </h2>
                <div className="w-20 h-2 bg-red-500 border-2 border-black transform rotate-2 mb-8" />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="space-y-6 text-lg text-black leading-relaxed font-bold"
              >
                <p className="transform rotate-1">
                  <strong className="text-red-500">Maruti Crackers</strong> is your premier destination for high-quality
                  fireworks, lighting up celebrations across India with brilliance and joy. From vibrant festivals to intimate
                  gatherings, our fireworks add a magical touch to every occasion.
                </p>
                <p className="transform -rotate-1">
                  We partner with top manufacturers to deliver innovative, safe, and spectacular products that create lasting
                  memories. Our commitment to excellence ensures every sparkler and burst is crafted with precision and care.
                </p>
                <p className="transform rotate-1">
                  Serving Tamil Nadu and beyond, we cater to families, event planners, and retailers with tailored solutions,
                  affordable prices, and a passion for making every moment shine brighter.
                </p>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-3 bg-red-50 border-2 border-black px-4 py-2 transform rotate-1">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <span className="text-black font-bold">Premium Quality</span>
                </div>
                <div className="flex items-center gap-3 bg-red-50 border-2 border-black px-4 py-2 transform -rotate-1">
                  <Target className="w-5 h-5 text-red-500" />
                  <span className="text-black font-bold">Safety First</span>
                </div>
                <div className="flex items-center gap-3 bg-red-50 border-2 border-black px-4 py-2 transform rotate-1">
                  <Rocket className="w-5 h-5 text-red-500" />
                  <span className="text-black font-bold">Innovation</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 mx-4 border-4 border-red-500 bg-black shadow-2xl relative overflow-hidden transform -rotate-1">
          <div className="absolute inset-0 bg-red-500/5"></div>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <FloatingSketchParticle key={p.id} delay={p.delay} />
            ))}
          </div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-500 border-4 border-white transform rotate-45 flex items-center justify-center mx-auto mb-8 shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white transform -rotate-45" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-red-500 transform rotate-1">
              🎆 Premium Fireworks with Exclusive Discounts!
            </h2>
            <p className="text-xl mb-4 text-white font-bold transform -rotate-1">
              Celebrate every occasion with <span className="font-black text-red-400">Maruti Crackers</span>. Your
              trusted partner for elite fireworks and festive celebrations.
            </p>
            <p className="text-lg mb-8 text-white font-bold transform rotate-1">
              Explore our collection of rockets, gift boxes, skyshots, sparklers, and more—with convenient online
              ordering and reliable doorstep delivery across Tamil Nadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="tel:+919487524689"
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-8 py-4 shadow-lg transition-all duration-300 transform rotate-2 hover:-rotate-2"
              >
                <Phone className="w-5 h-5" />
                +91 94875 24689
              </motion.a>
            </div>
          </motion.div>
          {/* Sketch decorative corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
        </section>

        {/* Company Values Section */}
        <section className="py-32 px-4 md:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4 transform -rotate-1">Our Foundation</h2>
              <div className="w-24 h-2 bg-red-500 border-2 border-black transform rotate-1 mx-auto mb-6" />
              <p className="text-black text-lg max-w-2xl mx-auto font-bold transform rotate-1">
                Built on strong values and unwavering commitment to excellence, safety, and customer satisfaction
              </p>
            </motion.div>
            <div className="grid tab:grid-cols-1 hundred:grid-cols-3 gap-8">
              {companyValues.map((value, i) => (
                <SketchCard key={i} icon={value.icon} title={value.title} content={value.content} delay={i * 0.2} />
              ))}
            </div>
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
    </div>
  )
}
