import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BACKEND_URL } from "@env";

export default function AddClientScreen({ navigation }) {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const verifyEmail = (email) => {
    return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = async () => {
    if (!name || !phone || !email) {
      console.log("Nombre, numero y email son obligatorios.");
      return;
    }
    if (!verifyEmail(email)) {
      console.log("El email no es válido.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/clients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          creation_date: new Date().toISOString().split("T")[0],
          email: email || null,
          phone: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("No se pudo agregar el cliente ", errorData.detail);
        return;
      }
      console.log("Cliente agregado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.log("Error de conexión con el servidor: ", error);
    }
  };

  return (
    <ScrollView
      style={styles.mainView}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <View style={styles.bgView}>
        <Text style={styles.title}>Agregar Cliente</Text>
        <Text>Nombre *</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
        />
        <Text>Email *</Text>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text>Teléfono *</Text>
        <TextInput
          style={styles.textInput}
          value={phone}
          onChangeText={setPhone}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          maxLength={20}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          {" "}
          Guardar{" "}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  mainView: {
    backgroundColor: "#1A3D63",
  },
  bgView: {
    backgroundColor: "#F6FAFD",
    with: "95%",
    borderRadius: 25,
    padding: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A3D63",
  },
  textInput: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
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
