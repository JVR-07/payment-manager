import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../components/UserContext";
import { BACKEND_LOCALHOST } from "@env";
import ClientCard from "../components/ClientCard";

import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ route, navigation }) {
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_LOCALHOST}/clients/`);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        setClients([]);
      }
    } catch (e) {
      setClients([]);
    }
    setLoading(false);
    setRefreshing(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchClients();
    }, [user?.id])
  );

  const handleAddClient = () => {
    navigation.navigate("AddClient");
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  return (
    <View style={styles.bgContainer}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: clients.length === 0 ? "center" : "flex-start",
          paddingBottom: 80, // para que el botón flotante no tape contenido
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Text style={{ fontSize: 18, color: "#888" }}>Cargando...</Text>
        ) : clients.length === 0 ? (
          <Text style={{ fontSize: 18, color: "#888" }}>
            No existen clientes aún
          </Text>
        ) : (
          clients.map((client, index) => (
            <ClientCard
              key={client.id}
              index={index}
              client={client}
              onPress={() => navigation.navigate("Details", { client })}
            />
          ))
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
};
