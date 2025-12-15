"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import loaderimg from "../public/loader.svg";
import Image from "next/image";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we've already shown the loader today
    const lastShown = localStorage.getItem("page-loader-last-shown");
    const today = new Date().toDateString();

    if (lastShown === today) {
      setIsLoading(false);
      return;
    }

    // If not shown today, set the flag and start the timer
    localStorage.setItem("page-loader-last-shown", today);
    const timer = setTimeout(() => setIsLoading(false), 3200);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-100 bg-black-primary flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          transition: {
            duration: 1.2,
            ease: "easeInOut",
          },
        }}
      >
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Image src={loaderimg} alt="Loading..." className="max-w-[90vw] max-h-[60vh]" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
