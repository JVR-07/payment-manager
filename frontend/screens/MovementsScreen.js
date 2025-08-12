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
import { useMovementsArray } from "../components/MovementsContext";

export default function MovementsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState([]);
  const { movementArray } = useMovementsArray();
  const [invalidUser, setInvalidUser] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.movadmin) {
      setInvalidUser(true);
      setLoading(false);
      return;
    } else {
      setInvalidUser(false);
    }
  }, []);

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
        ) : movementArray.length === 0 ? (
          <Text style={{ margin: 20, color: "#888" }}>
            No se encontraron movimientos.
          </Text>
        ) : (
          <View style={styles.bgView}>
            {movementArray.map((movement, index) => (
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
