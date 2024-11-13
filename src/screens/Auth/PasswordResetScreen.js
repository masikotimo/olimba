import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { setIsReset } from '../../store/authslice';
import { useDispatch, useSelector } from "react-redux";
import backendApi from "../../api/backend";

const PasswordResetScreen = ({navigation}) => {
  const dispatch = useDispatch()

  const userSignUp = useSelector((state) => state.auth.userSignUp);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)

  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => { 
    setLoadingSubmit(false)
    validateForm(); 
    matchValidPassword()
  }, [password, confirmPassword]); 

  const validateForm = () => { 
    let errors = {};
    // Validate password field 
    if (!password) { 
        errors.password = 'Password is required.'; 
    } else if (password.length < 6) { 
        errors.password = 'Password must be at least 6 characters.'; 
    } 

    if (!confirmPassword) { 
      errors.confirmPassword = 'Confirm Password is required.'; 
    } else if (password !== confirmPassword) { 
      errors.password = 'The passwords do not match'; 
    }
    // Set the errors and update form validity 
    setErrors(errors); 
    setIsFormValid(Object.keys(errors).length === 0);
  }; 

  const matchValidPassword = () =>{
    if(password === confirmPassword && password.length>=6){
      setIsValidPassword(true);
    }else{
      setIsValidPassword(false);
    }
  }

  const onSubmitButtonPress = async () => {
    setLoadingSubmit(true)
    try {
      const response = await backendApi.post("/accounts/users/change_password", { "username": userSignUp.username, "password": password, "confirm_password": confirmPassword });
      if(response.data.status === 201){
        dispatch(setIsReset(true))
        navigation.navigate("Otp")
      } else{
        setErrorMessage("Failed")
      }
      setLoadingSubmit(false)
    } catch (err) {
      setErrorMessage("Failed")
      setLoadingSubmit(false)
    }
  };

  return(
    <View style={styles.container}>
        <Text style={styles.headerTextStyle} h3>Reset Password</Text>
        <Text style={styles.helperTextStyle} h5>Enter your new password and confirm with an OTP that we shall send to your phone number</Text>

        <View style={styles.inputContainer}>
          <View style={[styles.input2, styles.inputView]}>
            <TextInput
              secureTextEntry={showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholder='Enter New Password'
            />
            <TouchableOpacity onPress={togglePassword}>
              {showPassword ? (
                <FontAwesome5 name="eye-slash" size={20} color="#7D8FAB" />
              ) : (
                <FontAwesome5 name="eye" size={20} color="#7D8FAB"/>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.input2, styles.inputView]}>
            <TextInput
              secureTextEntry={showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholder='Confirm New Password'
            />
            <TouchableOpacity onPress={toggleConfirmPassword}>
              {showConfirmPassword ? (
                <FontAwesome5 name="eye-slash" size={20} color="#7D8FAB" />
              ) : (
                <FontAwesome5 name="eye" size={20} color="#7D8FAB" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {isValidPassword && (
          <>
            {loadingSubmit ? (
              <Button 
                buttonStyle={styles.buttonStyle}
                title="GET OTP"
                loading
                disabled
            />
            ) : (
              <Button
                buttonStyle={styles.buttonStyle}
                title="GET OTP"
                onPress={() => onSubmitButtonPress()}
              />
            )}
          </>
        )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
      flex:1,
      padding: 15,
      flexDirection: 'column',
      backgroundColor: 'white',
  },
  inputContainer: {
      display: "flex",
      flexDirection: 'column',
      marginVertical: 10
  },
  buttonStyle: {
      backgroundColor: '#FCB200',
      padding: 15,
      borderRadius: 10,
      marginTop: 50
  },
  headerTextStyle: {
      fontWeight: 700,
      alignSelf: "center",
      marginTop: 20,
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
  helperTextStyle: {
    color: '#7D8FAB',
    marginTop: 8,
    alignSelf: "center",
    marginTop: 15,
    paddingLeft: 50,
    paddingRight: 50,
  },

  button: {
      marginTop: 30
  }
});

export default PasswordResetScreen;