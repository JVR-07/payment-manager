import { createContext, useState, useContext } from "react";
import {
  fetchPaymentsFromAPI,
  verifyOverduePayments,
  createPayment,
  fetchTotalPendingPayments,
  updatePaymentsStatus,
} from "../services/paymentUtils";
import { BACKEND_URL } from "@env";

const GlobalPaymentsContext = createContext();

export const GlobalPaymentsProvider = ({ children }) => {
  const [paymentsArray, setPaymentsArray] = useState([]);

  const addItem = (item) => {
    setPaymentsArray((prev) => [...prev, item]);
  };

  const removeItemById = (id) => {
    setPaymentsArray((prev) => prev.filter((obj) => obj.id !== id));
  };

  const editItemById = (id, updatedFields) => {
    setPaymentsArray((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updatedFields } : obj))
    );
  };

  const loadPaymentsFromAPI = async (conctractId) => {
    const data = await fetchPaymentsFromAPI(
      BACKEND_URL,
      setPaymentsArray,
      conctractId
    );
    await verifyOverduePayments(BACKEND_URL, data);
    return data;
  };

  const getPaymentsFromAPI = async (contractId) => {
    return await fetchPaymentsFromAPI(
      BACKEND_URL,
      setPaymentsArray,
      contractId
    );
  };

  const addPaymentFromAPI = async (paymentData) => {
    return await createPayment(BACKEND_URL, addItem, paymentData);
  };

  const getTotalPendingPayments = async (contractId) => {
    return await fetchTotalPendingPayments(BACKEND_URL, contractId);
  };

  const editPaymentsStatus = async (contractId, updatedFields) => {
    return await updatePaymentsStatus(BACKEND_URL, contractId, updatedFields);
  };

  return (
    <GlobalPaymentsContext.Provider
      value={{
        paymentsArray,
        addItem,
        removeItemById,
        editItemById,
        loadPaymentsFromAPI,
        addPaymentFromAPI,
        getPaymentsFromAPI,
        getTotalPendingPayments,
        editPaymentsStatus,
      }}
    >
      {children}
    </GlobalPaymentsContext.Provider>
  );
};

export const usePaymentsArray = () => useContext(GlobalPaymentsContext);
