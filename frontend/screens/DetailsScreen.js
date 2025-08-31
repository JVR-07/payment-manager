import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { useContractsArray } from "../components/ContractsContext";
import { usePaymentsArray } from "../components/PaymentsContext";
import ErrorCard from "../components/ErrorCard";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";

export default function DetailsScreen({ route }) {
  const { client } = route.params;
  const {
    contractsArray,
    loadContractsFromAPI,
    addContractFromAPI,
    editContractFromAPI,
    editItemById,
  } = useContractsArray();
  const { addPaymentFromAPI, getTotalPendingPayments, editPaymentsStatus } = usePaymentsArray();
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalContractId, setModalContractId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [addContractErrors, setAddContractErrors] = useState({
    _firstPaymentDate: false,
    _totalPayments: false,
    _totalAmount: false,
  });

  const [firstPaymentDate, setFirstPaymentDate] = useState(new Date());
  const [totalPayments, setTotalPayments] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    async function run() {
      setLoading(true);
      let loadedContracts = await loadContractsFromAPI(client.id);
      const activeContract = loadedContracts.find((c) => c.status === "active");
      loadedContracts = await handleCountPendingPayments(
        activeContract,
        loadedContracts
      );
      await VerifyContractsStatus(loadedContracts);
      setLoading(false);
    }
    run();
  }, []);

  async function VerifyContractsStatus(contracts) {
    if(!contracts) return
    if (contracts.length <= 0) return;
    if (contracts.some((c) => c.status === "active")) return;
    const newActiveContract = contracts.find((c) => c.status === "inactive");
    if(!newActiveContract) return;
    const updatedData = {
      status: "active",
    };
    await editPaymentsStatus(newActiveContract.id, {status: "Pending"});
    await editContractFromAPI(newActiveContract.id, updatedData);
    await editItemById(newActiveContract.id, updatedData);
  }

  async function handleCountPendingPayments(contract, contracts) {
    if (!contract) return contracts;
    c = await getTotalPendingPayments(contract.id);
    if (c === 0) {
      const updatedData = {
        status: "paid",
      };
      await editContractFromAPI(contract.id, updatedData);
      await editItemById(contract.id, updatedData);
      return contracts.map((cItem) =>
        cItem.id === contract.id ? { ...cItem, status: "paid" } : cItem
      );
    }
  }

  const toggleExpand = (contractId) => {
    setExpanded((prev) => ({
      ...prev,
      [contractId]: !prev[contractId],
    }));
  };

  const resetModal = () => {
    setFirstPaymentDate(new Date());
    setTotalPayments("");
    setTotalAmount("");
  };

  function verifyData() {
    let newErrors = {
      _firstPaymentDate: false,
      _totalPayments: false,
      _totalAmount: false,
    };
    let hasError = false;
    let hasInvalidValue = false;

    if (!firstPaymentDate) {
      newErrors._firstPaymentDate = true;
      hasError = true;
    }
    if (!totalPayments) {
      newErrors._totalPayments = true;
      hasError = true;
    }
    if (!totalAmount) {
      newErrors._totalAmount = true;
      hasError = true;
    }

    if (hasError) {
      setAddContractErrors(newErrors);
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    const paymentsCount = parseInt(totalPayments, 10);
    const amount = parseFloat(totalAmount);
    if (isNaN(paymentsCount) || paymentsCount <= 0) {
      newErrors._totalPayments = true;
      hasInvalidValue = true;
    }
    if (isNaN(amount) || amount <= 0) {
      newErrors._totalAmount = true;
      hasInvalidValue = true;
    }
    if (hasInvalidValue) {
      setAddContractErrors(newErrors);
      setErrorMessage("Pagos y monto total deben ser números válidos");
      return;
    }
    if (paymentsCount > 32) {
      newErrors._totalPayments = true;
      setAddContractErrors(newErrors);
      setErrorMessage("La cantidad máxima de pagos es 32");
      return;
    }
  }

  const handleCreateContract = async () => {
    setLoading(true);
    setErrorMessage("");
    verifyData();

    let statusContract = "active";
    let statusPayment = "Pending";
    if (
      contractsArray.some(
        (c) => c.client_id === client.id && c.status === "active"
      )
    ) {
      statusContract = "inactive";
      statusPayment = "inactive";
    }

    let contract = null;
    try {
      contract = await addContractFromAPI(
        {
          first_payment_date: firstPaymentDate.toISOString().split("T")[0],
          total_amount: totalAmount,
          total_payments: totalPayments,
          client_id: client.id,
          status: statusContract,
        },
        setAddContractErrors
      );
    } catch (e) {
      setAddContractErrors("Error al crear el contrato");
      return;
    }
    const individualAmount = parseFloat(
      (totalAmount / totalPayments).toFixed(2)
    );
    let currentDate = new Date(firstPaymentDate);
    try {
      for (let i = 0; i < totalPayments; i++) {
        const payment = await addPaymentFromAPI({
          payment_date: currentDate.toISOString().split("T")[0],
          payment_amount: individualAmount,
          contract_id: contract.id,
          status: statusPayment,
        });
        currentDate.setDate(currentDate.getDate() + 7);
      }
    } catch (e) {
      setErrorMessage("No se pudieron crear los pagos", e);
      return;
    }

    await loadContractsFromAPI(client.id);
    setLoading(false);
    setShowModal(false);
    resetModal();
  };

  const handleDeleteContract = async (contractId) => {
    await editContractFromAPI(contractId, { status: "deleted" });
    await editItemById(contractId, { status: "deleted" });
    await loadContractsFromAPI(client.id);
    setShowDeleteModal(false);
  };

  return (
    <ScrollView style={styles.mainView} contentContainerStyle={{ padding: 15 }}>
      <View style={styles.bgView}>
        <Text style={styles.nameText}>{client.name}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{client.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{client.phone}</Text>
        </View>
        <Text style={styles.titleText}>Contratos</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#888"
            style={{ marginTop: 20 }}
          />
        ) : contractsArray.length === 0 ? (
          <Text style={{ marginTop: 10, color: "#000000ff", fontSize: 16 }}>
            No hay contratos para este cliente.
          </Text>
        ) : (
          contractsArray.map((contract, index) => (
            <View key={index} style={[styles.contractCard]}>
              <TouchableOpacity onPress={() => toggleExpand(contract.id)}>
                <View style={styles.indexContainer}>
                  <Text style={styles.indexText}>Contrato {index + 1}</Text>
                </View>

                <View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Monto total:</Text>
                    <Text style={styles.amountValue}>
                      ${contract.total_amount}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Primer pago:</Text>
                    <Text style={styles.value}>
                      {new Date(
                        contract.first_payment_date
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Pagos totales:</Text>
                    <Text style={styles.value}>{contract.total_payments}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Estatus:</Text>
                    <Text
                      style={[
                        styles.statusValue,
                        {
                          backgroundColor: getStatusBackgroundColor(
                            contract.status
                          ),
                          color: getStatusForegroundColor(contract.status),
                        },
                      ]}
                    >
                      {contract.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttonsContainer}>
                  {/* <EditButton onPress={{}} _size={30} /> */}
                  <DeleteButton
                    onPress={() => {
                      setShowDeleteModal(true);
                      setModalContractId(contract.id);
                    }}
                    _size={30}
                  />
                </View>
              </TouchableOpacity>
              {expanded[contract.id] && (
                <PaymentsList contractId={contract.id} />
              )}
            </View>
          ))
        )}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.saveButtonText}>Agregar Contrato</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowModal(false)}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 18,
                  width: "85%",
                  elevation: 5,
                  alignItems: "stretch",
                }}
                onStartShouldSetResponder={() => true}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 18,
                    textAlign: "center",
                    color: "#1A3D63",
                  }}
                >
                  Nuevo Contrato
                </Text>
                <View style={styles.detailRowAddContract}>
                  <Text style={styles.labelAddContract}>
                    Cantidad de Pagos:
                  </Text>
                  <TextInput
                    style={[
                      styles.textInputAddContract,
                      addContractErrors._totalPayments &&
                        styles.inputErrorAddContract,
                    ]}
                    value={totalPayments}
                    onChangeText={setTotalPayments}
                    placeholder="Ej: 10"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.detailRowAddContract}>
                  <Text style={styles.labelAddContract}>Monto Total:</Text>
                  <TextInput
                    style={[
                      styles.textInputAddContract,
                      addContractErrors._totalAmount &&
                        styles.inputErrorAddContract,
                    ]}
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    placeholder="Ej: 1000"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.detailRowAddContract}>
                  <Text style={styles.labelAddContract}>
                    Fecha del primer pago:
                  </Text>
                  <input
                    type="date"
                    value={firstPaymentDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFirstPaymentDate(new Date(e.target.value))
                    }
                    style={{
                      marginVertical: 10,
                      padding: 8,
                      borderRadius: 0,
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      width: "100%",
                      marginBottom: 10,
                      ...(addContractErrors._firstPaymentDate && {
                        borderColor: "#1A3D63",
                      }),
                    }}
                  />
                </View>
                {errorMessage !== "" && <ErrorCard message={errorMessage} />}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleCreateContract}
                >
                  <Text style={styles.saveButtonText}>Crear contrato</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowDeleteModal(false)}
          >
            <View style={styles.card}>
              <Text style={styles.titleDeleteModal}>Eliminar Contrato</Text>
              <Text style={styles.labelDeleteModal}>
                ¿Está seguro que quiere eliminar el contrato?
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleDeleteContract(modalContractId)}
              >
                <Text style={styles.saveButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
    </ScrollView>
  );
}

