import React, {useState, useEffect} from 'react';
import axiosInstance from '../../api/axiosInstance';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionsCard from '../../components/TransactionsCard';
import { useSelector } from 'react-redux';
import { monthFormatter } from '../../utilities/dateFormatter';
import { currencyFormatter } from '../../utilities/currencyFormatter';
import {API_URL} from '@env';


const RentalScheduleDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const schedule = useSelector((state) => state.auth.schedule);
  const user = useSelector((state) => state.auth.user);
  const [payments, setPayments] = useState([])
  const [unitDetails, setUnitDetails] = useState([])
  const [isLoadingRentalPayments, setLoadingRentalPayments] = useState(true)
  const unit = schedule.related_rental_unit.id
  const unit_name = schedule.related_rental_unit.unit_name
  const token = useSelector((state) => state.auth.token);

  const formatDate = (date) => {
    const convertedDate = new Date(date)
    return convertedDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-')};
  
  const fetchPayments = async () => {
    try {
        const response = await axiosInstance.get(`/tenants/mark_occupancy?tenant_id=${user.id}&unit_id=${unit}`);
        setUnitDetails(response.data.data.unit)
        setPayments(response.data.data.schedules);
        setLoadingRentalPayments(false);
    } catch (e) {
        setLoadingRentalPayments(false);
    }
};

useEffect(() => {
    fetchPayments()
}, [])

  return (
    <View>
        <View style={styles.container}>
          {/* <View style={styles.welcomeHeader}>
            <Text style={styles.headerText} h3>Rental Schedule</Text>
          </View> */}
          
          <Card containerStyle={styles.trackerCard}>
            <Text h3Style={styles.trackerCardh2} h3>Unit Name: {unit_name}</Text>
            <Card.Divider color="#FCB200"/>
            <Text h4Style={styles.trackerCardh5} h4>Unit Rent: {currencyFormatter(parseInt(unitDetails.unit_rent))} </Text>
          </Card>
          <Text h4Style={styles.transactionText} h4>Transactions</Text>
          <View style={styles.transactionsContainer}>
            {isLoadingRentalPayments ? (
                    <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
                ) : (
                    <FlatList
                        data={payments}
                        keyExtractor={(payment) => payment.id}
                        renderItem={({item}) => {
                            return <TransactionsCard cardTitle={monthFormatter(item.start_date)} cardAmount={item.total_amout_paid} cardInterest={item.outstanding_balance} cardDate={item.end_date}/>
                        }}
                    />
                )}
          </View>
        </View>
    </View>  
  )
};

const styles = StyleSheet.create({ 
    container: {
        marginTop: 2,
    },
    trackerCard: {
        borderRadius: 25,
        padding: 20,
        marginTop: 10,
        backgroundColor: "#EFECEC",
        borderColor: "#EFECEC"
    },
    trackerCardh2: {
        fontWeight: 600
    },
    trackerCardh5: {
        color: "#FCB200",
        marginTop: 10,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: 400
    },
    transactionText:{
        fontWeight: 300,
        marginTop: 20,
        marginLeft: 15,
        fontSize: 18
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginTop: 25,
        marginLeft: 15,
        marginRight: 15
    },
    transactionsContainer: {
        
    }
});

export default RentalScheduleDetailsScreen;