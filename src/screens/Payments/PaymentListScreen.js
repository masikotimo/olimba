import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-elements';
import TransactionsCard from '../../components/TransactionsCard';
import { AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { dateFormatter } from '../../utilities/dateFormatter';
import { setPaymentDetails } from '../../store/authslice';

const PaymentListScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const unit = useSelector((state) => state.auth.unit_id)
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [rentalPayments, setRentalPayments] = useState([]);
    const [isLoadingRentalPayments, setLoadingRentalPayments] = useState(true);
	const [paymentsError, setPaymentsError] = useState(false);
    const url = "https://api.rentbeta.fanya.ug/api/v1"

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`${url}/tenants/payments?tenant_id=${user.id}`);
            setRentalPayments(response.data.data);
            setLoadingRentalPayments(false);
        } catch (e) {
            setLoadingRentalPayments(false);
            setPaymentsError(true);
        }
    };

    const navigatePaymentDetails = (item) => {
        dispatch(setPaymentDetails(item))
        navigation.navigate("PaymentDetails")
    }

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
                {paymentsError ?  (
                    <></>
                ) : (
                    <>
                    {isLoadingRentalPayments ? (
                        <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
                    ) : (
                        <>
                            {rentalPayments.length > 0 ? (
                                <FlatList
                                    data={rentalPayments}
                                    keyExtractor={(payment) => payment.id}
                                    renderItem={({item}) => {
                                        return <TransactionsCard cardTitle={item.related_rental_unit.unit_name} cardAmount={item.amount} cardDate={dateFormatter(item.date_created)} onPress={() => navigatePaymentDetails(item)}/>
                                    }}
                                />
                            ) : (
                                <View style={styles.emptyView}>
                                    <Text h4Style={{fontSize: 18, color: "#b4b5b8", marginBottom: 20}} h4>You haven't made any rental payments yet</Text>
                                    <AntDesign name="codesquareo" size={70} color="#b4b5b8" />
                                </View>
                            )}
                            
                        </>
                    )}
                    </>
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
    emptyView: {
        marginTop: 50,
        alignItems: "center"
    }
})

export default PaymentListScreen