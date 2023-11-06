import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useInterval } from '../../utilities/useInterval';
import { Text } from 'react-native-elements';
import { useSelector } from "react-redux";

const PaymentWaitingScreen = ({navigation}) => {
    const [status, setStatus] = useState("")
    const [loadingStatus, setLoadingStatus] = useState("")
    const [statusError, setStatusError] = useState(false)
    const token = useSelector((state) => state.auth.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const payId = useSelector((state) => state.auth.paymentId);

    const fetchPaymentStatus = async () => {
        try {
            const response = await axios.post(`https://api.rentbeta.fanya.ug/api/v1/tenants/payments/status`, {"id": payId});
            console.log(response.data.data)
            if(response.data.status === 500){
                setStatusError(true)
                setStatus("Insufficient Funds, Please try again")
            };
            if(response.data.status === 201){
                navigation.navigate("RentalTracker")
            };
            setLoadingFees(false);
        } catch (e) {
            console.log(e)
            console.log("Payment Failed");
            // navigation.navigate("MobileMoneyPayment")
        }
    };
  
    useInterval(async () => {
        console.log("polling for status")
        const status = await fetchPaymentStatus()
    }, 5000)

  return (
    <ScrollView style={styles.formContainer}>
      
      <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
      
      <View style={{alignItems: "center"}}>
        <Text style={styles.disclaimer}>We are waiting for your Confirmation</Text>

        <Text style={styles.disclaimer}>Please follow the instructions below and do not leave the screen. This may take upto 2 minutes</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.disclaimer}>If you do not receive a USSD prompt, follow these instructions to complete your payment</Text>
        <Text style={styles.disclaimer}>1. Dial *165*8*2# for MTN or *185*8*2# for Airtel to see the pending payment on the USSD Menu</Text>
        <Text style={styles.disclaimer}>2. Enter your pin to confirm</Text>
        <Text style={styles.disclaimer}>3. If your payment is successful, you will be redirected to the Rental Tracker</Text>
      </View>

      {statusError ? (
        <Text style={styles.disclaimer}>{status}</Text>
      ) : (<></>)}
        <Button
            buttonStyle={styles.buttonStyle}
            title="Try Again"
            onPress={() => navigation.navigate("MobileMoneyPayment")}
        />
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15
  },
  formContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
  },
  textContainer: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15
  },
  disclaimer: {
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 15,
    fontWeight: 300
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 60
  },
});

export default PaymentWaitingScreen;