import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ClientCard from "../components/ClientCard";
import { useClientsArray } from "../components/ClientsContext";
import { useMovementsArray } from "../components/MovementsContext";
import { UserContext } from "../components/UserContext";
import { assignUnassignedMovements } from "../services/assignMovements";
import ErrorCard from "../components/ErrorCard";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const { clientArray, loadClientsFromAPI, editClientWithAPI, editItemById } =
    useClientsArray();
  const { movementArray, loadMovementsFromAPI } = useMovementsArray();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalClientId, setModalClientId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadClientsFromAPI();

      if (user?.movadmin) {
        loadMovementsFromAPI(user.access_token);
      }
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    assignUnassignedMovements(clientArray, movementArray);
  }, [clientArray, movementArray]);

  const handleAddClient = () => {
    navigation.navigate("AddClient");
  };

  const handleDeleteClient = async (clientId) => {
    await editClientWithAPI(clientId, { status: "Deleted" }, setErrorMessage);
    await editItemById(clientId, { status: "Deleted" });
    await loadClientsFromAPI();
    setShowModal(false);
  };

  return (
    <View style={styles.bgContainer}>
      <ScrollView
        style={{ width: "100%", padding: 15 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: clientArray.length === 0 ? "center" : "flex-start",
        }}
      >
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
            <View style={styles.card}>
              <Text style={styles.title}>Eliminar Cliente</Text>
              <Text style={styles.label}>¿Está seguro que quiere eliminar el cliente?</Text>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleDeleteClient(modalClientId)} >
                <Text style={styles.saveButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ebebebff"
            style={{ marginTop: 20 }}
          />
        ) : clientArray.length === 0 ? (
          <Text style={{ fontSize: 18, color: "#ffffffff" }}>
            No existen clientes aún
          </Text>
        ) : (
          <>
            {errorMessage !== "" && <ErrorCard message={errorMessage} />}
            {clientArray.map((client, index) => (
              <ClientCard
                index={index}
                client={client}
                onPressCard={() => navigation.navigate("Details", { client })}
                // onEdit={() => navigation.navigate("EditClient", { client })}
                onDelete={() => {
                  setShowModal(true)
                  setModalClientId(client.id)
                }}
              />
            ))}
          </>
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleAddClient} style={styles.fab}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  bgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A3D63",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
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
  label: {
    fontWeight: "bold",
    color: "#000000ff",
    width: 110,
    fontSize: 16,
    width: "100%",
    marginBottom: 18
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
};
