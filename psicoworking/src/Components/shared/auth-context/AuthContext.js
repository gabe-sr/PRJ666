import { createContext } from "react";

// Create context
const AuthContext = createContext({
  isAuth: false,
  setAuth: () => {},
});

export default AuthContext;
