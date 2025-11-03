// Example for authentication context with localStorage
import { createContext, useState, useEffect } from 'react';

// interface User {
//   id: number;
//   email: string;
//   display_name: string;
//   created_date: string;
// }

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (username: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState(() => {
    const username = localStorage.getItem('chat_username');
    return username || ""; // Convert string to boolean
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    return storedStatus === 'true'; // Convert string to boolean
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    localStorage.setItem('chat_username', username || "");
  }, [isLoggedIn, username]);

  const login = (newUsername: string) => { 
    setIsLoggedIn(true), 
    setUsername(newUsername); 
  }; // Ensure username is not null
  
  const logout = () => {
    setIsLoggedIn(false),
    setUsername("");
    localStorage.removeItem("chat_username");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
