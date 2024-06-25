import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Badge } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../../utilities/dateFormatter';
import { currencyFormatter } from '../../utilities/currencyFormatter';

const PaymentDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const paymentDetails = useSelector((state) => state.auth.paymentDetails);

  return (
    <ScrollView style={{
        paddingBottom: insets.bottom,
        }}>
        <View style={styles.container}>
          
          <Card containerStyle={styles.trackerCard}>
            <Text h3Style={styles.trackerCardh3} h3>Unit Name: {paymentDetails.related_rental_unit.unit_name}</Text>
            <Text h4Style={styles.trackerCardh5} h4>Unit Rent: {paymentDetails.unit_rent}</Text>
          </Card>
          <Card containerStyle={styles.detailsCard}>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Rent Schedule:</Text>
                <Text h4Style={styles.detailsText} h4>MONTHLY</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Payment Date:</Text>
                <Text h4Style={styles.detailsText} h4>{currencyFormatter(parseInt(paymentDetails.amount))}</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Payment Date:</Text>
                <Text h4Style={styles.detailsText} h4>{dateFormatter(paymentDetails.date_created)}</Text>
            </View>
            <View style={styles.detailsTextView}>
                <Text h4Style={styles.detailsText} h4>Status:</Text>
                {paymentDetails.status ? (
                    <Badge value="Successful" status="success" />

                ) : (
                    <Badge value="Unsuccessful" status="error" />
                )}
            </View>
         </Card>
        </View>
    </ScrollView>  
  )
};

const styles = StyleSheet.create({ 
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
        fontWeight: 700,
        marginBottom: 15
    },
    detailsText: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 17
    },
    
});

export default PaymentDetailsScreen;