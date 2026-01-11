import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  username: string;
  role: "admin" | "staff" | "doctor";
  name: string;
  loginTime?: number;
  doctorId?: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session timeout: 2 hours (in milliseconds)
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

  // Check if session is expired
  const isSessionExpired = (loginTime: number) => {
    return Date.now() - loginTime > SESSION_TIMEOUT;
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Check if session has expired
        if (parsedUser.loginTime && isSessionExpired(parsedUser.loginTime)) {
          console.log("Session expired, logging out");
          localStorage.removeItem("auth_user");
          localStorage.removeItem("userRole");
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("userRole");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Input validation
      if (!username || !password) {
        return false;
      }

      // Fetch users from json-server on port 3003
      const response = await fetch("http://localhost:3003/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users: Array<User & { password: string }> = await response.json();

      // Find matching user
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = foundUser;

        // Add login timestamp
        const userWithTimestamp = {
          ...userWithoutPassword,
          loginTime: Date.now(),
        };

        setUser(userWithTimestamp);
        localStorage.setItem("auth_user", JSON.stringify(userWithTimestamp));

        // Sync with useUserRole hook
        localStorage.setItem("userRole", userWithTimestamp.role);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("userRole");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
