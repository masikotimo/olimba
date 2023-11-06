import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import { Text, Button, Card, Avatar, Skeleton } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { setUnitId, setUnitName } from '../../store/authslice';
import NetworkStatus from '../../components/NetworkStatus';

const RentalTrackerScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [occupancyDetails, setOccupancyDetails] = useState({});
  const [isLoadingOccupancyDetails, setLoadingOccupancyDetails] = useState(true);
  const [occupancyError, setOccupancyError] = useState(false);
  const [colour, setColor] = useState("")
  const [rentals, setRentals] = useState([])
  const [isLoadingRentals, setLoadingRentals] = useState(true);
	const [error, setError] = useState(false);
  const token = useSelector((state) => state.auth.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const unit_id = useSelector((state) => state.auth.unit_id);
  const unit_name = useSelector((state) => state.auth.unit_name);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const useGetOccupancyDetails = async () => {    
    try {
      setLoadingOccupancyDetails(true)
      const response = await axios.post(`https://api.rentbeta.fanya.ug/api/v1/tenants/occupancy`, {"tenant_id": user.id, "unit_id": unit_id});
      setOccupancyDetails(response.data.data);
      if(response.data.data.rate === 0){
        setColor("#82ed9f")
      }
      if(response.data.data.rate === 1){
        setColor("#f2f7f4")
      }
      if(response.data.data.rate === 2){
        setColor("#f08694")
      }
      if(response.data.data.rate === 3){
        setColor("#fc0526")
      }
      setLoadingOccupancyDetails(false);
    } catch (e) {
      console.log(e)
      setOccupancyError(true);
      setLoadingOccupancyDetails(false);
    }
  }

  const useGetOccupancyList = async () => {    
    try {
      const response = await axios.get(`https://api.rentbeta.fanya.ug/api/v1/tenants/occupancy_list?tenant_id=${user.id}&option=false`);
      setRentals(response.data.data);
      setLoadingRentals(false);
    } catch (e) {
      setError(true);
      setLoadingRentals(false);
    }
  }

  useEffect(() => {
    useGetOccupancyDetails()
    useGetOccupancyList()

    const unsubscribe = navigation.addListener('focus', () => {
      useGetOccupancyDetails();
      useGetOccupancyList();
    })

    return unsubscribe
  }, [navigation, unit_id])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  let datesWhitelist = [{
    start: moment(),
    end: moment().add(3, 'days')  // total 4 days enabled
  }];


  return (
    <ScrollView 
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right}}>
      <View style={styles.container}>
        <NetworkStatus />
        <View style={styles.welcomeHeader}>
          {user ? (
            <Text style={styles.headerText} h3>Hello, {user.first_name}</Text>
          ) : (
            null
          )}
          {unit_id === null ? (<></>) : (
            <SelectDropdown
              data={rentals}
              onSelect={(selectedItem, index) => {
                dispatch(setUnitId(selectedItem.related_rental_unit.id))
                dispatch(setUnitName(selectedItem.related_rental_unit.unit_name))
              }}
              defaultButtonText={'Units'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.related_rental_unit.unit_name;
              }}
              rowTextForSelection={(item, index) => {
                return item.related_rental_unit.unit_name;
              }}
              buttonStyle={styles.dropdown2BtnStyle}
              buttonTextStyle={styles.dropdown2BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#FFF'} size={18} />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown2DropdownStyle}
              rowStyle={styles.dropdown2RowStyle}
              rowTextStyle={styles.dropdown2RowTxtStyle}
            />
          )}
        </View>
        
        {unit_id === null ? (
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
            <Text style={{fontSize: 15, fontWeight: 300}}>
              Welcome To RentBeta, Below is your personal Rental Tracker. You will be able to monitor progress of your rental payments using the Tracker below. Please Proceed to Create a Rent Schedule to start Tracking your Rental Payments
            </Text>
          </View>
        ) : (
            <></>
        )}
        {/* <CalendarStrip
          scrollable
          style={styles.horizontalCalendar}
          calendarColor={"#F0ECE6"}
          highlightDateNumberStyle={{ color: "#FCB200" }}
          highlightDateNameStyle={{color: '#FCB200'}}
          calendarHeaderStyle={{ color: "black" }}
          dateNumberStyle={{ color: "black" }}
          dateNameStyle={{ color: "black" }}
          iconContainer={{ flex: 0.1 }}
          selectedDate={moment()}
          // onDateSelected={(date) => dateUpdated(date)}
          iconLeft={{
            uri: "https://cdn-icons-png.flaticon.com/512/271/271220.png"
          }}
          iconRight={{
            uri: "https://cdn-icons-png.flaticon.com/512/271/271228.png"
          }}
        /> */}

        {unit_id === null ? (
          <Card containerStyle={styles.trackerCard} sx={{backgroundColor: "#82ed9f"}}>
            <View >
                <Text style={styles.trackerCardh5} h4>Your Personal Rental Tracker</Text>
                <Card.Divider color="#FCB200"/>
                <Text style={styles.trackerCardh2} h2>0 UGX</Text>
                <Button
                  buttonStyle={styles.buttonStyle}
                  title="Create Rent Schedule"
                  onPress={() => navigation.navigate("RentSchedule")}
                />
            </View>
          </Card>
        ): (
          <>
          {isLoadingOccupancyDetails ? (
            <Card containerStyle={{borderRadius: 25, padding: 25 }}>
              <View>
              <Card.Divider color="#FCB200" style={{marginTop: 20}}/>
                <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>
              <Card.Divider color="#FCB200" style={{ marginBottom: 20}}/>
              </View>
            </Card>
          ) : (
            <Card containerStyle={{borderRadius: 25, padding: 25, backgroundColor: colour}}>
              <View >
                  <Text style={styles.trackerCardh5} h4>Your Rent for Unit {unit_name}</Text>
                  <Card.Divider color="#FCB200"/>
                  <Text style={styles.trackerCardh2} h2>{occupancyDetails.amount_to_pay}</Text>
                  <Text style={styles.trackerCardh5} h4>Is Due in</Text>
                  <Card.Divider color="#FCB200"/>
                  <Text style={styles.trackerCardh2} h2>{occupancyDetails.days_left} Days</Text>
              </View>
            </Card>
          )} 
          </>
        )}

        {unit_id === null ? (
          <></>
        ) : (
          <>
          <Text style={styles.installmentText} h5>You can make a partial payment of {occupancyDetails.installment} today</Text>
          <Button
            buttonStyle={styles.buttonStyle}
            title="Pay Rent"
            onPress={() => navigation.navigate("MobileMoneyPayment")}
          />
          </>
        )}
        <View style={styles.servicesView}>
          <Card containerStyle={styles.servicesCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoanCreditScore')}
            >
              <AntDesign name="wallet" size={30} color="#FCB200" style={styles.cardIcon}/>
              <Text style={styles.serviceCardh5} h5>Rental TopUp</Text>
            </TouchableOpacity>
          </Card>
          {/* <Card containerStyle={styles.servicesCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('InsuranceRequest')}
            >
              <Ionicons name="newspaper-outline" size={30} color="#FCB200" />
              <Text style={styles.serviceCardh5} h5>Renter's Insurance</Text>
            </TouchableOpacity>
          </Card> */}
          <Card containerStyle={styles.servicesCard}>
            <TouchableOpacity>
              <AntDesign name="bulb1" size={30} color="#FCB200" style={styles.cardIcon}/>
              <Text style={styles.serviceCardh5} h5>Pay Utilities</Text>
            </TouchableOpacity>
          </Card>
          <Card containerStyle={styles.servicesCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PropertyDiscover')}
            >
              <Ionicons name="home-outline" size={30} color="#FCB200" style={styles.cardIcon}/>
              <Text style={styles.serviceCardh5} h5>Find a House</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({  
  container: {
    backgroundColor: "#F0ECE6",
  },
  horizontalCalendar: {
    height: 100,
    marginTop: 10,
    paddingTop: 10
  },
  headerText: {
    fontWeight: 700,
    flex: 3
  },
  welcomeHeader: {
    marginTop: 20,
    marginLeft: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  trackerCard: {
    borderRadius: 25,
    padding: 25,
  },
  trackerCardh2: {
    fontWeight: 700
  },
  trackerCardh5: {
    color: "#FCB200",
    marginTop: 10,
    marginBottom: 5
  },
  serviceCardh5: {
    marginTop: 8,
    fontWeight: 500
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15
  },
  installmentText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10
  },
  servicesView: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    marginTop: 15
  },
  servicesCard: {
    borderRadius: 15,
    flex:1,
    marginLeft: 4,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
    padding: 15
  },
  cardIcon: {
    alignSelf: "center"
  },
  dropdown2BtnStyle: {
    backgroundColor: '#444',
    borderRadius: 8,
    marginLeft: 15,
    width: "30%",
    flex: 1,
    alignContent: "center"
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

});

export default RentalTrackerScreen;