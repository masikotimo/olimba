import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import NavLink from '../../components/NavLink';
import { useDispatch, useSelector } from "react-redux";
import { setUserSignUp } from '../../store/authslice';
import PhoneInput from 'react-native-international-phone-number';
import backendApi from "../../api/backend";
import { StatusBar } from 'expo-status-bar';

const SignupScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [referral, setReferral] = useState('');
  const [errorMessage, setErrorMessage] = useState("")
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false)

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');

  function handleInputValue(phoneNumber) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  useEffect(() => { 

    setLoadingSignIn(false)
    validateForm(); 
  }, [firstname, lastname, email, password]); 

  const validateForm = () => { 
      let errors = {};

      // Validate name field 
      if (!firstname) { 
          errors.firstname = 'Name is required.'; 
      } else if (firstname.length < 2) { 
        errors.firstname = 'First Name should be more than 2 characters'; 
      } 

      if (!lastname) { 
        errors.lastname = 'Name is required.'; 
      } else if (lastname.length < 2) { 
        errors.lastname = 'First Name should be more than 2 characters'; 
      } 

      // Validate email field 
      if (!email) { 
          errors.email = 'Email is required.'; 
      } else if (!/\S+@\S+\.\S+/.test(email)) { 
          errors.email = 'Email is invalid.'; 
      } 

      // Validate password field 
      if (!password) { 
          errors.password = 'Password is required.'; 
      } else if (password.length < 6) { 
          errors.password = 'Password must be at least 6 characters.'; 
      } 

      // Set the errors and update form validity 
      setErrors(errors); 
      setIsFormValid(Object.keys(errors).length === 0); 
  }; 

  const signup = async ({ email, password, firstname, lastname }) => {
    setLoadingSignIn(true)
    const username = selectedCountry.callingCode+inputValue
    const unUsername = username.replaceAll(" ", "")
    phoneNumber = inputValue.replaceAll(" ", "")
    if (isFormValid) { 
      try {
        const response = await backendApi.post("/accounts/users", { "email":email, "password":password, "first_name": firstname, "last_name":lastname, "phone_number":phoneNumber, "username": unUsername });
        dispatch(setUserSignUp(response.data.data))
        navigation.navigate("Otp");
      } catch (err) {
        console.log(err)
        setLoadingSignIn(false)
        setErrorMessage("Unable to create account, Account already exists, Please use another phone number")
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerText}>
        <Text style={styles.headerTextStyle} h3>Welcome to Rent Beta</Text>
        <Text style={styles.helperTextStyle} h5>Create your account</Text>
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
          placeholder="First Name"
          value={firstname}
          onChangeText={setFirstName}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastname}
          onChangeText={setLastName}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          placeholder="How did you hear about us?"
          value={referral}
          onChangeText={setReferral}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      <View style={styles.button}>
        {loadingSignIn ? (
          <Button
            buttonStyle={styles.buttonStyle}
            title="CREATE ACCOUNT"
            loading
            disabled
          />
        ):(
        <Button
          buttonStyle={styles.buttonStyle}
          title="CREATE ACCOUNT"
          disabled={!isFormValid}
          onPress={() => signup({ email, password, lastname, firstname })}
        />
        )}
      </View>
      <NavLink
        routeName="Signin"
        text="Already have an account?"
        linkText="Sign IN"
      />
      {/* <NavLink
        text="Need New Activation OTP?"
        linkText="Get OTP"
        routeName="Signup"
      /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText:{
    marginTop: 20
  },
  container: {
    flex: 1,
    marginTop: 80,
    marginBottom: 50,
    borderWidth: 10,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 10
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
  button: {
    marginTop: 30
  },
  headerTextStyle: {
    fontWeight: 700
  },
  helperTextStyle: {
    color: '#7D8FAB',
    marginTop: 8
  }
});

export default SignupScreen;