import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import TicketsCard from '../../components/TicketsCard';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

const TicketVerboseListScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
	const unit = useSelector((state) => state.auth.unit_id);
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [rentalTickets, setRentalTickets] = useState([]);
	const [isLoadingRentalTickets, setLoadingRentalTickets] = useState(true);
	const [ticketsError, setTicketsError] = useState(false);

    useEffect(() => {
		const fetchData = async () => {
			try {

          const response = await axios.get(`https://api.rentbeta.iolabsug.com/api/v1/tenants/tickets?tenant_id=${user.id}`);
          setRentalTickets(response.data.data);
          setLoadingRentalTickets(false);
        } catch (e) {
          setTicketsError(true);
          setLoadingRentalTickets(false);
        }
		};

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    })

    return unsubscribe
	}, [navigation]);

    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right}}>
            <View style={styles.container}>
              <View style={styles.welcomeHeader}>
                <Text style={styles.headerText} h3>All Tickets</Text>
                {isLoadingRentalTickets ? (
                  <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
                ) : (
                  <FlatList 
                    data={rentalTickets}
                    keyExtractor={(ticket) => ticket}
                    renderItem={({item}) => {
                        return <TicketsCard cardTitle={item.title} cardDate={"May, 10 2022"} cardInterest={"Pending"}/>
                    }}

                    />
                )}
              </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontWeight: 400,
    },
    welcomeHeader: {
        marginLeft: 15
    },
})

export default TicketVerboseListScreen