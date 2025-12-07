'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '@/components/toast/use-toast';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import * as Dialog from '@radix-ui/react-dialog';

import { loginUser } from '@/app/actions/auth'; // Adjust the import path as needed

// 1. Define the props for the component
interface LoginDialogProps {
  isOpen: boolean;
  header?: string;
  text?: string;
  onClose: () => void;
  onSuccess?: () => void; // Optional: Callback for when login succeeds
}

export function LoginDialog({ isOpen, header = "WELCOME", text = "Sign in to your account", onClose, onSuccess }: LoginDialogProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {fetchSession} = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginUser(email, password);

    if (result) {
      showToast('Login Successful!', 'success');
      if (onSuccess) {
        router.refresh()
        onSuccess();
      }
      onClose();
    } else {
      showToast('Login Failed! Please check your credentials.', 'error');
    }
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmail('');
      setPassword('');
      setLoading(false);
      fetchSession()
      onClose();
    }
  };

  if(!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Title className="sr-only">{header}</Dialog.Title> 
        
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <motion.div
            className="w-full"
            // We use Radix for open/close animation, so we can simplify Framer Motion
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border border-border bg-black-primary p-8 sm:p-12">
              <h1 className="text-2xl sm:text-2xl font-bold tracking-widest mb-2 text-center uppercase">{header}</h1>
              <p className="text-center text-base text-muted-foreground mb-8">{text}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">PASSWORD</label>
                  <input
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                    required
                  />
                </div>
                
                <a href="#" className="block text-right text-sm text-gold-primary hover:underline underline-offset-2 transition-colors">
                  Forgot password?
                </a>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-50"
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/signup" onClick={onClose} className="text-gold-primary hover:text-gold-secondary transition-colors">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}