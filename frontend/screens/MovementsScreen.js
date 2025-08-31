import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { UserContext } from "../components/UserContext";
import MovementCard from "../components/MovementCard";
import { useMovementsArray } from "../components/MovementsContext";

export default function MovementsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const {
    movementArray,
    loadMovementsFromAPI,
    editMovementsFromAPI,
    editItemById,
  } = useMovementsArray();
  const [invalidUser, setInvalidUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMovementId, setModalMovementId] = useState(null);
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

  const handleDeleteMovement = async (movementId) => {
    await editMovementsFromAPI(movementId, { status: "Deleted" });
    await editItemById(movementId, { status: "Deleted" });
    await loadMovementsFromAPI(user.access_token);
    setShowModal(false);
  };

  return (
    <View style={styles.bgContainer}>
      <ScrollView
        style={{ width: "100%", padding: 15 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: movementArray.length === 0 ? "center" : "flex-start",
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
              <Text style={styles.title}>Eliminar Movimiento</Text>
              <Text style={styles.label}>
                ¿Está seguro que quiere eliminar el movimiento?
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleDeleteMovement(modalMovementId)}
              >
                <Text style={styles.saveButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
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
          <Text style={{ fontSize: 18, color: "#ffffffff" }}>
            No se encontraron movimientos
          </Text>
        ) : (
          <View style={styles.bgView}>
            {movementArray.map((movement, index) => (
              <MovementCard
                _index={index}
                _movement={movement}
                onEdit={() => {
                  navigation.navigate("EditMovement", { movement });
                }}
                // onDelete={() => {
                //   setShowModal(true);
                //   setModalMovementId(movement.cdr);
                // }}
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
    width: "100%",
  },
  bgView: {
    width: "100%",
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
