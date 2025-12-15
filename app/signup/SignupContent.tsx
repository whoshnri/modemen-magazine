'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useToast } from '@/components/toast/use-toast'
import { createUser } from '../actions/auth'
import { useRouter } from 'next/navigation'

export default function SignupContent() {
    const { showToast } = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            setLoading(false);
            return;
        } else {
            const isCreated = await createUser(
                formData.fullName,
                formData.email,
                formData.password
            );
            setLoading(false);
            if (isCreated.status === 'success') {
                showToast('Account created successfully! Please log in.', 'success');
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                router.push('/login');
            } else if (isCreated.status === 'exists') {
                showToast('An account with this email already exists.', 'error');
            } else if (isCreated.status === 'invalid_email') {
                showToast('Please enter a valid email address.', 'error');
            } else {
                showToast('An error occurred while creating the account. Please try again.', 'error');
            }
        }
    }

    return (
        <div className="min-h-screen bg-black-primary flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="border border-border p-8 sm:p-12">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest mb-2 text-center">JOIN US</h1>
                        <p className="text-center text-muted-foreground mb-8">Become a Mode Men Mag member</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">FULL NAME</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">EMAIL</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">PASSWORD</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                                    required
                                />
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 mt-1 bg-black-secondary border border-border shrink-0" required />
                                <span className="text-xs text-muted-foreground">
                                    I agree to the{' '}
                                    <a href="#" className="text-gold-primary hover:text-gold-secondary transition-colors">
                                        Terms & Conditions
                                    </a>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-50"
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/login" className="text-gold-primary hover:text-gold-secondary transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
