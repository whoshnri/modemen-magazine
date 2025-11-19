"use client";

import { motion } from 'framer-motion';
import { MagazineIssue } from '@/lib/mock-data'; // Adjust path

interface MagazineIssueCardProps {
  issue: MagazineIssue;
}

export const MagazineIssueCard = ({ issue }: MagazineIssueCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden border border-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <img
        src={issue.image}
        alt={issue.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h3 className="text-3xl font-bold tracking-widest mb-2">{issue.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{issue.description}</p>
        <button className="py-3 px-6 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm">
          PURCHASE ISSUE - ${issue.price.toFixed(2)}
        </button>
      </div>
    </motion.div>
  );
};  