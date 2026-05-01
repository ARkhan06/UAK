import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');

    if (storedUser && storedUser !== "undefined" && loginTime) {
      const now = new Date().getTime();
      const loginTimeMs = parseInt(loginTime);
      const threeHoursMs = 3 * 60 * 60 * 1000; // 3 hours

      // Check if session expired
      if (now - loginTimeMs > threeHoursMs) {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        setUser(null);
        setIsAuthenticated(false);
      } else {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid user data in localStorage:", storedUser);
          localStorage.removeItem('user');
          localStorage.removeItem('loginTime');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    }

    setIsLoading(false);
  }, []);

  // Auto logout timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return;

    const now = new Date().getTime();
    const loginTimeMs = parseInt(loginTime);
    const threeHoursMs = 3 * 60 * 60 * 1000;
    const timeElapsed = now - loginTimeMs;
    const timeRemaining = threeHoursMs - timeElapsed;

    if (timeRemaining <= 0) {
      logout();
      return;
    }

    const logoutTimer = setTimeout(() => {
      logout();
    }, timeRemaining);

    return () => clearTimeout(logoutTimer);
  }, [isAuthenticated]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData)); // ✅ always stringify
    localStorage.setItem('loginTime', new Date().getTime().toString());
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    // Keep guest session if user logs out - they might want to check guest bookings
    // Only clear on account creation or manual clear
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};