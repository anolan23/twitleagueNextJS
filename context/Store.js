import { createContext, useContext, useMemo, useReducer } from "react";
import reducers from "../reducers/combineReducers";

const StoreContext = createContext();

const INITIAL_STATE = {};

export const TwitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducers, INITIAL_STATE);
  const store = useMemo(() => [state, dispatch], [state]);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  return store;
};
