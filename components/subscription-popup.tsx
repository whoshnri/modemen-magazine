import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubscriptionPlans } from "./subscription-plans";

interface SubscriptionPopupProps {
    isVisible: boolean;
    onClose: () => void;
    defaultTab?: "PREMIUM" | "VIP";
    trigger: "ARTICLE" | "PAGE"
}

export function SubscriptionPopup({ isVisible, onClose, defaultTab = "PREMIUM", trigger }: SubscriptionPopupProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 ">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black-primary/20 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            scrollbarWidth : "none"
                        }}
                        className="relative w-full max-w-2xl h-[80vh] overflow-y-auto border border-gold-primary/30"
                    >
                        <SubscriptionPlans defaultTab={defaultTab} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
