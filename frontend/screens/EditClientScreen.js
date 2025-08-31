import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import ErrorCard from "../components/ErrorCard";
import { useClientsArray } from "../components/ClientsContext";

export default function AddClientScreen({ navigation, route }) {
  const [client, setClient] = useState({
    name: route.params.client.name,
    email: route.params.client.email,
    phone: route.params.client.phone,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const { editClientWithAPI } = useClientsArray();

  const verifyEmail = (email) => {
    return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEdit = async () => {
    let newErrors = { name: false, email: false, phone: false };
    let hasError = false;

    if (!client.name) {
      newErrors.name = true;
      hasError = true;
    }
    if (!client.phone) {
      newErrors.phone = true;
      hasError = true;
    }
    if (!client.email || !verifyEmail(client.email)) {
      newErrors.email = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      setErrorMessage("Ingrese correctamente los datos");
      return;
    }

    setLoading(true);
    await editClientWithAPI(route.params.client.id, client, setErrorMessage);
    setLoading(false);
    //navigation.goBack();
  };

  return (
    <View style={styles.bgContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Cliente</Text>
        <View style={styles.dataContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={client.name}
              onChangeText={(text) => setClient({ ...client, name: text })}
              placeholder="Nombre"
            />
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.textInput, errors.email && styles.inputError]}
              value={client.email}
              onChangeText={(text) => setClient({ ...client, email: text })}
              placeholder="Correo electrónico"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Teléfono:</Text>
            <TextInput
              style={[styles.textInput, errors.phone && styles.inputError]}
              value={client.phone}
              onChangeText={(text) => setClient({ ...client, phone: text })}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              maxLength={20}
            />
          </View>
        </View>
        {errorMessage !== "" && <ErrorCard message={errorMessage} />}
        <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
          {loading ? (
            <ActivityIndicator size="small" color="#ebebebff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar</Text>
          )}
        </TouchableOpacity>
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
  textInput: {
    borderWidth: 0,
    padding: 8,
    verticalAlign: "middle",
    width: "100%",
    borderBottomWidth: 1,
  },
  inputError: {
    borderBottomColor: "red",
  },
  saveButton: {
    backgroundColor: "#1A3D63",
    paddingVertical: 12,
    borderRadius: 50,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
