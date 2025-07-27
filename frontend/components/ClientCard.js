import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function ClientCard({ index, client, onPress }) {
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
          >{index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {client.name}
          </Text>
          {client.phone ? <Text>Tel: {client.phone}</Text> : null}
          {client.email ? <Text>Email: {client.email}</Text> : null}
          
        </View>
      </View>
    </TouchableOpacity>
  );
}
