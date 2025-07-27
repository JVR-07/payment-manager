import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Button,
  TextInput,
  Platform,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BACKEND_LOCALHOST } from "@env";

export default function DetailsScreen({ route }) {
  const { client } = route.params;
  const [contracts, setContracts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [firstPaymentDate, setFirstPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalPayments, setTotalPayments] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    fetchContracts();
  }, [client.id]);

  async function fetchContracts() {
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_LOCALHOST}/clients/${client.id}/contracts`
      );
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      } else {
        setContracts([]);
      }
    } catch {
      setContracts([]);
    }
    setLoading(false);
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

  const handleCreateContract = async () => {
    if (!firstPaymentDate || !totalPayments || !totalAmount) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    const paymentsCount = parseInt(totalPayments, 10);
    const amount = parseFloat(totalAmount);
    if (
      isNaN(paymentsCount) ||
      isNaN(amount) ||
      paymentsCount <= 0 ||
      amount <= 0
    ) {
      Alert.alert(
        "Error",
        "Cantidad de pagos y monto total deben ser números válidos y mayores a 0"
      );
      return;
    }
    if (paymentsCount > 32) {
      Alert.alert("Error", "La cantidad máxima de pagos es 32");
      return;
    }

    let statusContract = "active";
    let statusPayment = "Pending";
    try {
      const res = await fetch(
        `${BACKEND_LOCALHOST}/clients/${client.id}/contracts`
      );
      if (res.ok) {
        const contracts = await res.json();
        if (contracts.some((c) => c.status === "active")) {
          statusContract = "inactive";
          statusPayment = "inactive";
        }
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo crear el contrato");
    }

    let contractId = null;
    try {
      const res = await fetch(`${BACKEND_LOCALHOST}/contracts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_payment_date: firstPaymentDate.toISOString().split("T")[0],
          total_amount: amount,
          total_payments: paymentsCount,
          client_id: client.id,
          status: statusContract,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        Alert.alert("Error", err.detail || "No se pudo crear el contrato");
        return;
      }
      const contract = await res.json();
      contractId = contract.id;
    } catch (e) {
      Alert.alert("Error", "No se pudo crear el contrato");
      return;
    }

    const individualAmount = parseFloat((amount / paymentsCount).toFixed(2));
    let payments = [];
    let currentDate = new Date(firstPaymentDate);
    for (let i = 0; i < paymentsCount; i++) {
      payments.push({
        payment_date: currentDate.toISOString().split("T")[0],
        payment_amount: individualAmount,
        contract_id: contractId,
        status: statusPayment,
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    try {
      for (const payment of payments) {
        await fetch(`${BACKEND_LOCALHOST}/payments/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        });
      }
    } catch (e) {
      Alert.alert("Error", "No se pudieron crear los pagos");
      return;
    }

    setShowModal(false);
    resetModal();
    fetchContracts();
    Alert.alert("Éxito", "Contrato y pagos creados correctamente");
  };

  function getContractColor(status) {
    if (status === "active") return "#b3e5fc";
    return "#D9E1F1";
  }

  return (
    <ScrollView style={styles.mainView} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.bgView}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          {client.name}
        </Text>
        {client.email ? <Text>Email: {client.email}</Text> : null}
        {client.phone ? <Text>Tel: {client.phone}</Text> : null}
        <Text style={{ marginTop: 20, fontSize: 20, fontWeight: "bold" }}>
          Contratos
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#888"
            style={{ marginTop: 20 }}
          />
        ) : contracts.length === 0 ? (
          <Text style={{ marginTop: 10, color: "#888" }}>
            No hay contratos para este cliente.
          </Text>
        ) : (
          contracts.map((contract, index) => (
            <View
              key={index}
              style={{
                marginTop: 16,
                backgroundColor: getContractColor(contract.status),
                borderRadius: 8,
                padding: 12,
              }}
            >
              <TouchableOpacity onPress={() => toggleExpand(contract.id)}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Contrato #{index + 1} - {contract.status}
                </Text>
                <Text>Primer pago: {contract.first_payment_date}</Text>
                <Text>Total: ${contract.total_amount}</Text>
                <Text>Pagos totales: {contract.total_payments}</Text>
              </TouchableOpacity>
              {expanded[contract.id] && (
                <PaymentsList contractId={contract.id} />
              )}
            </View>
          ))
        )}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}> Agregar Contrato </TouchableOpacity>
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
                  borderRadius: 10,
                  width: "85%",
                  elevation: 5,
                }}
                onStartShouldSetResponder={() => true}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  Nuevo Contrato
                </Text>
                <Text>Fecha del primer pago</Text>
                {Platform.OS === "web" ? (
                  <input
                    type="date"
                    value={firstPaymentDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFirstPaymentDate(new Date(e.target.value))
                    }
                    style={{
                      marginVertical: 10,
                      padding: 8,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      width: "100%",
                      marginBottom: 10,
                    }}
                  />
                ) : (
                  <>
                    <Button
                      title={
                        firstPaymentDate
                          ? firstPaymentDate.toISOString().split("T")[0]
                          : "Seleccionar fecha"
                      }
                      onPress={() => setShowDatePicker(true)}
                    />
                    {showDatePicker && (
                      <DateTimePicker
                        value={firstPaymentDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) setFirstPaymentDate(selectedDate);
                        }}
                      />
                    )}
                  </>
                )}
                <Text style={{ marginTop: 10 }}>Cantidad de pagos</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 8,
                    borderRadius: 5,
                  }}
                  value={totalPayments}
                  onChangeText={setTotalPayments}
                  placeholder="Ej: 10"
                  keyboardType="numeric"
                />
                <Text>Monto total</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    marginBottom: 20,
                    padding: 8,
                    borderRadius: 5,
                  }}
                  value={totalAmount}
                  onChangeText={setTotalAmount}
                  placeholder="Ej: 1000"
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={handleCreateContract}> Crear contrato </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
      </View>
    </ScrollView>
  );
}

function getPaymentColor(status) {
  if (status === "Pending") return "#fff";
  if (status === "Paid") return "#b6fcb6";
  if (status === "Overdue") return "#ffb1b1";
  return "#fff";
}

function PaymentsList({ contractId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_LOCALHOST}/contracts/${contractId}/payments`
        );
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch {
        setPayments([]);
      }
      setLoading(false);
    }
    fetchPayments();
  }, [contractId]);

  useEffect(() => {
    console.log(payments);
    async function updateLatePayments() {
      const now = new Date();
      for (const payment of payments) {
        if (payment.status === "Pending") {
          const [year, month, day] = payment.payment_date
            .split("-")
            .map(Number);
          const dueDate = new Date(year, month - 1, day, 16, 0, 0, 0);
          if (now > dueDate) {
            await fetch(`${BACKEND_LOCALHOST}/payments/${payment.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Overdue" }),
            });
            payment.status = "Overdue";
          }
        }
      }
    }
    if (payments.length > 0) updateLatePayments();
  }, [payments]);

  if (loading)
    return (
      <ActivityIndicator size="small" color="#888" style={{ marginTop: 10 }} />
    );
  if (payments.length === 0)
    return <Text style={{ marginTop: 10, color: "#888" }}>Sin pagos.</Text>;

  return (
    <View style={{ marginTop: 10 }}>
      {payments.map((payment, index) => (
        <View
          key={index}
          style={{
            backgroundColor: getPaymentColor(payment.status),
            marginBottom: 6,
            padding: 8,
            borderRadius: 6,
          }}
        >
          <Text>Numero de pago: {index + 1}</Text>
          <Text>Fecha: {payment.payment_date}</Text>
          <Text>Monto: ${payment.payment_amount}</Text>
          <Text>Estatus: {payment.status}</Text>
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
    with: "95%",
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
};
