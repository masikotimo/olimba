import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavLink = ({ text, linkText, routeName }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.navView}>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(routeName)}>
            <Text style={styles.link}>{linkText}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: '#7D8FAB',
    fontWeight: 500,

  },
  text:{
    color: '#7D8FAB'
  },
  navView: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center'
  }
});

export default NavLink;