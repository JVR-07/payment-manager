import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { BACKEND_LOCALHOST } from "@env";

export default function MovementsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState([]);
  const accessToken = route.params?.accessToken;

  useEffect(() => {
  if (!accessToken) {
    navigation.replace("Login", { from: "Movements" });
    return;
  }

  const run = async () => {
    setLoading(true);

    try {
      const resultSync = await syncMovements();
      console.log(resultSync);

      if (resultSync?.message === "Sync completed") {
        await fetchMovements();
      } else {
        console.log("Error syncing movements");
      }

    } catch (error) {
      console.log("Unexpected error in run()", error);
    }

    setLoading(false);
  };

  async function syncMovements() {
    try {
      const res = await fetch(`${BACKEND_LOCALHOST}/get-emails/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      return await res.json();
    } catch (error) {
      console.log("Error syncing movements", error);
    }
  }

  async function fetchMovements() {
    try {
      setMovements([]);
      const res = await fetch(`${BACKEND_LOCALHOST}/movements/`);
      if (res.ok) {
        const movements = await res.json();
        console.log(movements);
        setMovements(movements);
      } else {
        console.log("Error fetching movements:", res);
      }
    } catch (error) {
      console.log("Error fetching movements:", error);
    }
  }

  run();
}, [accessToken, navigation]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <View style={{ padding: 16 }}>
        <Button title="Agregar Movimiento" onPress={() => {}} />
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#888"
          style={{ marginTop: 20 }}
        />
      ) : movements.length === 0 ? (
        <Text style={{ margin: 20, color: "#888" }}>
          No se encontraron correos.
        </Text>
      ) : (
        movements.map((movement, index) => (
          <TouchableOpacity
            onPress={console.log("Card pressed: ", index)}
            activeOpacity={0.8}
          >
            <View
              style={{
                backgroundColor: "#fff",
                marginVertical: 8,
                padding: 16,
                borderRadius: 8,
                width: "90%",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {index + 1}
              </Text>
              {movement.amount ? <Text>Monto: {movement.amount}</Text> : null}
              {movement.concept ? <Text>Concepto: {movement.concept}</Text> : null}
              {movement.movement_date ? <Text>Fecha: {movement.movement_date}</Text> : null}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
