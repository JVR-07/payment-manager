import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function ErrorCard({ message }) {
  return (
    <View style={styles.container}>
      <AntDesign name="warning" size={15} color="#fff" style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3605eff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    opacity: 0.8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    flexShrink: 1,
    textAlign: "center",
  },
});
