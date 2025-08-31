
import { createContext, useState, useContext } from "react";
import { fetchContractsFromAPI } from "../services/contractUtils";
import { BACKEND_URL } from "@env";
import { createContract, updateContract } from "../services/contractUtils";

const GlobalContractsContext = createContext();

export const GlobalContractsProvider = ({ children }) => {
  const [contractsArray, setContractsArray] = useState([]);

  const addItem = (item) => {
    setContractsArray((prev) => [...prev, item]);
  };

  const removeItemById = (id) => {
    setContractsArray((prev) => prev.filter((obj) => obj.id !== id));
  };

  const editItemById = (id, updatedFields) => {
    setContractsArray((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updatedFields } : obj))
    );
  };
  const loadContractsFromAPI = async (id) => {
    return await fetchContractsFromAPI(BACKEND_URL, setContractsArray, id);
  };

  const addContractFromAPI = async (contractData, setError) => {
    return await createContract(BACKEND_URL, addItem, contractData, setError);
  };

  const editContractFromAPI = async (contractId, contractData) => {
    await updateContract(BACKEND_URL, contractId, contractData);
  }

  return (
    <GlobalContractsContext.Provider
      value={{
        contractsArray,
        addItem,
        removeItemById,
        editItemById,
        loadContractsFromAPI,
        addContractFromAPI,
        editContractFromAPI
      }}
    >
      {children}
    </GlobalContractsContext.Provider>
  );
};

export const useContractsArray = () => useContext(GlobalContractsContext);
