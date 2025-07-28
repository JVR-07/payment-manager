import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { BACKEND_URL } from "@env";
import { UserContext } from "../components/UserContext";
import MovementCard from "../components/MovementCard";

export default function MovementsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState([]);
  const [invalidUser, setInvalidUser] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.access_token) {
      navigation.replace("Login", { from: "Movements" });
      return;
    }
    if (!user?.movadmin) {
      setInvalidUser(true);
      setLoading(false);
      return;
    } else {
      setInvalidUser(false);
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
        const res = await fetch(`${BACKEND_URL}/get-emails/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: user?.access_token }),
        });
        return await res.json();
      } catch (error) {
        console.log("Error syncing movements", error);
      }
    }

    async function fetchMovements() {
      try {
        setMovements([]);
        const res = await fetch(`${BACKEND_URL}/movements/`);
        if (res.ok) {
          const _movements = await res.json();
          console.log("fetched movements:", _movements);
          setMovements(_movements);
          console.log("movements 1:", movements);
        } else {
          console.log("Error fetching movements:", res);
        }
      } catch (error) {
        console.log("Error fetching movements:", error);
      }
    }

    run();
  }, [user?.accessToken, navigation]);

  useEffect(() => {
    async function AssignMovement() {
      console.log("movements 2:", movements);
      const unassignedMovements = movements.filter(
        (movement) => movement.status === "Unassigned"
      );
      console.log("Unassigned movements:", unassignedMovements);
      if (unassignedMovements.length === 0) {
        console.log("No unassigned movements to assign");
        return;
      }

      for (const movement of unassignedMovements) {
        try {
          const clientRes = await fetch(
            `${BACKEND_URL}/clients/${movement.concept}`
          );
          if (!clientRes.ok) {
            console.log("Error fetching client by alias:", movement);
            continue;
          }
          const client = await clientRes.json();

          const contractRes = await fetch(
            `${BACKEND_URL}/clients/${client.id}/contracts`
          );
          if (!contractRes.ok) {
            console.log(
              "Error fetching active contract for client:",
              contractRes
            );
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
            `${BACKEND_URL}/contracts/${contract.id}/payments/first-pending`
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
            `${BACKEND_URL}/movements/${movement.cdr}`,
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

          const updatePay = await fetch(
            `${BACKEND_LOCALHOST}/payments/${movement.payment_id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "Paid",
              }),
            }
          );
          if (updatePay.ok) {
            console.log(`Payment ${movement.payment_id} updated successfully`);
          } else {
            console.log("Error updating payment:", await updatePay.text());
          }
        } catch (error) {
          console.error("Unexpected error during assignment:", error);
        }
      }
    }

    AssignMovement();
  }, [movements]);

  return (
    <View style={styles.bgContainer}>
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#888"
          style={{ marginTop: 20 }}
        />
      ) : invalidUser ? (
        <Text
          style={{
            color: "#f10303ff",
            textAlign: "center",
            verticalAlign: "middle",
            fontWeight: "bold",
            fontSize: 30,
          }}
        >
          Usuario sin permisos
        </Text>
      ) : movements.length === 0 ? (
        <Text style={{ margin: 20, color: "#888" }}>
          No se encontraron movimientos.
        </Text>
      ) : (
        <View
          style={styles.bgView}
        >
          {movements.map((movement, index) => (
            <MovementCard
              _index={index}
              _movement={movement}
              onPress={console.log("pressed")}
            />
          ))}
        </View>
      )}
    </ScrollView>
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
};
