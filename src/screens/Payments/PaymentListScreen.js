import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-elements';
import TransactionsCard from '../../components/TransactionsCard';
import { useSelector } from 'react-redux';

const PaymentListScreen = ({}) => {
    const insets = useSafeAreaInsets();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const unit = useSelector((state) => state.auth.unit_id)
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [rentalPayments, setRentalPayments] = useState([]);
    const [isLoadingRentalPayments, setLoadingRentalPayments] = useState(true);
	const [paymentsError, setPaymentsError] = useState(false);

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`https://api.rentbeta.fanya.ug/api/v1/tenants/payments?tenant_id=${user.id}&unit_id=${unit}`);
            setRentalPayments(response.data.data);
            setLoadingRentalPayments(false);
        } catch (e) {
            setTicketsError(true);
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
              <View style={styles.welcomeHeader}>
                <Text style={styles.headerText} h3>Payments</Text>
                {isLoadingRentalPayments ? (
                    <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
                ) : (
                    <FlatList
                        data={rentalPayments}
                        keyExtractor={(payment) => payment.id}
                        renderItem={({item}) => {
                            return <TransactionsCard cardTitle={"Payment"} cardAmount={item.amount} cardDate={"Aug 8, 2023"}/>
                        }}
                    />
                )}
              </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    headerText: {
        fontWeight: 400,
    },
    welcomeHeader: {
        marginLeft: 15
    },
})

export default PaymentListScreen