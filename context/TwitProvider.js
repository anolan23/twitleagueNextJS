import { useState, createContext, useContext } from "react";

const Context = createContext();

export const TwitProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState("testing global state");
  return (
    <Context.Provider value={{ globalState, setGlobalState }}>
      {children}
    </Context.Provider>
  );
};

export const useGlobalState = () => useContext(Context);
