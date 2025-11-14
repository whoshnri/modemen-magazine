"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <AnimatePresence mode="wait">
      {" "}
      <motion.div
        className="fixed inset-0 z-50 bg-black-primary flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest text-gold-primary mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          MODEMEN
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
}
