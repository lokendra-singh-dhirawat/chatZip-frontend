import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import axios, { type AuthTokens } from "../api/axios";
import type { JwtPayload } from "jsonwebtoken";
import apiClient from "../api/axios";

interface AuthUser {
  id: number;
  email: string;
  role: string;
}

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthTokens>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const updateAuthUser = (accessToken: string) => {
    if (accessToken) {
      try {
        const decodedUser: JwtPayload = jwtDecode(accessToken);
        setUser({
          id: decodedUser.id,
          email: decodedUser.email,
          role: decodedUser.role,
        });
      } catch (error) {
        console.error("Failed to decode access token:", error);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } else {
      setUser(null);
    }
  };
  useEffect(() => {
    console.log("AUTH_DEBUG: AuthProvider useEffect triggered.");
    const accessToken = localStorage.getItem("accessToken");
    console.log(
      "AUTH_DEBUG: Access Token from localStorage:",
      accessToken ? "Found" : "Not Found"
    );

    if (accessToken) {
      try {
        console.log("AUTH_DEBUG: Attempting to decode token...");
        updateAuthUser(accessToken);
        console.log("AUTH_DEBUG: Token decoded and user state updated.");
      } catch (error) {
        console.error(
          "AUTH_DEBUG: Error during token decode in useEffect:",
          error
        );
      }
    }

    console.log("AUTH_DEBUG: Setting loading to false.");
    setLoading(false);
  }, []);

  console.log(
    "AUTH_DEBUG: AuthProvider render, current loading state:",
    loading
  );

  const login = async (
    email: string,
    password: string
  ): Promise<AuthTokens> => {
    const responce = await axios.post<AuthTokens>("/auth/login", {
      email,
      password,
    });
    const { accessToken, refreshToken } = responce.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    updateAuthUser(accessToken);
    return responce.data;
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout API Call:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/login";
    }
  };
  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
