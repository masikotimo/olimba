import React, { useState } from 'react';
import { StyleSheet, TextInput, ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import PhoneInput from 'react-native-international-phone-number';


const AuthForm = ({ headerText, helperText, errorMessage, onSubmit, submitButtonText, loadingSignIn }) => {
  const [password, setPassword] = useState('');
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
      <View style={styles.headerText}>
        <Text style={styles.headerTextStyle} h3>{headerText}</Text>
        <Text style={styles.helperTextStyle} h5>{helperText}</Text>
      </View>

      <View style={styles.inputs}>
        <PhoneInput
          value={inputValue}
          defaultCountry="UG"
          onChangePhoneNumber={handleInputValue}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={handleSelectedCountry}
        />

        <TextInput
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder='Password'
        />
      </View>
    
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      <View style={styles.button}>
        {loadingSignIn ? (
          <Button
            buttonStyle={styles.buttonStyle}
            title={submitButtonText}
            loading
            disabled
          />
        ) : (
          <Button
            buttonStyle={styles.buttonStyle}
            title={submitButtonText}
            onPress={() => onSubmit({ selectedCountry, inputValue, password })}
          />
        )}
      </View>
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
  input: {
    height: 50,
    marginTop: 20,
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 10
  },
  button: {
    marginTop: 30
  }
});

export default AuthForm;