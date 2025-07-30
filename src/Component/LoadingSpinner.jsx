"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] bg-white"
      style={{
        backgroundImage: `
          linear-gradient(90deg, #00000005 1px, transparent 1px),
          linear-gradient(#00000005 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="text-center">
        {/* Sketch-style loading container */}
        <div className="relative bg-white border-4 border-black border-dashed p-8 transform rotate-2 shadow-2xl mb-8">
          <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

          {/* Sketch-style spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 relative z-10"
          >
            <div className="w-full h-full border-4 border-black border-dashed border-t-red-500 transform rotate-45"></div>
            <div className="absolute inset-2 border-2 border-red-500 border-dotted transform -rotate-45"></div>
          </motion.div>

          {/* Sketch decorative corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h2 className="text-2xl font-black text-black mb-2 transform -rotate-1">Loading Products</h2>
          <p className="text-black font-bold transform rotate-1">Please wait while we fetch the latest fireworks...</p>
        </motion.div>

        {/* Sketch-style brand section */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="flex items-center justify-center gap-2 text-black bg-white border-4 border-black border-dashed px-6 py-3 transform -rotate-1 shadow-lg"
        >
          <div className="w-6 h-6 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white transform -rotate-45" />
          </div>
          <span className="text-sm font-black">Maruti Crackers</span>
          <div className="w-6 h-6 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white transform -rotate-45" />
          </div>
        </motion.div>

        {/* Floating sketch elements */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500 transform rotate-45"
            animate={{
              x: [0, Math.cos(i * 60) * 100, 0],
              y: [0, Math.sin(i * 60) * 100, 0],
              opacity: [0, 1, 0],
              rotate: [45, 225, 45],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingSpinner
