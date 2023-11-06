import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionsCard from '../../components/TransactionsCard';

const LoanCreditScoreScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right}}>
        <View style={styles.container}>
          {/* <View style={styles.welcomeHeader}>
            <Text style={styles.headerText} h3>Rental TopUps</Text>
          </View> */}
          
          <Card containerStyle={styles.trackerCard}>
            <Text style={styles.trackerCardh5} h4>Your Credit Score</Text>
              <Card.Divider color="#FCB200"/>
              <Text style={styles.trackerCardh2} h2>UGX 0</Text>
          </Card>

          <Button
            buttonStyle={styles.buttonStyle}
            title="Apply for Rental Top Up"
            //   onPress={() => navigation.navigate("PaymentMethod")}
            disabled
           />
          {/* <View >
            <View style={styles.filterPanel}>
                <Text style={styles.leftText} h5>Previous Loans</Text>    
                <Text style={styles.rightText} h5>See All</Text>
            </View>
            <View>
                <TransactionsCard cardTitle={"Rental Loan"} cardAmount={"2,300,000"} cardDate={"May 10, 2022"} cardInterest={"Interest Rate 14%"}/>
                <TransactionsCard cardTitle={"Rental Loan"} cardAmount={"2,300,000"} cardDate={"May 10, 2022"} cardInterest={"Interest Rate 14%"}/>
                <TransactionsCard cardTitle={"Rental Loan"} cardAmount={"2,300,000"} cardDate={"May 10, 2022"} cardInterest={"Interest Rate 14%"}/>
            </View>
          </View> */}
        </View>
    </View>  
  )
};

const styles = StyleSheet.create({ 
    headerText: {
        fontWeight: 400,
    },
    welcomeHeader: {
        marginTop: 30,
        marginLeft: 15
    },
    trackerCard: {
        borderRadius: 25,
        padding: 20,
        marginTop: 10,
        backgroundColor: "#F0ECE6",
        borderColor: "#F0ECE6"
    },
    trackerCardh2: {
        fontWeight: 700
    },
    trackerCardh5: {
        color: "#FCB200",
        marginTop: 15,
        marginBottom: 5
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginTop: 25,
        marginLeft: 15,
        marginRight: 15
    },
    bottomContainer: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30
    },
    filterPanel: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30
    },
    leftText: {
        fontWeight: 500
    },
    rightText: {
        fontWeight: 500
    },
    
});

export default LoanCreditScoreScreen;