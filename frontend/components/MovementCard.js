import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

export default function MovementCard({
  _index,
  _movement,
  onPress,
  onEdit,
  //onDelete,
}) {
  function getStatusForegroundColor(status) {
    if (status === "Assigned") return "#3fdb3fff";
    if (status === "Unassigned") return "#F10303";
  }
  function getStatusBackgroundColor(status) {
    if (status === "Assigned") return "#b6fcb6";
    if (status === "Unassigned") return "#fad2d2ff";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ width: "100%" }}
    >
      <View style={styles.card}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{_index + 1}</Text>
        </View>

        <View style={styles.dataContainer}>
          {_movement.amount && (
            <Text style={styles.amountText}>${_movement.amount}</Text>
          )}
          {_movement.concept && (
            <Text
              style={styles.conceptText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {_movement.concept}
            </Text>
          )}
          <View style={styles.row}>
            {_movement.movement_date && (
              <Text style={styles.dateText}>
                {new Date(_movement.movement_date).toLocaleDateString()}
              </Text>
            )}
            {_movement.status && (
              <Text
                style={[
                  styles.statusText,
                  {
                    backgroundColor: getStatusBackgroundColor(_movement.status),
                    color: getStatusForegroundColor(_movement.status),
                  },
                ]}
              >
                {_movement.status}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <EditButton onPress={onEdit} />
          {/* <DeleteButton onPress={onDelete} /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  indexContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 18,
    width: 36,
  },
  indexText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A3D63",
    textAlign: "center",
  },
  dataContainer: {
    flex: 1,
    justifyContent: "center",
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#23C16B",
    marginBottom: 4,
  },
  conceptText: {
    fontSize: 16,
    color: "#1A3D63",
    fontWeight: "500",
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 50,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
