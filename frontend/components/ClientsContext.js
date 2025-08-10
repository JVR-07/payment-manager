import React, { createContext, useState, useContext } from 'react';

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
      prev.map((obj) =>
        obj.id === id ? { ...obj, ...updatedFields } : obj
      )
    );
  };

  return (
    <GlobalClientsContext.Provider
      value={{
        clientArray,
        addItem,
        removeItemById,
        editItemById
      }}
    >
      {children}
    </GlobalClientsContext.Provider>
  );
};

export const useClientsArray = () => useContext(GlobalClientsContext);
