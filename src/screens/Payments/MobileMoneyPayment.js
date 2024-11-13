import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import PhoneInput from 'react-native-international-phone-number';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setPaymentId } from '../../store/authslice';
import {API_URL} from '@env';

const MobileMoneyPayment = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [amount, setAmount] = useState('');
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const unit_id = useSelector((state) => state.auth.unit_id);
    const [fees, setFees] = useState("")
    const [total, setTotal] = useState({"total":0, "fee":0})
    const [word, setWord] = useState("Pay Rent")
    const [loadingFees, setLoadingFees] = useState(true)
    const [loadingPaymentCall, setLoadingPaymentCall] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const fetchPaymentSettings = async () => {
      try {
          const response = await axios.get(`${API_URL}/tenants/payments/settings`);
          setFees(response.data.data);
          setLoadingFees(false);
      } catch (e) {
          setLoadingFees(false);
      }
      };

      useEffect(() => {
        fetchPaymentSettings()
      }, [])
    

    const defaultValue = "+256"+user.phone_number
    function handleInputValue(phoneNumber) {
      setInputValue(phoneNumber);
    }
  
    function handleSelectedCountry(country) {
      setSelectedCountry(country);
    }

    const handleChangeAmount = (amount) => {
      setAmount(amount)
      setTotal({"total":amount, "fee": amount*(fees.fee/100)})
    }

    const makePayment = async ({ amount }) => {
        try {
          setLoadingPaymentCall(true)
          const unPhone = selectedCountry.callingCode+inputValue
          const phoneNumber = unPhone.replaceAll(" ", "")
          const response = await axios.post(`${API_URL}/tenants/payments`, { "related_rental_unit": unit_id, "related_tenant": user.id, "phone_number": phoneNumber, "amount": amount });
          if(response.data.status === 200) {
            dispatch(setPaymentId(response.data.data.id))
            setTimeout(() => {
              setLoadingPaymentCall(false)
              setAmount("")
              setTotal({"total":0, "fee":0})
              navigation.navigate("PaymentWaiting");
            }, 2000);
          }
        } catch (err) {
          console.log(err)
          setErrorMessage("Payment Failed")
          setLoadingPaymentCall(false)
        }
    };
  
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <PhoneInput
              value={inputValue}
              defaultValue={defaultValue}
              onChangePhoneNumber={handleInputValue}
              selectedCountry={selectedCountry}
              onChangeSelectedCountry={handleSelectedCountry}
            />
            <TextInput
              placeholder="Enter Amount"
              value={amount}
              onChangeText={amount => handleChangeAmount(amount)}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <View style={{alignItems: "center", marginTop: 15}}>
              <Text style={styles.disclaimer}>A transaction fee of {total.fee} will be added on top of the amount entered above</Text>
            </View>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            {loadingPaymentCall ? (
              <Button
              buttonStyle={styles.buttonStyle}
              title="Make Payment"
              onPress={() => makePayment({ amount })}
              disabled
              loading
            />
            ) : (
              <Button
                buttonStyle={styles.buttonStyle}
                title={word}
                onPress={() => makePayment({ amount })}
              />
            )}
          </View>
          {/* {isOpen && (
          <>
            <Pressable style={styles.backdrop} onPress={toggleSheet}/>
            <View style={styles.sheet}>
              <BottomModal navigation={navigation}/>
            </View>
          </>
          )} */}
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FF",
      padding: 10
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
      borderRadius: 10,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 60
    },
    headerTextStyle: {
      fontWeight: 700
    },
    helperTextStyle: {
      color: '#7D8FAB',
      marginTop: 8
    },
    topInputStyle: {
      marginLeft: 15,
      marginRight: 15,
    },
    bottomInputStyle: {
      marginLeft: 15,
      marginRight: 15
    },
    input: {
      height: 50,
      marginTop: 20,
      borderWidth: 0.5,
      padding: 15,
      borderRadius: 10
    },
    topLabelStyle: {
        marginTop: 40
    },
    bottomLabelStyle: {
        marginTop: 20
    },
    sheet: {
      backgroundColor: "white",
      padding: 16,
      height: 350,
      width: "100%",
      position: "absolute",
      bottom: -20 * 1.1,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      zIndex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#F8F9FF",
      zIndex: 1,
    },
    disclaimer: {
      marginTop: 20,
      paddingLeft: 15,
      paddingRight: 15,
      fontSize: 15,
      fontWeight: 300
    },
  });
  
  export default MobileMoneyPayment;