
import { ClientsProvider } from "./ClientsContext";
import { ContractsProvider } from "./ContractsContext";
import { MovementsProvider } from "./MovementsContext";
import { UsersProvider } from "./UsersContext";

export const RootProvider = ({ children }) => {
  return (
    <MovementsProvider>
      <ClientsProvider>
        <ContractsProvider>
          <UsersProvider>{children}</UsersProvider>
        </ContractsProvider>
      </ClientsProvider>
    </MovementsProvider>
  );
};
