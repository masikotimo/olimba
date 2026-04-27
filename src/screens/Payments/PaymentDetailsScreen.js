import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Badge, Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../../utilities/dateFormatter';
import { currencyFormatter } from '../../utilities/currencyFormatter';

const PaymentDetailsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const paymentDetails = useSelector((state) => state.auth.paymentDetails);
  const hasPayment = Boolean(paymentDetails && paymentDetails.id);

  if (!hasPayment) {
    return (
      <View style={styles.emptyContainer}>
        <Text h4>No payment selected.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{
        paddingBottom: insets.bottom,
        }}>
        <View style={styles.container}>
          
          <Card containerStyle={styles.trackerCard}>
            <Text h3Style={styles.trackerCardh3} h3>Unit Name: {paymentDetails?.related_rental_unit?.unit_name || "N/A"}</Text>
            <Text h4Style={styles.trackerCardh3} h4>Unit Rent: {currencyFormatter(parseInt(paymentDetails?.unit_rent || 0))}</Text>
          </Card>
          <Card containerStyle={styles.detailsCard}>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Rent Schedule:</Text>
                <Text h4Style={styles.detailsText} h4>MONTHLY</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Amount Paid:</Text>
                <Text h4Style={styles.detailsText} h4>{currencyFormatter(parseInt(paymentDetails.amount))}</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Payment Date:</Text>
                <Text h4Style={styles.detailsText} h4>{dateFormatter(paymentDetails.date_paid || paymentDetails.date_created)}</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Payment Method:</Text>
                <Text h4Style={styles.detailsText} h4>{paymentDetails?.payment_method?.name || "N/A"}</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Status:</Text>
                {paymentDetails.status ? (
                    <Badge value="Successful" status="success" />

                ) : (
                    <Badge value="Unsuccessful" status="error" />
                )}
            </View>
            <Button
              title="View Receipt"
              buttonStyle={styles.receiptButton}
              onPress={() => navigation.navigate("PaymentReceipt")}
            />
         </Card>
        </View>
    </ScrollView>  
  )
};

const styles = StyleSheet.create({ 
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    container: {
        marginBottom: 20
    },
    trackerCard: {
        borderRadius: 10,
        padding: 20,
        marginTop: 30,
        backgroundColor: "#EFECEC",
        borderColor: "#EFECEC"
    },
    detailsTextView:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    detailsCard: {
        borderRadius: 4,
        padding: 20,
        marginTop: 20,
        backgroundColor: "#FFFFFF",
        borderColor: "#F0ECE6"
    },
    trackerCardh3: {
        fontWeight: 500,
        marginBottom: 15
    },
    detailsText: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 200
    },
    receiptButton: {
        backgroundColor: "#FCB200",
        borderRadius: 10,
        marginTop: 20,
        paddingVertical: 12
    }
    
});

export default PaymentDetailsScreen;