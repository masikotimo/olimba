import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const TouchableButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
            <Text h5style={styles.buttonText} h5>{text}</Text>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 30,
    width: 200,
    alignItems: 'center',
    backgroundColor: "#FCB200"

  },
  buttonText:{
    textAlign: 'center',
    padding: 20,
    color: '#FFF'
  },
});

export default TouchableButton;