"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
    targetDate: string; // ISO format or date string
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const calculateTimeLeft = (target: string): TimeLeft => {
    const difference = +new Date(target) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return timeLeft;
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!hasMounted) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <motion.div
                        key={value}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl sm:text-7xl md:text-8xl font-bold text-white font-mono tracking-tighter"
                    >
                        {value.toString().padStart(2, "0")}
                    </motion.div>
                    <span className="text-sm md:text-base text-gold-primary uppercase tracking-[0.3em] font-light mt-4">
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}
