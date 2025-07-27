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
          const _movements = await res.json();
          console.log("fetched movements:",_movements);
          setMovements(_movements);
          console.log("movements 1:",movements)
        } else {
          console.log("Error fetching movements:", res);
        }
      } catch (error) {
        console.log("Error fetching movements:", error);
      }
    }

    run();
  }, [accessToken, navigation]);

  useEffect(() => {
    async function AssignMovement() {
      console.log("movements 2:", movements);
      const unassignedMovements = movements.filter((movement) => movement.status === "Unassigned");
      console.log("Unassigned movements:", unassignedMovements);
      if (unassignedMovements.length === 0) {
        console.log("No unassigned movements to assign");
        return;
      }

      for (const movement of unassignedMovements) {
        try {
          const clientRes = await fetch(
            `${BACKEND_LOCALHOST}/clients/${movement.concept}`
          );
          if (!clientRes.ok) {
            console.log("Error fetching client by alias:", movement);
            continue;
          }
          const client = await clientRes.json();

          const contractRes = await fetch(
            `${BACKEND_LOCALHOST}/clients/${client.id}/contracts`
          );
          if (!contractRes.ok) {
            console.log("Error fetching active contract for client:", contractRes);
            continue;
          }
          const contracts = await contractRes.json();
          console.log("Contracts for client:", contracts);
          const contract = contracts.find((c) => c.status === "active");
          if (!contract) {
            console.log("No active contract found for client:", client);
            continue;
          }
          console.log("Active contract found:", contract);

          const paymentRes = await fetch(
            `${BACKEND_LOCALHOST}/contracts/${contract.id}/payments/first-pending`
          );
          if (!paymentRes.ok) {
            console.log(
              "Error fetching first pending payment for contract:",
              contract
            );
            continue;
          }
          const payment = await paymentRes.json();

          const updateRes = await fetch(
            `${BACKEND_LOCALHOST}/movements/${movement.cdr}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "Assigned",
                payment_id: payment.id,
              }),
            }
          );

          if (updateRes.ok) {
            movement.status = "Assigned";
            movement.payment_id = payment.id;
            console.log(`Movement ${movement.cdr} assigned successfully`);
          } else {
            console.log("Error assigning movement:", await updateRes.text());
          }
        } catch (error) {
          console.error("Unexpected error during assignment:", error);
        }
      }
    }

    AssignMovement()
  }, [movements]);

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
              {movement.concept ? (
                <Text>Concepto: {movement.concept}</Text>
              ) : null}
              {movement.movement_date ? (
                <Text>Fecha: {movement.movement_date}</Text>
              ) : null}
              {movement.status ? <Text>Estatus: {movement.status}</Text> : null}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
