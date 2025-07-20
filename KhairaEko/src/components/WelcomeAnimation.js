import { motion } from 'framer-motion';

export default function WelcomeAnimation() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#FF8FAB]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 120
          }}
        >
          Welcome Khaira!
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8"
        >
          <div className="w-16 h-16 mx-auto border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}