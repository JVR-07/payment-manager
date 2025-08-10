import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ClientCard from "../components/ClientCard";
import {useClientsArray} from "../components/ClientsContext";

import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const { clientArray, loadClientsFromAPI } = useClientsArray();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadClientsFromAPI(setLoading, setRefreshing);
    }, [])
  );

  const handleAddClient = () => {
    navigation.navigate("AddClient");
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadClientsFromAPI(setLoading, setRefreshing);
  };

  return (
    <View style={styles.bgContainer}>
      <ScrollView
        style={{width:'100%', padding: 15}}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: clients.length === 0 ? "center" : "flex-start",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Text style={{ fontSize: 18, color: "#888" }}>Cargando...</Text>
        ) : clientArray.length === 0 ? (
          <Text style={{ fontSize: 18, color: "#888" }}>
            No existen clientes aún
          </Text>
        ) : (
          clientArray.map((client, index) => (
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
