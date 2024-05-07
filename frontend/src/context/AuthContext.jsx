import { useState, createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  // console.log("inside useAuthContext");
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );
  // console.log("inside AuthContextprovider",authUser);
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
