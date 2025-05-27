
import React, { createContext, useState, useContext, useEffect } from 'react';
import { storageService } from '@/services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tempAuthData, setTempAuthData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedUsers = storageService.getUsers();
    setUsers(loadedUsers);
    const activeUserPhone = storageService.getActiveUser();
    if (activeUserPhone) {
      const user = loadedUsers.find(u => u.phone === activeUserPhone);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (phone, password) => {
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser(user);
      storageService.setActiveUser(user.phone);
      return user;
    }
    throw new Error("Numéro de téléphone ou mot de passe incorrect.");
  };

  const signup = (userData) => { 
    if (users.find(u => u.phone === userData.phone)) {
      throw new Error("Un utilisateur avec ce numéro de téléphone existe déjà.");
    }
    // Initialize balance to a higher value for new users for easier testing
    const newUser = { ...userData, balance: 50000 }; // Initial balance set to 50,000 XOF
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);
    
    setCurrentUser(newUser); 
    storageService.setActiveUser(newUser.phone); 
    
    setTempAuthData(null); 
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.clearActiveUser();
  };

  const updateUserBalance = (phone, newBalance) => {
    const updatedUsers = users.map(u => 
      u.phone === phone ? { ...u, balance: parseFloat(newBalance.toFixed(2)) } : u // Ensure balance is a number with 2 decimal places
    );
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);
    if (currentUser && currentUser.phone === phone) {
      setCurrentUser(prev => ({ ...prev, balance: parseFloat(newBalance.toFixed(2)) }));
    }
  };
  
  const findUserByPhone = (phone) => {
    return users.find(u => u.phone === phone);
  };

  const value = {
    currentUser,
    users,
    isLoading,
    login,
    signup,
    logout,
    updateUserBalance,
    tempAuthData,
    setTempAuthData,
    findUserByPhone
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800"><p className="text-white text-xl">Chargement de votre univers Wave...</p></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
