import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types";
import { userLocalStorage } from "../constants";

// Define the context type for better type safety
// Define the context type for better type safety
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a type assertion for the initial value
const UserContext = createContext<UserContextType>({} as UserContextType);

// Define the props for the provider component
interface UserProviderProps {
  children: ReactNode;
}

// The provider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem(userLocalStorage);
      if (loggedUserJSON) {
        const parsedUser = JSON.parse(loggedUserJSON);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to retrieve user:", error);
    }

    setIsLoading(false); // Set loading to false regardless of the outcome
  }, []);

  const logout = () => {
    setUser(null);
    // More comprehensive logout handling can be added here
    window.localStorage.removeItem(userLocalStorage);
  };

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({ user, setUser, logout, isLoading }),
    [user]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Export the useUserContext hook for consuming the context
export const useUserContext = () => useContext(UserContext);
