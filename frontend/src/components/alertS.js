"use client"

import { X, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SuccessAlert({ message, handleClose }) {
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

  const bounceVariants = {
    bounce: {
      y: [0, -5, 0],
      transition: {
        duration: 0.6,
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

  const checkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
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
          className="relative bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md mx-4 h-max"
          variants={alertVariants}
          initial="hidden"
          animate={["visible", "bounce"]}
          exit="exit"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute -top-2 -left-2 bg-green-500 rounded-full p-1"
            variants={checkVariants}
            initial="hidden"
            animate="visible"
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
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
                  className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: 2, duration: 0.3, delay: 0.3 }}
                >
                  <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                </motion.div>
              </div>
              <motion.p
                className="text-green-800 font-medium text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {message}
              </motion.p>
            </motion.div>

            <motion.button
              onClick={handleClose}
              className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-green-100 transition-colors duration-200"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <X className="w-5 h-5 text-green-600" />
            </motion.button>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-lg"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            onAnimationComplete={handleClose}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
