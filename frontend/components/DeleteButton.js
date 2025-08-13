import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function DeleteButton({ onPress }) {
  return (
    <TouchableOpacity style={[styles.button, styles.red]} onPress={onPress}>
      <AntDesign name="delete" size={20} color="#fff" />
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
  red: {
    backgroundColor: '#dc3545',
  },
});
