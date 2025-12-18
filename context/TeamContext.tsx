import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface TeamContextType {
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  getUser: (id: string) => User | undefined;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsers = localStorage.getItem('growency_members');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        setUsers(Object.values(MOCK_USERS));
      }
    } else {
      const initialUsers = Object.values(MOCK_USERS);
      setUsers(initialUsers);
      localStorage.setItem('growency_members', JSON.stringify(initialUsers));
    }
    setIsLoading(false);
  }, []);

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('growency_members', JSON.stringify(updatedUsers));
  };

  const getUser = (id: string) => {
    return users.find(u => u.id === id);
  };

  return (
    <TeamContext.Provider value={{ users, updateUser, getUser, isLoading }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}