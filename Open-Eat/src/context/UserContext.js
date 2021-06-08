import React, { createContext, useEffect, useState } from "react";
import { auth, generateUserDocument } from "../firebase";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      const user = await generateUserDocument(userAuth);
      setUser(user);
      if (user){
        localStorage.setItem('authUser', JSON.stringify(user));
      }else{
        localStorage.removeItem('authUser');
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
