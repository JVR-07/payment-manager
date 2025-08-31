import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

export default function ClientCard({
  index,
  client,
  onPressCard,
  //onEdit,
  onDelete,
}) {
  return (
    <TouchableOpacity
      onPress={onPressCard}
      activeOpacity={0.8}
      style={{ width: "100%" }}
    >
      <View style={styles.card}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{client.name}</Text>
          <Text style={styles.phoneText}>{client.phone}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {/* <EditButton onPress={onEdit} /> */}
          <DeleteButton onPress={onDelete} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F6FAFD",
    borderRadius: 25,
    padding: 20,
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  indexContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 16,
    width: 30,
  },
  indexText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  nameContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },
  phoneText: {
    fontSize: 16,
    color: "#272727ff",
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
