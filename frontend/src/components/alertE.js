"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AlertEchec({ message, handleErreur }) {
  const alertVariants = {
    hidden: {
      opacity: 0,
      y: -100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const shakeVariants = {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 90,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.9,
      transition: {
        duration: 0.1,
      },
    },
  }

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-x-0 top-0 z-80 flex items-start justify-center pt-4"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="alert-erreur relative bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md mx-4"
          variants={alertVariants}
          initial="hidden"
          animate={["visible", "shake"]}
          exit="exit"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute -top-2 -left-2 bg-red-500 rounded-full p-1"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <div className="w-3 h-3 bg-white rounded-full" />
          </motion.div>

          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex-shrink-0">
                <motion.div
                  className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: 2, duration: 0.3, delay: 0.3 }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </motion.div>
              </div>
              <motion.p
                className="text-red-800 font-medium text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {message}
              </motion.p>
            </motion.div>

            <motion.button
              onClick={handleErreur}
              className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <X className="w-5 h-5 text-red-600" />
            </motion.button>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-red-500 rounded-b-lg"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            onAnimationComplete={handleErreur}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
