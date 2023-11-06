import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionsCard from '../../components/TransactionsCard';
import { useSelector } from 'react-redux';


const PaymentDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const schedule = useSelector((state) => state.auth.schedule);
  const user = useSelector((state) => state.auth.user);
  const [payments, setPayments] = useState([])
  const [isLoadingRentalPayments, setLoadingRentalPayments] = useState(false)
  const unit = schedule.related_rental_unit.id
  const unit_name = schedule.related_rental_unit.unit_name
  const token = useSelector((state) => state.auth.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const formatDate = (date) => {
    const convertedDate = new Date(date)
    return convertedDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-')};
  
  const fetchPayments = async () => {
    try {
        const response = await axios.get(`https://api.rentbeta.fanya.ug/api/v1/tenants/payments?tenant_id=${user.id}&unit_id=${unit}`);
        setPayments(response.data.data);
        setLoadingRentalPayments(false);
    } catch (e) {
        setLoadingRentalPayments(false);
    }
};

useEffect(() => {
    fetchPayments()
}, [])

  return (
    <View style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right}}>
        <View style={styles.container}>
          {/* <View style={styles.welcomeHeader}>
            <Text style={styles.headerText} h3>Rental Schedule</Text>
          </View> */}
          
          <Card containerStyle={styles.trackerCard}>
            <Text style={styles.trackerCardh2} h2>Unit Name: {unit_name}</Text>
            <Card.Divider color="#FCB200"/>
            <Text style={styles.trackerCardh5} h4>Start Date: </Text>
          </Card>
          <Text style={styles.trackerCardh5} h4>Transactions</Text>
          <View >
            {isLoadingRentalPayments ? (
                    <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
                ) : (
                    <FlatList
                        data={payments}
                        keyExtractor={(payment) => payment.id}
                        renderItem={({item}) => {
                            return <TransactionsCard cardTitle={"Payment"} cardAmount={item.amount} cardDate={"10th Aug, 2023"}/>
                        }}
                    />
                )}
          </View>
        </View>
    </View>  
  )
};

const styles = StyleSheet.create({ 
    headerText: {
        fontWeight: 400,
    },
    welcomeHeader: {
        marginLeft: 15
    },
    trackerCard: {
        borderRadius: 25,
        padding: 20,
        marginTop: 30,
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

export default PaymentDetailsScreen;