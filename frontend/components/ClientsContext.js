import { createContext, useState, useContext } from "react";
import { createClientWithAPI, fetchClientsFromAPI, updateClientWithAPI } from "../services/clientUtils";
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

  const addClientWithAPI = async (clientData, setErrorMessage) => {
    await createClientWithAPI(BACKEND_URL, clientData, setErrorMessage);
  }

  const editClientWithAPI = async (clientId, clientData, setErrorMessage) => {
    await updateClientWithAPI(BACKEND_URL, clientId, clientData, setErrorMessage);
  };

  return (
    <GlobalClientsContext.Provider
      value={{
        clientArray,
        addItem,
        removeItemById,
        editItemById,
        loadClientsFromAPI,
        addClientWithAPI,
        editClientWithAPI
      }}
    >
      {children}
    </GlobalClientsContext.Provider>
  );
};

export const useClientsArray = () => useContext(GlobalClientsContext);
