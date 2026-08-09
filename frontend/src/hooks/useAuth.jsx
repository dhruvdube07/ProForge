import React, { useState, useEffect, createContext, useContext } from 'react';

// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for saved token and user in localStorage on mount
    const savedToken = localStorage.getItem('pf_token');
    const savedUser = localStorage.getItem('pf_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved auth data:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Apply gender theme dynamically based on logged in user's profile
  useEffect(() => {
    if (user && user.gender) {
      if (user.gender === 'female') {
        document.documentElement.classList.add('theme-moon');
        document.documentElement.classList.remove('theme-luna', 'light');
      } else {
        document.documentElement.classList.add('theme-luna');
        document.documentElement.classList.remove('theme-moon', 'light');
      }
    }
  }, [user]);

  /**
   * Request OTP verification for a new user registration.
   */
  const signup = async (email, password, firstName, lastName, gender) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, gender })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request signup verification OTP');
      }
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Verify OTP to complete user registration.
   */
  const verifyOtp = async (email, password, otp, firstName, lastName, gender) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp, firstName, lastName, gender })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed.');
      }

      // Store in state & localStorage
      localStorage.setItem('pf_token', data.token);
      localStorage.setItem('pf_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Log in an existing user with email + password.
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      localStorage.setItem('pf_token', data.token);
      localStorage.setItem('pf_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Resend verification OTP code.
   */
  const resendOtp = async (email) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification OTP');
      }
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update the user profile details (first name, last name, gender theme).
   */
  const updateUserProfile = async (firstName, lastName, gender) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName, gender })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user profile settings.');
      }

      // Update state and local storage
      const updatedUser = {
        ...user,
        name: data.user.name,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        gender: data.user.gender
      };

      localStorage.setItem('pf_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Log out the current user.
   */
  const logout = () => {
    localStorage.removeItem('pf_token');
    localStorage.removeItem('pf_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, verifyOtp, login, resendOtp, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
