import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface FamilyMember {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  username: string;
  isAdmin: boolean | null;
}

interface AuthContextType {
  user: FamilyMember | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('familyMember');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.member);
          localStorage.setItem('familyMember', JSON.stringify(data.member));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('familyMember');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}