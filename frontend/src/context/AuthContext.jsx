// ============================================================
// AUTH CONTEXT - Global authentication state management
// Provides login/logout/register functions to all components
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

/**
 * AuthProvider - Wraps the app to provide authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is stored in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('healthhub_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem('healthhub_user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    try {
      const { data } = await authAPI.register({ name, email, password });
      if (data.success) {
        const userData = data.data;
        setUser(userData);
        localStorage.setItem('healthhub_user', JSON.stringify(userData));
        toast.success(data.message || 'Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Login an existing user
   */
  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.success) {
        const userData = data.data;
        setUser(userData);
        localStorage.setItem('healthhub_user', JSON.stringify(userData));
        toast.success(data.message || 'Welcome back!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthhub_user');
    toast.success('Logged out successfully');
  };

  /**
   * Update user profile data locally
   */
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('healthhub_user', JSON.stringify(newUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - Custom hook to access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
