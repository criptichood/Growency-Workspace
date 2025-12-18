import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useTeam } from './TeamContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { users, updateUser, isLoading: isTeamLoading } = useTeam();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('growency_logged_in_uid');
    if (storedUserId && !isTeamLoading) {
      const foundUser = users.find(u => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    if (!isTeamLoading) {
      setIsLoading(false);
    }
  }, [isTeamLoading, users]);

  async function login(email: string) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('growency_logged_in_uid', foundUser.id);
          resolve();
        } else {
          reject(new Error('Invalid email. Try admin@, sales@, or dev@growency.com'));
        }
      }, 800);
    });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('growency_logged_in_uid');
  }

  function updateProfile(updates: Partial<User>) {
    if (!user) return;
    
    // 1. Update the master database via TeamContext
    updateUser(user.id, updates);
    
    // 2. Update local session state
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}