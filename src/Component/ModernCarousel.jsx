"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { Sparkles } from "lucide-react"
import { useSwipeable } from "react-swipeable"

const ModernCarousel = ({ media, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const mediaItems = useMemo(() => {
    // Parse media if it's a JSON string, or use as is if it's an array
    const items = media && typeof media === "string" ? JSON.parse(media) : Array.isArray(media) ? media : []
    return items.sort((a, b) => {
      const aStr = typeof a === "string" ? a.toLowerCase() : ""
      const bStr = typeof b === "string" ? b.toLowerCase() : ""
      // Check for Cloudinary video URLs (containing '/video/' or specific extensions)
      const isAVideo =
        aStr.includes("/video/") || aStr.endsWith(".mp4") || aStr.endsWith(".webm") || aStr.endsWith(".ogg")
      const isBVideo =
        bStr.includes("/video/") || bStr.endsWith(".mp4") || bStr.endsWith(".webm") || bStr.endsWith(".ogg")
      // Check for GIFs (by extension or URL pattern)
      const isAGif = aStr.endsWith(".gif")
      const isBGif = bStr.endsWith(".gif")
      // Images are anything else (typically .jpg, .jpeg, .png)
      const isAImage = !isAVideo && !isAGif
      const isBImage = !isBVideo && !isBGif
      // Sort: Images first (0), GIFs second (1), Videos third (2)
      return (isAImage ? 0 : isAGif ? 1 : isAVideo ? 2 : 3) - (isBImage ? 0 : isBGif ? 1 : isBVideo ? 2 : 3)
    })
  }, [media])

  const isVideo = (item) => {
    // Check if the item is a string and contains Cloudinary video URL pattern or video extensions
    return (
      typeof item === "string" &&
      (item.includes("/video/") ||
        item.toLowerCase().endsWith(".mp4") ||
        item.toLowerCase().endsWith(".webm") ||
        item.toLowerCase().endsWith(".ogg"))
    )
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1)),
    onSwipedRight: () => setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    trackTouch: true,
  })

  if (!mediaItems.length) {
    return (
      <div className="w-full h-48 mb-4 overflow-hidden bg-white border-4 border-black border-dashed flex items-center justify-center transform rotate-1 shadow-lg">
        <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
        <div className="text-center relative z-10">
          <div className="w-12 h-12 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-6 h-6 text-white transform -rotate-45" />
          </div>
          <p className="text-black font-black text-sm transform -rotate-1">No media available</p>
        </div>
        {/* Sketch decorative corners */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
      </div>
    )
  }

  return (
    <div
      {...handlers}
      className="relative w-full h-48 mb-4 overflow-hidden group bg-white border-4 border-black border-dashed cursor-pointer transform rotate-1 hover:-rotate-1 transition-all duration-300 shadow-lg"
      onClick={() => onImageClick && onImageClick(media)}
    >
      <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-30"></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-10"
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
              src={mediaItems[currentIndex] || "/placeholder.svg?height=192&width=300&query=firecracker"}
              alt="Product"
              className="w-full h-full object-cover filter contrast-110"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=192&width=300"
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {mediaItems.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-black transform rotate-12 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
          >
            <FaArrowLeft className="text-black text-sm" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-black transform -rotate-12 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
          >
            <FaArrowRight className="text-black text-sm" />
          </motion.button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {mediaItems.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.3, rotate: 45 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 border-2 border-black transform rotate-45 transition-all ${
                  index === currentIndex ? "bg-red-500" : "bg-white hover:bg-gray-200"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Sketch decorative corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
    </div>
  )
}

export default ModernCarousel
