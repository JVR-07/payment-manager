import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
// import { useClientsArray } from "../components/ClientsContext";
// import { useContractsArray } from "../components/ContractsContext";
// import { usePaymentsArray } from "../components/PaymentsContext";

export default function EditMovementScreen({ route, navigation }) {
  const { movement } = route.params;
  // const { clientArray } = useClientsArray();
  // const [loading, setLoading] = useState(false);
  // const [selectedClient, setSelectedClient] = useState("");
  // const [selectedPayment, setSelectedPayment] = useState("");
  // const [paymentsOfActiveContracts, setPaymentsOfActiveContracts] = useState([]);
  // const { loadContractsFromAPI } = useContractsArray();
  // const { getPaymentsFromAPI } = usePaymentsArray();

  // useEffect(() => {
  //   let movement_id = movement.id;
  //   console.log("Movimiento ID:", movement_id);
  //   fetchPayments();
  // }, []);

  // async function fetchPayments() {
  //   let paymentsLocalArray = [];
  //   const allPayments = await Promise.all(
  //     clientArray.map(async (client) => {
  //       const contractsArray = await loadContractsFromAPI(client.id);

  //       const active_contract_id = contractsArray.find(
  //         (c) => c.status === "active"
  //       )?.id;

  //       if (active_contract_id) {
  //         return await getPaymentsFromAPI(active_contract_id);
  //       } else {
  //         return [];
  //       }
  //     })
  //   );

  //   paymentsLocalArray = allPayments.flat();

  //   setPaymentsOfActiveContracts(paymentsLocalArray);
  // }

  function getStatusForegroundColor(status) {
    if (status === "Assigned") return "#3fdb3fff";
    if (status === "Unassigned") return "#F10303";
  }
  function getStatusBackgroundColor(status) {
    if (status === "Assigned") return "#b6fcb6";
    if (status === "Unassigned") return "#fad2d2ff";
  }

  return (
    <View style={styles.bgContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Detalles del movimiento</Text>
        <View style={styles.dataContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>CDR:</Text>
            <Text style={styles.value}>{movement.cdr}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {new Date(movement.movement_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.amountValue}>${movement.amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estatus:</Text>
            <Text
              style={[
                styles.statusValue,
                {
                  backgroundColor: getStatusBackgroundColor(movement.status),
                  color: getStatusForegroundColor(movement.status),
                },
              ]}
            >
              {movement.status}
            </Text>
          </View>
        </View>

        {/* <Text style={styles.selectLabel}>Cliente</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedClient}
            onValueChange={(itemValue) => setSelectedClient(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un cliente" value="" />
            {clientArray.map((client) => (
              <Picker.Item
                key={client.id}
                label={client.name}
                value={client.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.selectLabel}>Pago del contrato activo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPayment}
            onValueChange={(itemValue) => setSelectedPayment(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un pago" value="" />
            {paymentsOfActiveContracts.map((payment, index) => (
              <Picker.Item
                key={payment.id}
                label={`Pago #${index + 1} - $ ${payment.payment_amount}`}
                value={payment.id}
              />
            ))}
          </Picker>
        </View> */}

        {/* <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: "#1A3D63",
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A3D63",
    marginBottom: 18,
    textAlign: "center",
  },
  dataContainer: {
    marginBottom: 18,
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
    color: "#F10303",
    backgroundColor: "#FDEAEA",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 50,
  },
  selectLabel: {
    fontWeight: "bold",
    color: "#1A3D63",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 44,
    width: "100%",
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
});
