import React from "react";
import { GlobalClientsProvider } from "./ClientsContext";
import { GlobalContractsProvider } from "./ContractsContext";
import { GlobalPaymentsProvider } from "./PaymentsContext";
import { GlobalMovementsProvider } from "./MovementsContext";
import { UserProvider } from "./UserContext";

export const RootProvider = ({ children }) => {
  return (
    <GlobalMovementsProvider>
      <GlobalClientsProvider>
        <GlobalContractsProvider>
          <GlobalPaymentsProvider>
            <UserProvider>{children}</UserProvider>
          </GlobalPaymentsProvider>
        </GlobalContractsProvider>
      </GlobalClientsProvider>
    </GlobalMovementsProvider>
  );
};
