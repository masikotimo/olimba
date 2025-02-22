import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-elements';
import TicketsCard from '../../components/TicketsCard';
import { useSelector, useDispatch } from "react-redux";
import { setTicketId } from '../../store/authslice';
import axiosInstance from '../../api/axiosInstance';

const TicketListScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
	const [rentalTickets, setRentalTickets] = useState([]);
	const [isLoadingRentalTickets, setLoadingRentalTickets] = useState(true);
	const [ticketsError, setTicketsError] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosInstance.get(`/tenants/tickets?tenant_id=${user.id}`);
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
    <View >
      <View style={styles.container}>
        <View style={styles.welcomeHeader}>
          <Text style={styles.headerText} h3>Tickets</Text>
          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={styles.buttonStyle}
              title="New Ticket"
                onPress={() => navigation.navigate("TicketCreate")}
            />
            {/* <Button
              buttonStyle={styles.buttonStyle}
              title="Message"
            /> */}
          </View>
          <View >
            <View style={styles.filterPanel}>
                <Text style={styles.leftText} h5>Tickets</Text>  
                <TouchableOpacity onPress={() => navigation.navigate("TicketVerboseList")}>
                  <Text style={styles.rightText} h5>See All</Text>
                </TouchableOpacity>  
            </View>
            <View>
                {isLoadingRentalTickets ? (
                  <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
                ) : (
                  <FlatList 
                    data={rentalTickets}
                    keyExtractor={(ticket) => ticket.id}
                    renderItem={({item}) => {
                        return <TicketsCard cardTitle={item.title} cardDate={"May, 10 2022"} cardInterest={"Pending"} touchEvent={() => {navigation.navigate("TicketDetails"), dispatch(setTicketId(item.id))}}/>
                    }}

                  />
                )}
            </View>
          </View>
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
    marginTop: 18,
    marginLeft: 15
  },
  buttonContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },  
  filterPanel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 40
  },
  leftText: {
      fontWeight: 500
  },
  rightText: {
      fontWeight: 500
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    marginTop: 25,
    marginLeft: 15,
    marginRight: 15,
    width: "auto"
},
});

export default TicketListScreen;