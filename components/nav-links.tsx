"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function NavLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const links = [
    {
      label: "Style",
      href: "/articles/style",
      subItems: [
        { label: "Fashion", href: "/articles/style?sub=FASHION" },
        { label: "Watches & Accessories", href: "/articles/style?sub=WATCHES_AND_ACCESSORIES" },
        { label: "Grooming & Wellness", href: "/articles/style?sub=GROOMING_AND_WELLNESS" },
      ],
    },
    {
      label: "Culture",
      href: "/articles/culture",
      subItems: [
        { label: "Entertainment", href: "/articles/culture?sub=ENTERTAINMENT" },
        { label: "People & Profiles", href: "/articles/culture?sub=PEOPLE_AND_PROFILES" },
      ],
    },
    {
      label: "Business & Money",
      href: "/articles/business_and_money",
      subItems: [
        { label: "Leadership & Entrepreneurship", href: "/articles/business_and_money?sub=LEADERSHIP_AND_ENTREPRENEURSHIP" },
        { label: "Wealth", href: "/articles/business_and_money?sub=WEALTH" },
        { label: "Work & Careers", href: "/articles/business_and_money?sub=WORK_AND_CAREERS" },
      ],
    },
    {
      label: "Shop",
      href: "/shop",
      subItems: [
        { label: "Editor's Picks", href: "/shop#editors-picks" },
        { label: "Gift Guide", href: "/shop#gift-guide" },
        { label: "Brand Collaborations", href: "/shop#brand-collaborations" },
      ],
    },
    { label: "Interviews", href: "/interviews" },
    { label: "Events", href: "/events" },
    { label: "Advertise", href: "/advertise" },
  ];

  return (
    <nav className="flex items-center gap-8 lg:gap-12" onMouseLeave={() => setHoveredIndex(null)}>
      {links.map((link, index) => (
        <div
          key={link.label}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(index)}
        >
          <Link
            href={link.href}
            className="flex items-center gap-1 text-xs  tracking-widest text-foreground hover:text-gold-primary transition-colors duration-300 uppercase py-4"
          >
            {link.label}
            {link.subItems && (
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${hoveredIndex === index ? "rotate-180" : ""}`} />
            )}
          </Link>

          <AnimatePresence>
            {hoveredIndex === index && link.subItems && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 min-w-[200px]"
              >
                <div className="bg-black-primary border border-border p-4 shadow-2xl flex flex-col gap-2">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-black-primary w-0 h-0"></div>
                  {link.subItems.map((subLink) => (
                    <Link
                      key={subLink.label}
                      href={subLink.href}
                      className="text-xs text-start text-muted-foreground hover:text-gold-primary transition-colors duration-200 uppercase tracking-wider block py-1"
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}
