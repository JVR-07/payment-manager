import React, { createContext, useState, useContext } from 'react';
import { runMovementsSync } from '../services/movementsUtils'

const GlobalMovementsContext = createContext();

export const GlobalMovementsProvider = ({ children }) => {
  const [movementArray, setMovementArray] = useState([]);

  const addItem = (item) => {
    setMovementArray((prev) => [...prev, item]);
  };

  const removeItemById = (id) => {
    setMovementArray((prev) => prev.filter((obj) => obj.id !== id));
  };

  const editItemById = (id, updatedFields) => {
    setMovementArray((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, ...updatedFields } : obj
      )
    );
  };

  const loadMovementsFromAPI = async (accessToken) => {
    await runMovementsSync(accessToken, setMovementArray);
  }

  return (
    <GlobalMovementsContext.Provider
      value={{
        movementArray,
        addItem,
        removeItemById,
        editItemById,
        loadMovementsFromAPI
      }}
    >
      {children}
    </GlobalMovementsContext.Provider>
  );
};

export const useMovementsArray = () => useContext(GlobalMovementsContext);
