import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sparkles,
  Heart,
  SmilePlus,
  Clock,
  ArrowRight,
  Copy,
  ShoppingCart,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Star,
  Flame,
  Target,
  CloudLightningIcon as Lightning,
  Circle,
  Triangle,
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { FaInfoCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import Navbar from "../Component/Navbar"
import '../App.css'
import { API_BASE_URL } from "../../Config"
import about from "../../public/cont.png"

const categories = [
  {
    name: "Premium Sparklers",
    icon: Star,
    description: "Hand-crafted sparklers with mesmerizing light patterns",
    sketch: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    name: "Sky Rockets",
    icon: Triangle,
    description: "Powerful rockets that paint brilliant colors across the sky",
    sketch: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    name: "Thunder Crackers",
    icon: Lightning,
    description: "Explosive sound crackers for grand celebrations",
    sketch: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    name: "Mega Bombs",
    icon: Circle,
    description: "High-impact crackers with thunderous sound effects",
    sketch: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Spinning Wheels",
    icon: Target,
    description: "Colorful ground spinners with spectacular visual effects",
    sketch: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 100 10 5 5 0 000-10z",
  },
  {
    name: "Aerial Displays",
    icon: Flame,
    description: "Professional-grade aerial fireworks for stunning shows",
    sketch:
      "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
  },
]

const statsData = [
  { label: "Customer Satisfaction", value: 100, icon: Heart, suffix: "%" },
  { label: "Premium Products", value: 300, icon: Sparkles, suffix: "+" },
  { label: "Happy Customers", value: 1000, icon: SmilePlus, suffix: "+" },
  { label: "Years of Excellence", value: 20, icon: Clock, suffix: "+" },
]

const navLinks = ["Home", "About Us", "Price List", "Safety Guide", "Contact Us"]

// Sketch-style Modern Banner Carousel Component
const SketchBannerCarousel = ({ banners, currentSlide, setCurrentSlide }) => {
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (isPlaying && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, banners.length, setCurrentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  if (!banners.length) return null

  return (
    <div className="relative w-full h-[200px] md:h-[500px] overflow-hidden bg-white">
      {/* Sketch-style border */}
      <div className="absolute inset-0 border-4 border-black border-dashed rounded-none transform rotate-1 bg-white"></div>
      <div className="absolute inset-2 border-2 border-red-500 rounded-none transform -rotate-1 bg-white overflow-hidden">
        {/* Main Carousel Container */}
        <div className="relative w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={
                  banners[currentSlide]?.image_url?.startsWith("http")
                    ? banners[currentSlide].image_url
                    : `${API_BASE_URL}${banners[currentSlide]?.image_url}`
                }
                alt={`Banner ${currentSlide + 1}`}
                className="w-full h-full object-cover filter contrast-110 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Sketch overlay effect */}
              <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {banners.length > 1 && (
          <>
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-none transform rotate-3 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-none transform -rotate-3 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-none transform rotate-2 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-1" />}
            </motion.button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.3, rotate: 45 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 border-2 border-black transform rotate-45 transition-all duration-300 ${
                    index === currentSlide ? "bg-red-500" : "bg-white hover:bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 transform -rotate-2 shadow-lg z-10">
              <span className="text-black font-bold text-sm">
                {currentSlide + 1} / {banners.length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Sketch-style Digital Rain Animation Component for Promocodes
const SketchDigitalRainAnimation = ({ delay = 0, promocode, onCopyPromo, copiedPromos, position, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [rainDrops, setRainDrops] = useState([])
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      // Generate rain drops
      const drops = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      }))
      setRainDrops(drops)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    onCopyPromo(code)
    setIsCopied(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (!isVisible || copiedPromos.includes(promocode.code)) return null

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Sketch Rain Effect */}
      <div className="absolute inset-0 w-80 h-80 pointer-events-none">
        {rainDrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-1 bg-red-500 rounded-full"
            style={{ left: `${drop.x}%` }}
            initial={{ y: -100, height: 0, opacity: 0 }}
            animate={{
              y: [0, 400],
              height: [0, 60, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: drop.duration,
              delay: drop.delay,
              repeat: 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Sketch Promocode Card */}
      <motion.div
        initial={{ scale: 0, rotateY: 180, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ delay: delay + 3, duration: 0.8, type: "spring" }}
        className="pointer-events-auto relative"
      >
        {/* Sketch-style background layers */}
        <div className="absolute inset-0 bg-black rounded-none transform rotate-2 opacity-20"></div>
        <div className="absolute inset-0 bg-red-500 rounded-none transform -rotate-1 opacity-30"></div>

        {/* Main Card */}
        <div className="relative bg-white border-4 border-black rounded-none transform rotate-1 p-6 shadow-2xl min-w-[280px]">
          {/* Sketch-style inner border */}
          <div className="absolute inset-2 border-2 border-red-500 border-dashed"></div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 border-2 border-black text-white transform rotate-45 flex items-center justify-center shadow-lg transition-all duration-300 z-10"
          >
            <X className="w-4 h-4 transform -rotate-45" />
          </motion.button>

          <div className="text-center relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white transform -rotate-45" />
              </div>
            </motion.div>

            <div className="font-black text-3xl text-black mb-3 tracking-wider transform -rotate-1">
              {promocode.code}
            </div>

            <div className="bg-black text-red-500 border-2 border-red-500 px-6 py-3 transform rotate-1 text-lg font-bold mb-6 shadow-lg">
              {promocode.discount}% OFF
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(promocode.code)}
              disabled={isCopied}
              className={`w-full font-bold py-4 px-6 border-4 border-black transform -rotate-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg ${
                isCopied
                  ? "bg-green-500 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white hover:transform hover:rotate-1"
              }`}
            >
              {isCopied ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                  >
                    <span className="text-green-500 text-sm">✓</span>
                  </motion.div>
                  COPIED!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  COPY CODE
                </>
              )}
            </motion.button>
          </div>

          {/* Sketch-style decorative elements */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-black transform rotate-45"
              animate={{
                x: [0, Math.cos(i * 60) * 30, 0],
                y: [0, Math.sin(i * 60) * 30, 0],
                opacity: [0, 1, 0],
                rotate: [45, 225, 45],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Sketch Lightning Strike Promocode Animation
const SketchLightningPromoAnimation = ({ isActive, onComplete, promocodes, onCopyPromo, copiedPromos }) => {
  const [showingStrikes, setShowingStrikes] = useState([])
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)

  useEffect(() => {
    if (isActive && promocodes.length > 0) {
      setShowCloseButton(true)
      setShowingStrikes([])
      setAnimationComplete(false)
      strikeNext(0)
    }
  }, [isActive, promocodes.length])

  const strikeNext = (index) => {
    if (index >= promocodes.length) {
      setTimeout(() => {
        setAnimationComplete(true)
        onComplete()
      }, 1000)
      return
    }

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080

    const position = {
      x: screenWidth * 0.2 + ((index * screenWidth * 0.15) % (screenWidth * 0.6)),
      y: screenHeight * 0.3 + (index % 3) * 200,
    }

    setShowingStrikes((prev) => [
      ...prev,
      {
        index,
        position,
        promocode: promocodes[index],
      },
    ])

    setTimeout(() => strikeNext(index + 1), 2500)
  }

  const handleCloseAll = () => {
    setShowingStrikes([])
    setShowCloseButton(false)
    setAnimationComplete(false)
    onComplete()
  }

  const handleClosePromo = (index) => {
    setShowingStrikes((prev) => prev.filter((strike) => strike.index !== index))
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-sm z-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #ff000010 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #00000010 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        >
          {/* Sketch Close All Button */}
          {showCloseButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCloseAll}
              className="fixed top-8 right-8 z-50 w-16 h-16 bg-white border-4 border-black text-black transform rotate-12 flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <X className="w-8 h-8" />
            </motion.button>
          )}

          {/* Lightning Strikes */}
          {showingStrikes.map((strike) => (
            <SketchDigitalRainAnimation
              key={`strike-${strike.index}`}
              delay={0}
              promocode={strike.promocode}
              onCopyPromo={onCopyPromo}
              copiedPromos={copiedPromos}
              position={strike.position}
              onClose={() => handleClosePromo(strike.index)}
            />
          ))}

          {/* Sketch Shop Now Button */}
          {animationComplete && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/price-list")}
                className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-bold px-8 py-4 transform rotate-2 shadow-2xl flex items-center gap-3 text-lg transition-all duration-300"
              >
                <ShoppingCart className="w-6 h-6" />
                Shop Now
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const SketchCarousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(null)

  const mediaItems = useMemo(() => {
    const items = media && typeof media === "string" ? JSON.parse(media) : Array.isArray(media) ? media : []
    return items.sort((a, b) => {
      const aStr = typeof a === "string" ? a : ""
      const bStr = typeof b === "string" ? b : ""
      const isAVideo = aStr.startsWith("data:video/")
      const isBVideo = bStr.startsWith("data:video/")
      const isAGif = aStr.startsWith("data:image/gif") || aStr.toLowerCase().endsWith(".gif")
      const isBGif = bStr.startsWith("data:image/gif") || bStr.toLowerCase().endsWith(".gif")
      const isAImage = aStr.startsWith("data:image/") && !isAGif
      const isBImage = bStr.startsWith("data:image/") && !isBGif

      const getPriority = (isImage, isGif, isVideo) => {
        if (isImage) return 0
        if (isGif) return 1
        if (isVideo) return 2
        return 3
      }

      return getPriority(isAImage, isAGif, isAVideo) - getPriority(isBImage, isBGif, isBVideo)
    })
  }, [media])

  const isVideo = (item) => typeof item === "string" && item.startsWith("data:video/")

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return
    const touchEndX = e.touches[0].clientX
    const diffX = touchStartX.current - touchEndX
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) handleNext()
      else handlePrev()
      touchStartX.current = null
    }
  }

  const handleTouchEnd = () => {
    touchStartX.current = null
  }

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="w-full h-64 mb-6 overflow-hidden bg-white flex items-center justify-center border-4 border-black border-dashed transform rotate-1 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mb-4 mx-auto shadow-lg">
            <Sparkles className="w-8 h-8 text-white transform -rotate-45" />
          </div>
          <p className="text-black font-bold">No media available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-64 mb-6 overflow-hidden group bg-white border-4 border-black border-dashed transform -rotate-1 shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {isVideo(mediaItems[currentIndex]) ? (
            <video
              src={mediaItems[currentIndex]}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover filter contrast-110"
            />
          ) : (
            <img
              src={mediaItems[currentIndex] || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-cover filter contrast-110"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {mediaItems.length > 1 && (
        <>
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-black transform rotate-3 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <FaArrowLeft className="text-black text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-black transform -rotate-3 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <FaArrowRight className="text-black text-sm" />
          </motion.button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mediaItems.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2, rotate: 45 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 border-2 border-black transform rotate-45 transition-all duration-300 ${
                  index === currentIndex ? "bg-red-500" : "bg-white hover:bg-gray-200"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function SketchStatCard({ icon: Icon, value, label, suffix, delay }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (inView && count === 0) {
      let start = 0
      const duration = 2000
      const stepTime = Math.max(Math.floor(duration / value), 20)
      const timer = setInterval(() => {
        start += Math.ceil(value / 100)
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, stepTime)
    }
  }, [inView, value, count])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
      className="group relative bg-white border-4 border-black border-dashed p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform rotate-1 hover:-rotate-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:-rotate-45 transition-transform duration-500">
          <Icon className="w-8 h-8 text-white transform -rotate-45" />
        </div>
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="mb-2"
        >
          <span className="text-4xl font-black text-black tabular-nums">{count}</span>
          <span className="text-2xl font-black text-red-500">{suffix}</span>
        </motion.div>
        <p className="text-black font-bold text-sm leading-relaxed transform -rotate-1">{label}</p>
      </div>
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-black/10 transform rotate-45 opacity-20 group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  )
}

export default function Home() {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fastRunningProducts, setFastRunningProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [promocodes, setPromocodes] = useState([])
  const [showLightningAnimation, setShowLightningAnimation] = useState(false)
  const [copiedPromos, setCopiedPromos] = useState([])
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const navigate = useNavigate()

  const handleShowDetails = (product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setSelectedProduct(null)
    setShowDetailsModal(false)
  }

  const handleLightningClick = () => {
    setShowLightningAnimation(true)
  }

  const handleLightningComplete = () => {
    setShowLightningAnimation(false)
  }

  const handleCopyPromo = (code) => {
    setCopiedPromos((prev) => [...prev, code])
  }

  // Fetch banners
  useEffect(() => {
    const fetchBanners = () => {
      fetch(`${API_BASE_URL}/api/banners`)
        .then((res) => res.json())
        .then((data) => setBanners(data.filter((b) => b.is_active)))
        .catch((err) => console.error("Error loading banners:", err))
    }
    fetchBanners()
    const interval = setInterval(fetchBanners, 1200 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch fast running products
  useEffect(() => {
    const fetchFastProducts = () => {
      fetch(`${API_BASE_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => setFastRunningProducts(data.data.filter((p) => p.fast_running === true)))
        .catch((err) => console.error("Error loading fast running products:", err))
    }
    fetchFastProducts()
    const interval = setInterval(fetchFastProducts, 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch promocodes
  useEffect(() => {
    const fetchPromocodes = () => {
      fetch(`${API_BASE_URL}/api/promocodes`)
        .then((res) => res.json())
        .then((data) => {
          const activePromocodes = data.filter((promo) => promo.is_active !== false)
          setPromocodes(activePromocodes)
        })
        .catch((err) => console.error("Error loading promocodes:", err))
    }
    fetchPromocodes()
    const interval = setInterval(fetchPromocodes, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
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

      {/* Sketch Lightning Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <motion.button
            whileHover={{ scale: 1.15, y: -10, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLightningClick}
            className="relative bg-red-500 hover:bg-red-600 border-4 border-black shadow-2xl hover:shadow-black/50 transition-all duration-300 overflow-hidden transform rotate-3 w-20 h-20 md:w-24 md:h-24"
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="text-3xl md:text-4xl text-white"
            >
              ⚡
            </motion.div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white border-4 border-black text-black px-6 py-2 transform -rotate-3 text-sm font-black whitespace-nowrap shadow-xl">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                }}
                className="inline-block mr-2"
              >
                🎯
              </motion.div>
              <span className="font-black tracking-wider">MARUTI</span>
              <motion.div
                animate={{
                  rotate: -360,
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 },
                }}
                className="inline-block ml-2"
              >
                🔥
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Sketch Lightning Animation */}
      <SketchLightningPromoAnimation
        isActive={showLightningAnimation}
        onComplete={handleLightningComplete}
        promocodes={promocodes}
        onCopyPromo={handleCopyPromo}
        copiedPromos={copiedPromos}
      />

      <AnimatePresence>
        {showDetailsModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-black shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform rotate-1"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-black mb-2 transform -rotate-1">
                      {selectedProduct.productname}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 border-2 border-black text-white text-xs font-bold px-2 py-1 transform rotate-2">
                        {selectedProduct.discount}% OFF
                      </span>
                      <span className="text-red-500 font-black text-lg">
                        ₹{((selectedProduct.price * (100 - selectedProduct.discount)) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseDetails}
                    className="w-10 h-10 bg-red-500 border-2 border-black text-white transform rotate-45 flex items-center justify-center transition-all duration-300"
                  >
                    <span className="text-white text-xl transform -rotate-45">×</span>
                  </motion.button>
                </div>
                <SketchCarousel media={selectedProduct.image} />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-black mb-2 transform rotate-1">Description</h3>
                    <p className="text-black leading-relaxed font-medium">
                      {selectedProduct.description ||
                        "Experience the power and brilliance of premium quality fireworks crafted for unforgettable celebrations."}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, rotate: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/price-list")}
                    className="w-full bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black py-4 transform rotate-1 hover:-rotate-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Quote Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 mt-10"
      >
        <div className="max-w-7xl mx-auto">
          <SketchBannerCarousel banners={banners} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
        </div>
      </motion.section>

      {/* Fast Running Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 transform -rotate-1">Trending Explosives</h2>
            <div className="w-24 h-2 bg-red-500 border-2 border-black transform rotate-1 mx-auto mb-6" />
            <p className="text-black text-lg max-w-2xl mx-auto font-bold">
              Discover our most sought-after fireworks that deliver maximum impact and spectacular visual displays
            </p>
          </motion.div>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory">
              {fastRunningProducts.map((product, index) => {
                const originalPrice = Number.parseFloat(product.price)
                const discount = originalPrice * (product.discount / 100)
                const finalPrice = (originalPrice - discount).toFixed(2)
                return (
                  <motion.div
                    key={product.serial_number}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
                    className="group bg-white border-4 border-black border-dashed shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform rotate-1 hover:-rotate-1 min-w-[300px] max-w-[300px] snap-center"
                  >
                    <div className="relative">
                      <SketchCarousel media={product.image} />
                      <div className="absolute top-4 left-4 bg-red-500 border-2 border-black text-white text-sm font-bold px-3 py-1 transform -rotate-3 shadow-lg">
                        {product.discount}% OFF
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShowDetails(product)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black transform rotate-12 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <FaInfoCircle className="text-current" />
                      </motion.button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-black mb-3 line-clamp-2 group-hover:text-red-500 transition-colors transform -rotate-1">
                        {product.productname}
                      </h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-gray-500 line-through font-bold">₹{originalPrice}</span>
                        <span className="text-2xl font-black text-red-500">₹{finalPrice}</span>
                        <span className="text-sm text-black font-bold">/ {product.per}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02, rotate: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/price-list")}
                        className="w-full bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black py-3 transform rotate-1 hover:-rotate-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        Get Quote
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl border-4 border-black border-dashed bg-white transform rotate-2">
                <img
                  src={about || "/placeholder.svg"}
                  alt="Maruti Crackers"
                  className="w-full h-96 object-cover hover:scale-105 transition-transform duration-700 filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black/20 transform rotate-45 opacity-20 -z-10" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-black mb-6 transform -rotate-1">
                  Welcome to <span className="text-red-500 transform rotate-1 inline-block">Maruti Crackers</span>
                </h2>
                <div className="w-20 h-2 bg-red-500 border-2 border-black transform rotate-2 mb-8" />
              </div>
              <div className="space-y-6 text-lg text-black leading-relaxed font-bold">
                <p className="transform rotate-1">
                  Maruti Crackers stands as the premier destination for explosive entertainment in Sivakasi. Our journey
                  began with a vision to revolutionize the fireworks industry through innovation and excellence.
                </p>
                <p className="transform -rotate-1">
                  We specialize in manufacturing high-performance fireworks that deliver breathtaking displays,
                  combining traditional craftsmanship with cutting-edge technology to create unforgettable moments.
                </p>
                <p className="transform rotate-1">
                  As industry leaders, we maintain the highest safety standards while providing competitive pricing,
                  making us the trusted choice for celebrations across the nation.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/about-us")}
                className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-8 py-4 transform rotate-1 hover:-rotate-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                Discover Our Story
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 transform rotate-1">Explosive Categories</h2>
            <div className="w-24 h-2 bg-red-500 border-2 border-black transform -rotate-1 mx-auto mb-6" />
            <p className="text-black text-lg max-w-2xl mx-auto font-bold">
              Explore our comprehensive range of professional-grade fireworks designed for maximum impact and safety
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(({ name, icon: Icon, description, sketch }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02, rotate: idx % 2 === 0 ? 2 : -2 }}
                className="group bg-white border-4 border-black border-dashed p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-500 text-center transform rotate-1 hover:-rotate-1"
              >
                <div className="w-20 h-20 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:-rotate-45 transition-transform duration-500">
                  <Icon className="w-10 h-10 text-white transform -rotate-45" />
                </div>
                <h3 className="text-2xl font-black text-black mb-4 group-hover:text-red-500 transition-colors transform -rotate-1">
                  {name}
                </h3>
                <p className="text-black mb-6 leading-relaxed font-bold transform rotate-1">{description}</p>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/price-list")}
                  className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-6 py-3 transform rotate-1 hover:-rotate-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  Explore Range
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-black mb-6 transform -rotate-1">
              Ignite Your Celebrations
            </h2>
            <p className="text-xl text-black mb-8 leading-relaxed max-w-2xl mx-auto font-bold transform rotate-1">
              Experience the power of premium fireworks with exclusive discounts. Transform your events into spectacular
              shows that leave lasting memories.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/price-list")}
              className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-12 py-4 text-lg transition-all duration-300 shadow-2xl hover:shadow-black/25 flex items-center gap-3 mx-auto transform rotate-1 hover:-rotate-1"
            >
              Get Your Quote
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
        {/* Sketch decorative elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-black transform rotate-45 opacity-60" />
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-red-500 transform rotate-45 opacity-40" />
        <div className="absolute top-40 right-40 w-3 h-3 bg-black transform rotate-45 opacity-50" />
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 transform rotate-1">Our Legacy</h2>
            <div className="w-24 h-2 bg-red-500 border-2 border-black transform -rotate-1 mx-auto mb-6" />
            <p className="text-black text-lg max-w-2xl mx-auto font-bold">
              Decades of excellence reflected in numbers that showcase our commitment to quality and customer
              satisfaction
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, i) => (
              <SketchStatCard key={i} {...stat} delay={i * 0.2} />
            ))}
          </div>
        </div>
      </section>

      {/* Sketch Footer */}
      <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 border-t-4 border-red-500 relative">
        <div className="absolute inset-0 bg-red-500/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black mb-6 text-red-500 transform -rotate-1">Maruti Crackers</h3>
              <p className="text-white leading-relaxed mb-6 font-bold">
                Leading manufacturer of premium fireworks, delivering explosive entertainment with unmatched quality and
                safety standards. Our products are engineered for maximum impact and customer satisfaction.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/about-us")}
                className="bg-red-500 hover:bg-red-600 border-4 border-white text-white font-black px-6 py-3 transform rotate-1 hover:-rotate-1 transition-all duration-300 flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black mb-6 text-red-500 transform rotate-1">Contact Information</h3>
              <div className="space-y-4 text-white font-bold">
                <div>
                  <h4 className="font-black text-white mb-2">Manufacturing Unit</h4>
                  <p>
                    Maruti Crackers Industries
                    <br />
                    Industrial Estate, Sivakasi
                    <br />
                    Tamil Nadu - 626123
                  </p>
                  <div className="mt-5">
                    <p className="text-white font-black">Corporate Office</p>
                    <p className="text-white mt-2">
                      Maruti Business Center
                      <br />
                      Commercial Complex, Sivakasi
                      <br />
                      Tamil Nadu - 626124
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-white mb-2">Phone</h4>
                  <a href="tel:+919487524689" className="text-white hover:text-red-500 transition-colors block">
                    +91 94875 24689
                  </a>
                  <a href="tel:+919497594689" className="text-white hover:text-red-500 transition-colors block">
                    +91 94975 94689
                  </a>
                </div>
                <div>
                  <h4 className="font-black text-white mb-2">Email</h4>
                  <a href="mailto:info@maruticrackers.com" className="text-white hover:text-red-500 transition-colors">
                    info@maruticrackers.com
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black mb-6 text-red-500 transform -rotate-1">Quick Navigation</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link}>
                    <a
                      href={link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`}
                      className="text-white hover:text-red-500 transition-colors duration-300 font-bold flex items-center gap-2 group transform hover:rotate-1"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="border-t-4 border-red-500 pt-8">
            <div className="text-center text-white">
              <p className="mb-4 leading-relaxed font-bold">
                As per 2018 Supreme Court regulations, online sales of firecrackers are restricted. We respect all legal
                guidelines and offer consultation services. Add products to your inquiry list and we'll respond within
                24 hours with detailed quotations.
              </p>
              <p className="font-black">
                Copyright © 2025 <span className="text-red-500 font-black">Maruti Crackers</span>. All rights reserved.
                Developed by <span className="text-red-500 font-black">Tech Innovations</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
