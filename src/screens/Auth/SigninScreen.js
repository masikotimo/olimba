import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthForm from '../../components/AuthForm';
import NavLink from '../../components/NavLink';
import { setLogin, setUnitId, setUnitName, setPhoneNumber, setUserSignUp } from '../../store/authslice';
import { useDispatch, useSelector } from "react-redux";
import backendApi from "../../api/backend";
import { StatusBar } from 'expo-status-bar';

const SigninScreen = ({navigation}) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [loadingSignIn, setLoadingSignIn] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    
  }, [])

  const signin = async ({ selectedCountry, inputValue, password }) => {
    try {
      setLoadingSignIn(true)
      const phoneNumber = selectedCountry.callingCode+inputValue
      const unSpacedNumber = phoneNumber.replaceAll(" ", "")
      const response = await backendApi.post("/accounts/authenticate", { "username": unSpacedNumber, "password": password });

      if(response.data.status === 200){
        dispatch(setLogin({ user: response.data.data.user_details, token: response.data.data.token.token }));
        dispatch(setUnitId(response.data.data.units[0].related_rental_unit.id))
        dispatch(setUnitName(response.data.data.units[0].related_rental_unit.unit_name))
        await AsyncStorage.setItem("token", response.data.data.token.token);
        await AsyncStorage.setItem("user_details", JSON.stringify(response.data.data.user_details));
        await AsyncStorage.setItem("unit_id", String(response.data.data.units[0].related_rental_unit.id))
        setLoadingSignIn(false)
      } else if (response.data.status === 203){
        dispatch(setPhoneNumber(unSpacedNumber))
        dispatch(setUserSignUp(response.data.data.user_details))
        setLoadingSignIn(false)
        navigation.navigate("ResetPassword")
      } else if (response.data.status === 404){
        setErrorMessage("Invalid Username or Password")
        setLoadingSignIn(false)
      }
      
    } catch (err) {
      setErrorMessage("Invalid Username or Password")
      setLoadingSignIn(false)
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <AuthForm
        headerText="Welcome Back"
        helperText="Thanks for choosing Rentbeta, We are ready to serve you"
        errorMessage={errorMessage}
        loadingSignIn={loadingSignIn}
        onSubmit={signin}
        submitButtonText="SIGN IN"
      />
      <NavLink
        linkText="Forgot Password?"
        routeName="ForgotPassword"
      />
      <NavLink
        text="Dont have an account?"
        linkText="Register"
        routeName="Signup"
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
  container: {
    flex: 1,
    marginTop: 80,
    borderWidth: 10,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 15
  },
});

export default SigninScreen;