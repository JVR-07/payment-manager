import { createContext, useState, useContext } from "react";
import { fetchClientsFromAPI } from "../services/clientUtils";
import { BACKEND_URL } from "@env";

const GlobalClientsContext = createContext();

export const GlobalClientsProvider = ({ children }) => {
  const [clientArray, setClientArray] = useState([]);

  const addItem = (item) => {
    setClientArray((prev) => [...prev, item]);
  };

  const removeItemById = (id) => {
    setClientArray((prev) => prev.filter((obj) => obj.id !== id));
  };

  const editItemById = (id, updatedFields) => {
    setClientArray((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updatedFields } : obj))
    );
  };

  const loadClientsFromAPI = async () => {
    await fetchClientsFromAPI(BACKEND_URL, setClientArray);
  };

  return (
    <GlobalClientsContext.Provider
      value={{
        clientArray,
        addItem,
        removeItemById,
        editItemById,
        loadClientsFromAPI,
      }}
    >
      {children}
    </GlobalClientsContext.Provider>
  );
};

export const useClientsArray = () => useContext(GlobalClientsContext);
