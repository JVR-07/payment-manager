import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function MovementCard({ _index, _movement, onPress }) {
 return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ width: "100%" }}
    >
      <View
        style={{
          backgroundColor: "#F6FAFD",
          borderRadius: 25,
          padding: 20,
          marginVertical: 10,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 16,
            width: 30, 
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >{_index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {_movement.amount ? <Text> Monto: {_movement.amount}</Text> : null}
          {_movement.concept ? <Text>Concepto: {_movement.concept}</Text> : null}
          {_movement.movement_date ? <Text>Fecha: {_movement.movement_date}</Text> : null}
          {_movement.status ? <Text>Estatus: {_movement.status}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
