import React, { useState } from 'react';
import { StyleSheet, TextInput, ScrollView, View, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import PhoneInput from 'react-native-international-phone-number';


const AuthForm = ({ headerText, helperText, errorMessage, onSubmit, submitButtonText, loadingSignIn }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');

  function handleInputValue(phoneNumber) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  return (
    <ScrollView>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText:{
    marginTop: 20
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15
  },
  inputView: {
    display:"flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  input: {
    flex:3,
  },
  input2: {
    width: "100%",
    height: 55,
    borderColor: "#000",
    borderWidth: 0.5,
    marginTop: 12,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 17,
    color: "#000",
    backgroundColor: "#fff",
    padding: 15
  },
  icon: {
    flex:1
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10
  },
  headerTextStyle: {
    fontWeight: 700
  },
  helperTextStyle: {
    color: '#7D8FAB',
    marginTop: 10
  },
  inputs: {
    marginTop: 40
  },
  button: {
    marginTop: 30
  }
});

export default AuthForm;