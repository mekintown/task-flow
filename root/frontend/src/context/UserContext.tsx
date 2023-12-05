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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(userLocalStorage);
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON);
      // Only update state if user has changed
      if (!user || user.id !== parsedUser.id) {
        setUser(parsedUser);
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    // More comprehensive logout handling can be added here
    window.localStorage.removeItem(userLocalStorage);
  };

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = React.useMemo(() => ({ user, setUser, logout }), [user]);
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Export the useUserContext hook for consuming the context
export const useUserContext = () => useContext(UserContext);
