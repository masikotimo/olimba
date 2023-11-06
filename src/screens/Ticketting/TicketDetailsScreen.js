import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TicketUpdateCard from '../../components/TicketUpdateCard';
import { useSelector } from 'react-redux';


const TicketDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);
  const ticketId = useSelector((state) => state.auth.ticketId)
  const [ticketDetails, setTicketDetails] = useState([])
  const [isLoadingTicketDetails, setLoadingTicketDetails] = useState(true)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const formatDate = (date) => {
    const convertedDate = new Date(date)
    return convertedDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-')};
  
  const fetchTicketDetails = async () => {
    try {
        const response = await axios.get(`https://api.rentbeta.iolabsug.com/api/v1/tenants/tickets/single?ticket_id=${ticketId}`);
        setTicketDetails(response.data.data);
        setLoadingTicketDetails(false);
    } catch (e) {
      setLoadingTicketDetails(false);
    }
};

useEffect(() => {
  fetchTicketDetails()
}, [])

  return (
    <View style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right}}>
        {isLoadingTicketDetails ? (
          <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
        ) : (
          <View style={styles.container}>
            {/* <View style={styles.welcomeHeader}>
              <Text style={styles.headerText} h3>Rental Schedule</Text>
            </View> */}
            
            {ticketDetails.status === 0 ? (
              <Card containerStyle={styles.trackerCard}>
                <Text style={styles.trackerCardh2} h2>Status: Pending</Text>
                <Card.Divider color="#FCB200"/>
                <Text style={styles.trackerCardh5} h4>Date Logged: {formatDate(ticketDetails.date_created)}</Text>
              </Card>
            ) : (
              <Card containerStyle={styles.trackerCard}>
                <Text style={styles.trackerCardh2} h2>Status: Resolved</Text>
                <Card.Divider color="#FCB200"/>
                <Text style={styles.trackerCardh5} h4>Date Logged: {formatDate(ticketDetails.date_created)}</Text>
            </Card>
            )}
            <Text style={styles.trackerCardh5} h4>Ticket Updates</Text>
            <View >
              <FlatList
                  data={ticketDetails.updates}
                  keyExtractor={(update) => update.id}
                  renderItem={({item}) => {
                      return <TicketUpdateCard cardTitle={item.description} cardDate={formatDate(item.date_created)}/>
                  }}
              />
            </View>
          </View>
        )}
    </View>  
  )
};

const styles = StyleSheet.create({ 
    container: {
      padding: 10
    },
    headerText: {
        fontWeight: 400,
    },
    welcomeHeader: {
        marginLeft: 15
    },
    trackerCard: {
        borderRadius: 25,
        padding: 10,
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

export default TicketDetailsScreen;