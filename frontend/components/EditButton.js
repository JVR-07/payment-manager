import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function EditButton({ onPress, _size = 20 }) {
  return (
    <TouchableOpacity style={[styles.button, styles.blue]} onPress={onPress}>
      <AntDesign name="edit" size={_size} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blue: {
    backgroundColor: '#007bff',
  },
});
