import React, { createContext, useState, useContext } from 'react';

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
      prev.map((obj) =>
        obj.id === id ? { ...obj, ...updatedFields } : obj
      )
    );
  };

  return (
    <GlobalContractsContext.Provider
      value={{
        contractsArray,
        addItem,
        removeItemById,
        editItemById
      }}
    >
      {children}
    </GlobalContractsContext.Provider>
  );
};

export const useContractsArray = () => useContext(GlobalContractsContext);
