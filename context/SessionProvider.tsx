'use client';

import { getActiveUserFromCookie } from '@/app/actions/auth';
import { createContext, useState, useMemo, ReactNode } from 'react';

type UserSession = {
  id: string;
  email: string;
  name?: string | null;
};

interface SessionContextType {
  session: UserSession | null;
  isLoading: boolean;
  fetchSession : () => Promise<void>;
}


export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

interface SessionProviderProps {
  children: ReactNode;
  initialSession: UserSession | null;
}

// 4. Create the provider component
export function SessionProvider({
  children,
  initialSession,
}: SessionProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<UserSession | null>(initialSession ? initialSession : null);

  const fetchSession = async () => {
    const session = await getActiveUserFromCookie()
    if(session && session.id){
      setSession(session);
    }
    setIsLoading(false);
  }

  const value = useMemo(
    () => ({
      session,
    }),
    [session]
  );

  return (
    <SessionContext.Provider value={{...value, fetchSession, isLoading}}>{children}</SessionContext.Provider>
  );
}