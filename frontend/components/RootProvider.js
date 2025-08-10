import React from 'react';
import { GlobalClientsProvider } from "./ClientsContext";
import { GlobalContractsProvider } from "./ContractsContext";
import { GlobalMovementsProvider } from "./MovementsContext";
import { UserProvider } from "./UserContext";

export const RootProvider = ({ children }) => {
  return (
    <GlobalMovementsProvider>
      <GlobalClientsProvider>
        <GlobalContractsProvider>
          <UserProvider>{children}</UserProvider>
        </GlobalContractsProvider>
      </GlobalClientsProvider>
    </GlobalMovementsProvider>
  );
};
