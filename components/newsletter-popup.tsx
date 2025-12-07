"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNewsletter } from "@/app/actions/cms/newsletter";

export function NewsletterPopup({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email) {
      startTransition(async () => {
        const result = await subscribeToNewsletter(email);

        if (result.error) {
          setError(result.error);
        } else {
          setSubmitted(true);
          localStorage.setItem("newsletter-dismissed", "true");
          setTimeout(() => {
            setIsVisible(false);
          }, 3000);
        }
      });
    }
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    localStorage.setItem("remind-later", "true");
    localStorage.setItem(
      "show-again-timestamp",
      (Date.now() + 24 * 60 * 60 * 1000).toString()
    );
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("newsletter-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black-primary/10 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-black-secondary border border-border max-w-md w-full max-h-[90vh] shadow-lg relative overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
            >
              ×
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold tracking-widest mb-3">
                Never Lose Touch!{" "}
              </h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to Mode Men Mag for exclusive style tips, insider
                fashion trends, and curated luxury lifestyle content delivered
                directly to your inbox.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <p className="text-gold-primary font-bold text-lg mb-2">
                    Thank you!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check your email for exclusive offers
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL"
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-black-primary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm uppercase tracking-widest disabled:opacity-50"
                      required
                    />
                    {error && (
                      <p className="text-red-500 text-[10px] mt-2 uppercase tracking-wide">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-4 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "SUBSCRIBING..." : "SUBSCRIBE"}
                  </button>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                    By subscribing, you agree to our Privacy Policy and consent
                    to receive updates from our team.
                  </p>
                </form>
              )}

              {!submitted && (
                <button
                  onClick={handleRemindLater}
                  className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Remind me later
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
