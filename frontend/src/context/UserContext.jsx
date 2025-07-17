import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(); // ✅ define

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/currentUser", {
        withCredentials: true,
      });
      setCurrentUser(res.data.user);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const isAuthenticated = !!currentUser;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading, fetchCurrentUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
