"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

const RocketLoader = ({ onComplete }) => {
  const [stage, setStage] = useState("flying") // 'flying', 'burst', 'success'

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("burst"), 1800)
    const timer2 = setTimeout(() => setStage("success"), 2300)
    const timer3 = setTimeout(() => {
      if (onComplete) onComplete()
    }, 4800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] bg-white/95 backdrop-blur-sm"
      style={{
        backgroundImage: `
          linear-gradient(90deg, #00000005 1px, transparent 1px),
          linear-gradient(#00000005 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sketch Rocket Animation */}
        <AnimatePresence>
          {stage === "flying" && (
            <motion.div
              initial={{ y: 300, x: -200, rotate: 45 }}
              animate={{ y: 0, x: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                animate={{
                  scaleY: [1, 1.1, 1],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ duration: 0.15, repeat: 12 }}
                className="relative"
              >
                {/* Sketch-style rocket body */}
                <div className="w-4 h-20 bg-white border-4 border-black border-dashed relative transform rotate-2 shadow-lg">
                  <div className="absolute inset-1 border-2 border-red-500 border-dotted"></div>
                  {/* Rocket tip */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-red-500"></div>
                  {/* Rocket fins */}
                  <div className="absolute -bottom-2 -left-2 w-0 h-0 border-t-4 border-r-3 border-t-black border-r-transparent"></div>
                  <div className="absolute -bottom-2 -right-2 w-0 h-0 border-t-4 border-l-3 border-t-black border-l-transparent"></div>
                  {/* Sketch decorative elements */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black transform rotate-45"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 transform rotate-45"></div>
                </div>
              </motion.div>

              {/* Sketch-style flame */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1, 0] }}
                transition={{ duration: 0.2, repeat: 9 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="w-6 h-16 bg-red-500 border-2 border-black border-dashed transform rotate-1 relative">
                  <div className="absolute inset-1 bg-white opacity-30"></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-10 bg-white border border-black transform -rotate-1"></div>
                </div>
              </motion.div>

              {/* Sketch smoke trail */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 1.5],
                    y: [0, -30 - i * 8],
                    x: [0, (i % 2 === 0 ? -1 : 1) * (8 + i * 2)],
                  }}
                  transition={{
                    duration: 1,
                    repeat: 2,
                    delay: i * 0.1,
                  }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black border border-black transform rotate-45"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Paper Burst Effect */}
        <AnimatePresence>
          {stage === "burst" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-[110]"
            >
              {/* Central explosion */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 4, 3] }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 relative z-[110] shadow-2xl"
              />

              {/* Red paper pieces */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`red-paper-${i}`}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    scale: [0, 1.5, 1, 0],
                    x: Math.cos((i * 18 * Math.PI) / 180) * (120 + Math.random() * 80),
                    y: Math.sin((i * 18 * Math.PI) / 180) * (120 + Math.random() * 80) + Math.random() * 100,
                    rotate: [0, 360 + Math.random() * 360, 720],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.1 + i * 0.02,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110]"
                >
                  <div className="w-6 h-8 bg-red-500 border-2 border-black transform rotate-12 shadow-lg relative">
                    <div className="absolute inset-1 border border-black border-dashed opacity-50"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-black transform rotate-45"></div>
                  </div>
                </motion.div>
              ))}

              {/* Black paper pieces */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`black-paper-${i}`}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    scale: [0, 1.5, 1, 0],
                    x: Math.cos(((i + 10) * 18 * Math.PI) / 180) * (140 + Math.random() * 100),
                    y: Math.sin(((i + 10) * 18 * Math.PI) / 180) * (140 + Math.random() * 100) + Math.random() * 120,
                    rotate: [0, -360 - Math.random() * 360, -720],
                  }}
                  transition={{
                    duration: 2.2,
                    delay: 0.15 + i * 0.025,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110]"
                >
                  <div className="w-5 h-7 bg-black border-2 border-white transform -rotate-6 shadow-lg relative">
                    <div className="absolute inset-1 border border-white border-dashed opacity-30"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white transform rotate-45"></div>
                  </div>
                </motion.div>
              ))}

              {/* Mixed confetti pieces */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    scale: [0, 2, 1.5, 0],
                    x: Math.cos((i * 24 * Math.PI) / 180) * (100 + Math.random() * 150),
                    y: Math.sin((i * 24 * Math.PI) / 180) * (100 + Math.random() * 150) + Math.random() * 80,
                    rotate: [0, 180 + Math.random() * 360, 360],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.2 + i * 0.03,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110]"
                >
                  <div
                    className={`w-3 h-3 border-2 border-black transform rotate-45 shadow-lg ${
                      i % 2 === 0 ? "bg-red-500" : "bg-white"
                    }`}
                  >
                    <div className="absolute inset-0.5 border border-black border-dotted opacity-40"></div>
                  </div>
                </motion.div>
              ))}

              {/* Sketch-style explosion rings */}
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 8, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-red-500 border-dashed transform rotate-45 z-[110]"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 12, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-black border-dashed transform -rotate-45 z-[110]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sketch Success Message */}
        <AnimatePresence>
          {stage === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.6,
              }}
              className="text-center z-[110]"
            >
              {/* Sketch-style success container */}
              <div className="relative bg-white border-4 border-black border-dashed p-8 transform rotate-2 shadow-2xl">
                <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="w-24 h-24 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="w-12 h-12 text-white transform -rotate-45" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-4xl font-black text-black mb-4 tracking-wide transform -rotate-1 relative z-10"
                >
                  BOOKED!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-black font-bold text-lg mb-6 transform rotate-1 relative z-10"
                >
                  Your order has been successfully placed
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="flex items-center justify-center gap-3 text-red-500 text-lg font-black relative z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-6 h-6 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white transform rotate-45"></div>
                  </motion.div>
                  <span className="font-black">Thank you for choosing Maruti Crackers!</span>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-6 h-6 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white transform rotate-45"></div>
                  </motion.div>
                </motion.div>

                {/* Sketch decorative corners */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RocketLoader
