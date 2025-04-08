'use client'

import { useEffect, useState } from 'react';
import { ThemeProvider } from '../../next-theme';
import { getAccessToken } from '../api/auth';
import './global.css';
import LoginForm from './LoginForm';
import { Notes } from './Notes';
import './style.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if tokens exist in storage
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
          return;
        }

        // Verify token validity
        const token = getAccessToken();

        if (token) {
          setIsAuthenticated(true);
        } else {
          return;
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <div className="relative flex items-center justify-center w-full m-auto p-16 bg-background text-foreground">
        <div className="absolute lab-bg inset-0 size-full">
          <div className="absolute inset-0 bg-[radial-gradient(#00000021_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff22_1px,transparent_1px)]"></div>
        </div>

        <div className="flex w-full justify-center relative">
          {isAuthenticated ? <Notes authExpired={() => setIsAuthenticated(false)} /> : <LoginForm onAuthSuccess={() => setIsAuthenticated(true)} />}
        </div>
      </div>
    </ThemeProvider>
  );
}
