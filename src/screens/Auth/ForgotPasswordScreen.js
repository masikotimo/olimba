import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import PhoneInput from 'react-native-international-phone-number';
import { setIsReset, setUserSignUp } from '../../store/authslice';
import { useDispatch, useSelector } from "react-redux";
import backendApi from "../../api/backend";

const ForgotPasswordScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const userSignUp = useSelector((state) => state.auth.userSignUp);

    const [password, setPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [isValidPassword, setIsValidPassword] = useState(false)
    const [loadingUserDetails, setLoadingUserDetails] = useState(false)
    const [userExists, setUserExists] = useState(false)
    const [fieldActive, setFieldActive] = useState(false)

  
    const [errors, setErrors] = useState({}); 
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => { 
        setLoadingSubmit(false)
        validateForm(); 
        matchValidPassword();
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

    const fetchUserDetails = async (phone) => {
        try {
            setLoadingUserDetails(true)
            const phoneNumber = selectedCountry.callingCode+phone
            const unSpacedNumber = phoneNumber.replaceAll(" ", "")
            console.log(unSpacedNumber)
            const response = await backendApi.post("/accounts/users/details", { "phone_number": unSpacedNumber});

            if(response.data.status === 206){
                dispatch(setUserSignUp(response.data.data))
                setLoadingUserDetails(false)
                setUserExists(true)
                setFieldActive(true)
            } else if (response.data.status === 200){
                setLoadingUserDetails(false)
                setUserExists(false)
                setFieldActive(false)
                setErrorMessage("Account isn't active, Please contact support")
            } else if (response.data.status === 404){
                setLoadingUserDetails(false)
                setUserExists(false)
                setFieldActive(false)
                setErrorMessage("Account doesn't exist")
                setLoadingSignIn(false)
            }
        } catch (err) {
            setErrorMessage("Invalid Username or Password")
            setLoadingUserDetails(false)
        }
    };

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

    const handleInputValue = async (phoneNumber) =>  {
        setInputValue(phoneNumber);
        if(phoneNumber.length === 11){
            await fetchUserDetails(phoneNumber);
        }else{
            
        }
    }

    function handleSelectedCountry(country) {
        setSelectedCountry(country);
    }
    
  
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };
  
    const toggleConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
  
    

  return(
    <ScrollView style={styles.container}>
        <Text style={styles.headerTextStyle} h3>Forgot Password</Text>
        <Text style={styles.helperTextStyle} h5>Enter your phone number so we can send you the OTP code to reset your password</Text>
        <PhoneInput
          value={inputValue}
          defaultCountry="UG"
          onChangePhoneNumber={handleInputValue}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={handleSelectedCountry}
          disabled={fieldActive}
        />

        {loadingUserDetails && (
            <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
        )}

        {userExists && (
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
        )}

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
    </ScrollView>
  )
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        marginTop: 10,
        padding: 15,
        flexDirection: 'column',
        marginBottom: 50
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginTop: 40
    },
    headerTextStyle: {
        fontWeight: 700,
        alignSelf: "center",
    },
    helperTextStyle: {
        color: '#7D8FAB',
        marginTop: 8,
        alignSelf: "center",
        marginTop: 15,
        paddingLeft: 50,
        paddingRight: 50,
        marginBottom: 30
    },
    inputContainer: {
        display: "flex",
        flexDirection: 'column',
        marginVertical: 10
    },
    inputStyle: {
        borderColor: '#7D8FAB',
        borderWidth: 0.5,
        padding: 12,
    },
    inputView: {
        display:"flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
        borderStyle: "1px solid black",
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
});

export default ForgotPasswordScreen;