function getStatusForegroundColor(status) {
  if (status === "Pending") return "#7a7a7aff";
  if (status === "Paid") return "#3fdb3fff";
  if (status === "Overdue") return "#F10303";
  if (status === "inactive") return "#fcc44aff";
  if (status === "active") return "#348df3ff";
}
function getStatusBackgroundColor(status) {
  if (status === "Pending") return "#D9E1F1";
  if (status === "Paid") return "#b6fcb6";
  if (status === "Overdue") return "#fad2d2ff";
  if (status === "inactive") return "#fff7ccff";
  if (status === "active") return "#d0e8ff";
}

function PaymentsList({ contractId }) {
  const { paymentsArray, loadPaymentsFromAPI } = usePaymentsArray();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadPaymentsFromAPI(contractId).then(() => setLoading(false));
  }, [contractId]);

  if (loading) {
    return (
      <ActivityIndicator size="small" color="#888" style={{ marginTop: 10 }} />
    );
  }

  if (paymentsArray.length === 0) {
    return (
      <Text style={{ marginTop: 10, color: "#888" }}>
        No hay pagos para este contrato.
      </Text>
    );
  }

  return (
    <View style={{ marginTop: 10 }}>
      {paymentsArray.map((payment, idx) => (
        <View
          key={payment.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            padding: 8,
            marginBottom: 6,
          }}
        >
          <View style={styles.indexContainerPayment}>
            <Text style={styles.indexTextPayment}>Pago {idx + 1}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.labelPayment}>Fecha: </Text>
            <Text style={styles.valuePayment}>
              {new Date(payment.payment_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.labelPayment}>Monto:</Text>
            <Text style={styles.amountValuePayment}>
              ${payment.payment_amount}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.labelPayment}>Estatus:</Text>
            <Text
              style={[
                styles.statusValuePayment,
                {
                  backgroundColor: getStatusBackgroundColor(payment.status),
                  color: getStatusForegroundColor(payment.status),
                },
              ]}
            >
              {payment.status}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

styles = {
  mainView: {
    backgroundColor: "#1A3D63",
  },
  bgView: {
    backgroundColor: "#F6FAFD",
    with: "100%",
    height: "100%",
    borderRadius: 25,
    padding: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    verticalAlign: "middle",
    textAlign: "center",
    color: "#F6FAFD",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A3D63",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: "#272727ff",
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#1A3D63",
    width: 80,
    fontSize: 16,
  },
  value: {
    color: "#272727ff",
    fontSize: 16,
    flex: 1,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A3D63",
    textAlign: "center",
  },
  contractCard: {
    marginTop: 16,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#D9E1F1",
  },
  indexContainer: { marginBottom: 18 },
  indexText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A3D63",
    textAlign: "left",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#1A3D63",
    width: 110,
    fontSize: 16,
  },
  value: {
    color: "#333",
    fontSize: 16,
    flex: 1,
  },
  amountValue: {
    fontWeight: "bold",
    color: "#23C16B",
  },
  statusValue: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 50,
  },
  saveButton: {
    backgroundColor: "#1A3D63",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  indexContainerPayment: { marginBottom: 10 },
  indexTextPayment: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3D63",
    textAlign: "left",
  },
  labelPayment: {
    fontWeight: "bold",
    color: "#1A3D63",
    width: 60,
    fontSize: 14,
  },
  valuePayment: {
    color: "#333",
    fontSize: 14,
    flex: 1,
  },
  amountValuePayment: {
    fontWeight: "bold",
    color: "#23C16B",
    fontSize: 14,
  },
  statusValuePayment: {
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 50,
  },
  detailRowAddContract: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  labelAddContract: {
    fontWeight: "bold",
    color: "#1A3D63",
    width: 150,
    fontSize: 12,
  },
  textInputAddContract: {
    borderWidth: 0,
    padding: 8,
    verticalAlign: "middle",
    width: "100%",
    borderBottomWidth: 1,
  },
  inputErrorAddContract: {
    borderBottomColor: "red",
  },
  inputError: {
    borderBottomColor: "red",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 15,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    width: "92%",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 10,
    alignItems: "stretch",
  },
  titleDeleteModal: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A3D63",
    marginBottom: 18,
    textAlign: "center",
  },
  labelDeleteModal: {
    fontWeight: "bold",
    color: "#000000ff",
    width: 110,
    fontSize: 16,
    width: "100%",
    marginBottom: 18,
  },
};
