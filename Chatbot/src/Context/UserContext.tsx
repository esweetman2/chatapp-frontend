// UserContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the user shape
interface User {
    id: number;
    email: string;
    display_name: string;
}

// Define what the context provides
interface UserContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // const isLoggedIn = !!user;

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('appUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedStatus = localStorage.getItem('isLoggedIn');
        return storedStatus === 'true'; // Convert string to boolean
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("appUser", JSON.stringify(user));
            localStorage.setItem('isLoggedIn', isLoggedIn.toString());
        } else {
            localStorage.removeItem("appUser");
            localStorage.removeItem("isLoggedIn");
        }
    }, [user]);


    // Simple "login" simulation
    const login = async (email: string) => {
        try {

            setIsLoading(true);

            const response = await fetch(`${API_BASE_URL}/login/?email=${email}`)

            if (!response.ok) {
                console.error('Network response was not ok');
                setIsLoading(false);
                return;
            }
            const data: User = await response.json();
            // ✅ Make sure you're storing the full user object
            setUser(data);
            setIsLoggedIn(true);
            localStorage.setItem('appUser', JSON.stringify(data));
            localStorage.setItem('isLoggedIn', isLoggedIn.toString());
            // setUserLoggedIn(true);

        } catch (error) {
            console.error("Login error:", error);
            setUser(null);
            setIsLoggedIn(true);
            localStorage.removeItem("appUser");
            localStorage.removeItem("isLoggedIn");
        } finally {
            setIsLoading(false);
        }


    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("appUser");
        localStorage.removeItem("isLoggedIn");
    };

    return (
        <UserContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easy access
export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};


