import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { View, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-elements';
import TransactionsCard from '../../components/TransactionsCard';
import { setSchedule } from '../../store/authslice';
import { useSelector, useDispatch } from 'react-redux';
import { dateFormatter } from '../../utilities/dateFormatter';
import {API_URL} from '@env';

const RentalScheduleListScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const unit = useSelector((state) => state.auth.unit_id)
    const dispatch = useDispatch()
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [rentSchedules, setRentSchedules] = useState([]);
    const [loadingRentSchedules, setLoadingRentSchedules] = useState(true)
    const [error, setError] = useState(false)

    const formatDate = (date) => {
        const convertedDate = new Date(date)
        return convertedDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('-')};

    const fetchRentSchedules = async () => {
        try {
            const response = await axios.get(`${API_URL}/tenants/occupancy_list?tenant_id=${user.id}&option=false`);
            setRentSchedules(response.data.data);
            setLoadingRentSchedules(false);
        } catch (e) {
            setError(true);
            setLoadingRentSchedules(false);
        }
    };

    useEffect(() => {
        fetchRentSchedules()

        const unsubscribe = navigation.addListener('focus', () => {
            fetchRentSchedules();
        })
      
        return unsubscribe
    }, [navigation])

    return (
        <View >
            <View style={styles.container}>
              <View style={styles.welcomeHeader}>
                <View style={styles.scheduleHead}> 
                    <Text h3Style={styles.headerText} h3>Rent Schedules</Text>
                    <Button
                        buttonStyle={styles.buttonStyle}
                        title="Add"
                        onPress={() => navigation.navigate("RentSchedule")}
                    />
                </View>

                {loadingRentSchedules ? (
                    <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>

                ) : (
                    <FlatList 
                        data={rentSchedules}
                        keyExtractor={(payment) => payment.related_rental_unit.id}
                        renderItem={({item}) => {
                            if(item.creation_status) {
                                return <TransactionsCard cardTitle={item.related_rental_unit.unit_name} cardAmount={item.amount} cardDate={dateFormatter(item.date_added)} onPress={() => {navigation.navigate("ScheduleDetails"), dispatch(setSchedule(item))}}/>
                             } else {
                                return <TransactionsCard cardTitle={item.related_rental_unit.unit_name} cardAmount={item.amount} cardDate={dateFormatter(item.initial_payment_date)} onPress={() => {navigation.navigate("ScheduleDetails"), dispatch(setSchedule(item))}}/>
                            }
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
        marginTop: 10
    },
    headerText: {
        fontWeight: 400,
    },
    welcomeHeader: {
        marginLeft: 15
    },
    scheduleHead: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15,
        width: "auto"
    },
})

export default RentalScheduleListScreen