import React, { createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    token: string | null;
    userId: string | null; // Add userId to the context type
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    userId: null, // Default userId to null
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setUserId(decodedToken.id); // Assuming the user ID is in the 'id' field of the decoded token
            } catch (error) {
                console.error("Failed to decode token:", error);
                setToken(null);
                localStorage.removeItem("token");
            }
        }
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        try {
            const decodedToken: any = jwtDecode(newToken);
            setUserId(decodedToken.id);
        } catch (error) {
            console.error("Failed to decode new token on login:", error);
            setUserId(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUserId(null); // Clear userId on logout
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
