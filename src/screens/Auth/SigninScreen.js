import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TextInput, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';
import PhoneInput from 'react-native-international-phone-number';
import { setPhoneNumber, setUserSignUp } from '../../store/authslice';
import { useDispatch } from "react-redux";
import backendApi from "../../api/backend";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

const SigninScreen = ({navigation}) => {
  const [errors, setErrors] = useState({}); 
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const [loadingUserDetails, setLoadingUserDetails] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [fieldActive, setFieldActive] = useState(false)
  const [detailsVerified, setDetailsVerified] = useState(false)

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  useEffect(() => {
    setLoadingSignIn(false)
    validateForm(); 
  }, [firstname, lastname]); 

  const fetchUserDetails = async (phone) => {
    try {
        setLoadingUserDetails(true)
        const phoneNumber = selectedCountry.callingCode+phone
        const unSpacedNumber = phoneNumber.replaceAll(" ", "")
        const response = await backendApi.post("/accounts/users/details", { "phone_number": unSpacedNumber});

        if(response.data.status === 206){
            setLoadingUserDetails(false)
            setUserExists(true)
            setFieldActive(false)
        } else if (response.data.status === 200){
            setLoadingUserDetails(false)
            setUserExists(true)
            setFieldActive(false)
        } else if (response.data.status === 404){
            setLoadingUserDetails(false)
            setUserExists(false)
            setFieldActive(true)
        }
    } catch (err) {
        setLoadingUserDetails(false)
        setUserExists(false)
        setFieldActive(true)
    }
  };

  const handleInputValue = async (phoneNumber) =>  {
    setInputValue(phoneNumber);
    if(phoneNumber.length === 11){
        await fetchUserDetails(phoneNumber);
        setDetailsVerified(true)
    }else{
        setDetailsVerified(false)
    }
  }

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

    // Set the errors and update form validity 
    setErrors(errors); 
    setIsFormValid(Object.keys(errors).length === 0); 
  }; 

  const signup = async ({ firstname, lastname }) => {
    setLoadingSignUp(true)
    const username = selectedCountry.callingCode+inputValue
    const unUsername = username.replaceAll(" ", "")
    const phoneNumber = inputValue.replaceAll(" ", "")
    if (isFormValid) { 
      try {
        const response = await backendApi.post("/accounts/tenants/create", {"first_name": firstname, "last_name":lastname, "phone_number":phoneNumber, "username": unUsername });
        dispatch(setUserSignUp(response.data.data))
        navigation.navigate("Otp");
      } catch (err) {
        setLoadingSignUp(false)
      }
    }
  };

  const signin = async ({ selectedCountry, inputValue }) => {
    try {
      setLoadingSignIn(true);
      const phoneNumber = selectedCountry.callingCode+inputValue;
      const unSpacedNumber = phoneNumber.replaceAll(" ", "");
      const response = await backendApi.post("/accounts/authenticate/tenant", { "phone_number": unSpacedNumber });

      if(response.data.status === 200){
        dispatch(setUserSignUp(response.data.data.user_details));
        setLoadingSignIn(false)
        navigation.navigate("Otp");
      } else if (response.data.status === 404){
        setErrorMessage("Other Error")
        setLoadingSignIn(false)
      }
      
    } catch (err) {
      setErrorMessage("Invalid Username or Password");
      setLoadingSignIn(false)
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <StatusBar style="dark" />

      <View style={styles.headerText}>
        <Text h3Style={styles.headerTextStyle} h3>Welcome Back</Text>
        <Text style={styles.helperTextStyle} h5>Thank you for choosing Rentbeta, We are ready to serve you</Text>
      </View>

      <View style={styles.phoneInput}>
        <View style={{flex: 19}}>
          <PhoneInput
            value={inputValue}
            defaultCountry="UG"
            onChangePhoneNumber={handleInputValue}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleSelectedCountry}
          />
        </View>
        <View style={{flex:1}}>
          {loadingUserDetails &&
            <ActivityIndicator size={24} color="#FCB200" style={{marginLeft: 15}}/>
          }

          {detailsVerified && 
          <>
            {userExists ? (
              <FontAwesome name='check-circle' color={'green'} size={20} style={{marginLeft: 2}}/>
            ) : (
              <FontAwesome name='check-circle' color={'#FCB200'} size={20} style={{marginLeft: 2}}/>
            )}
          </>
          }
        </View>
      </View>

      {!userExists && detailsVerified && (
        <View style={styles.inputs}>
          <Text style={styles.helperTextStyle} h5>Provide some extra details in order to create your account</Text>
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
        </View>
      )}

      <>
        {detailsVerified ? (
          <>
          {userExists ? (
            <View style={styles.button}>
              {loadingSignIn ? (
                <Button
                  buttonStyle={styles.buttonStyle}
                  title="SIGN IN"
                  loading
                  disabled
                />
              ) : (
                <Button
                  buttonStyle={styles.buttonStyle}
                  title="SIGN IN"
                  onPress={() => signin({ selectedCountry, inputValue })}
                />
              )}
            </View>
          ) : (
            <View style={styles.button}>
              {isFormValid ? (
                <>
                  {loadingSignUp ? (
                    <Button
                      buttonStyle={styles.buttonStyle}
                      title="SIGN UP"
                      loading
                      disabled
                    />
                  ) : (
                    <Button
                      buttonStyle={styles.buttonStyle}
                      title="SIGN UP"
                      onPress={() => signup({ firstname, lastname })}
                    />
                  )}
                </>
              ) : (
                <Button
                  buttonStyle={styles.buttonStyle}
                  title="SIGN UP"
                  disabled
                />
              )}
            </View>
          )}
          </>
        ) : (
          <View style={styles.button}>
            <Button
              buttonStyle={styles.buttonStyle}
              title="SIGN IN"
              disabled
            />
          </View>
        )}
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    borderWidth: 10,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 15
  },
  headerText:{
    marginTop: 20
  },
  phoneInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    alignItems: 'center'
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
    height: 50,
    marginTop: 20,
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 10
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
    marginTop: 20
  },
  button: {
    marginTop: 30
  }
});

export default SigninScreen;