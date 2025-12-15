import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

function ContactOptions({ isVisible, setIsVisible }: { isVisible: boolean, setIsVisible: (isVisible: boolean) => void }) {
    return (
        
            <AnimatePresence mode='wait'>
            {isVisible && (
                <div
                onClick={() => setIsVisible(false)}
                 className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                     onClick={(e) => e.stopPropagation()} className='bg-black-secondary border border-border p-6 w-[400px] max-w-[90%] shadow-lg'>
                        <h1 className='text-2xl font-bold tracking-widest text-center mb-6 uppercase'>Contact Options</h1>
                        <p className='text-center text-muted-foreground mb-8'>Choose one of the options below to order this item</p>
                        <div className='flex flex-col items-center justify-center gap-4'>
                            <button className='px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest uppercase hover:bg-gold-secondary transition-colors w-full flex items-center justify-center'>
                                <FaWhatsapp className="mr-3 text-xl" />
                                Chat On Whatsapp
                            </button>
                            <button className='px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest uppercase hover:bg-gold-secondary transition-colors w-full flex items-center justify-center'>
                                <MdEmail className="mr-3 text-xl" />
                                Email Us
                            </button>
                        </div>
                        
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default ContactOptions