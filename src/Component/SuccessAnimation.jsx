"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const SuccessAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm"
    style={{
      backgroundImage: `
        linear-gradient(90deg, #00000005 1px, transparent 1px),
        linear-gradient(#00000005 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
    }}
  >
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      className="bg-white border-4 border-black border-dashed p-8 max-w-md mx-4 text-center shadow-2xl transform rotate-1"
    >
      <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10"
      >
        <CheckCircle className="w-10 h-10 text-white transform -rotate-45" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-black text-black mb-4 transform -rotate-1 relative z-10"
      >
        Order Booked!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-black font-bold mb-6 transform rotate-1 relative z-10"
      >
        Your order has been successfully placed. We'll contact you within 24 hours.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-2 text-red-500 font-black relative z-10"
      >
        <div className="w-5 h-5 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center">
          <div className="w-2 h-2 bg-white transform rotate-45"></div>
        </div>
        <span className="font-black">Thank you for choosing Maruti Crackers!</span>
        <div className="w-5 h-5 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center">
          <div className="w-2 h-2 bg-white transform rotate-45"></div>
        </div>
      </motion.div>

      {/* Sketch decorative corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>

      {/* Floating sketch elements */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500 transform rotate-45"
          animate={{
            x: [0, Math.cos(i * 90) * 40, 0],
            y: [0, Math.sin(i * 90) * 40, 0],
            opacity: [0, 1, 0],
            rotate: [45, 225, 45],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
          style={{
            left: "50%",
            top: "50%",
          }}
        />
      ))}
    </motion.div>
  </motion.div>
)

export default SuccessAnimation