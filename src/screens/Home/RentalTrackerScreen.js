import React, {useState, useEffect, useCallback} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import { Text, Button, Card, Skeleton } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons,MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import { setUnitId, setUnitName } from '../../store/authslice';
import NetworkStatus from '../../components/NetworkStatus';
import { StatusBar } from 'expo-status-bar';
import { currencyFormatter } from '../../utilities/currencyFormatter';
import axiosInstance from '../../api/axiosInstance';


const RentalTrackerScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [occupancyDetails, setOccupancyDetails] = useState({});
  const [isLoadingOccupancyDetails, setLoadingOccupancyDetails] = useState(true);
  const [occupancyError, setOccupancyError] = useState(false);
  const [colour, setColor] = useState("")
  const [rentals, setRentals] = useState([])
  const [isLoadingRentals, setLoadingRentals] = useState(true);
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);
	const [error, setError] = useState(false);
  const unit_id = useSelector((state) => state.auth.unit_id);
  const unit_name = useSelector((state) => state.auth.unit_name);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const unitOptions = rentals
    .map((item) => {
      const unit = item?.related_rental_unit;
      if (!unit?.id || !unit?.unit_name) return null;
      return {
        id: unit.id,
        unit_name: unit.unit_name,
      };
    })
    .filter(Boolean);
  const hasUnitOptions = unitOptions.length > 0;
  const selectedUnit = unitOptions.find((unit) => String(unit.id) === String(unit_id));
  const hasSelectedUnitInOptions = Boolean(selectedUnit);
  const hasActiveTenancy = hasUnitOptions && hasSelectedUnitInOptions;
  const selectedUnitLabel =
    selectedUnit?.unit_name ||
    unit_name ||
    unitOptions[0]?.unit_name ||
    "Select Unit";


  const useGetOccupancyDetails = async () => {    
    if (!hasUnitOptions || !hasSelectedUnitInOptions || !user?.id) {
      setOccupancyDetails({});
      setLoadingOccupancyDetails(false);
      return;
    }

    try {
      setLoadingOccupancyDetails(true)
      const response = await axiosInstance.post(`/tenants/occupancy`, {
        "tenant_id": user.id, 
        "unit_id": selectedUnit.id
      });
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
      setOccupancyError(true);
      setLoadingOccupancyDetails(false);
    }
  }

  const useGetOccupancyList = async () => {    
    try {
      const response = await axiosInstance.get(`/tenants/occupancy_list?tenant_id=${user.id}&option=false`);
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
  }, [navigation, unit_id, refreshing, hasUnitOptions])

  useEffect(() => {
    if (unitOptions.length > 0 && !hasSelectedUnitInOptions) {
      const firstUnit = unitOptions[0];
      if (firstUnit?.id) {
        dispatch(setUnitId(firstUnit.id));
        dispatch(setUnitName(firstUnit.unit_name));
      }
      return;
    }

    if (unitOptions.length === 0 && unit_id) {
      dispatch(setUnitId(null));
      dispatch(setUnitName(""));
    }
  }, [unitOptions, hasSelectedUnitInOptions, unit_id, dispatch]);

  useEffect(() => {
    if (!hasUnitOptions) {
      setIsUnitMenuOpen(false);
    }
  }, [hasUnitOptions]);

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
      <StatusBar style="dark" />
      <View style={styles.container}>
        <NetworkStatus />
        <View style={styles.welcomeHeader}>
          {user ? (
            <Text style={styles.headerText} numberOfLines={1} h3>Hello, {user.first_name}</Text>
          ) : null}
          {hasUnitOptions ? (
            <View style={styles.unitSelectorInline}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.unitSelectorButton}
                onPress={() => setIsUnitMenuOpen((prev) => !prev)}
              >
                <Text style={styles.unitSelectorButtonText} numberOfLines={1}>
                  {selectedUnitLabel}
                </Text>
                <Ionicons
                  name={isUnitMenuOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#444"
                />
              </TouchableOpacity>
              {isUnitMenuOpen ? (
                <View style={styles.unitSelectorMenu}>
                  {unitOptions.map((item) => {
                    const isSelected = String(item.id) === String(unit_id);
                    return (
                      <TouchableOpacity
                        key={`${item.id}`}
                        activeOpacity={0.85}
                        style={[
                          styles.unitSelectorMenuItem,
                          isSelected && styles.unitSelectorMenuItemSelected,
                        ]}
                        onPress={() => {
                          dispatch(setUnitId(item.id));
                          dispatch(setUnitName(item.unit_name));
                          setIsUnitMenuOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.unitSelectorMenuItemText,
                            isSelected && styles.unitSelectorMenuItemTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item.unit_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        
        {!hasActiveTenancy ? (
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
            <Text style={{fontSize: 15, fontWeight: 300}}>
              Welcome to RentBeta! Below is your personal Rental Tracker where you can monitor your rental payment progress. If your landlord is already on RentBeta, please contact your landlord admin to get connected.
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

        {!hasActiveTenancy ? (
          <Card containerStyle={styles.trackerCard} sx={{backgroundColor: "#82ed9f"}}>
            <View >
                <Text style={styles.trackerCardh5} h4>Your Personal Rental Tracker</Text>
                <Card.Divider color="#FCB200"/>
                <Text style={styles.trackerCardh2} h2>0 UGX</Text>
                <Button
                  buttonStyle={styles.buttonStyle}
                  title="Self Onboard"
                  onPress={() => navigation.navigate("RentSchedule")}
                />
                {/* TODO: Create Rent Schedule functionality will be added later */}
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
                  <Text style={styles.trackerCardh2} h2>{currencyFormatter(parseInt(occupancyDetails.amount_to_pay))}</Text>
                  <Text style={styles.trackerCardh5} h4>Is Due in</Text>
                  <Card.Divider color="#FCB200"/>
                  <Text style={styles.trackerCardh2} h2>{occupancyDetails.days_left} Days</Text>
              </View>
            </Card>
          )} 
          </>
        )}

        {!hasActiveTenancy ? (
          <></>
        ) : (
          <>
          <Text style={styles.installmentText} h5>You can make a partial payment of {currencyFormatter(parseInt(occupancyDetails.installment))} today</Text>
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
              onPress={() => navigation.navigate('ReferLandlord')}
            >
              <Ionicons name="person-add-outline" size={30} color="#FCB200" style={styles.cardIcon}/>
         
              <Text style={styles.serviceCardh5} h5>Refer </Text>
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
            <TouchableOpacity
              onPress={() => navigation.navigate('LoanCreditScore')}
            >
              <AntDesign name="wallet" size={30} color="#FCB200" style={styles.cardIcon}/>
              <Text style={styles.serviceCardh5} h5>Rental TopUp</Text>
            </TouchableOpacity>
          </Card>
          <Card containerStyle={styles.servicesCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PropertyDiscover')}
            >
              <MaterialIcons name="find-in-page" size={30} color="#FCB200" style={styles.cardIcon}/>
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
    flex: 1,
    minWidth: 0,
    marginRight: 10
  },
  welcomeHeader: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitSelectorInline: {
    position: "relative",
    flexShrink: 0,
    maxWidth: "46%",
    zIndex: 20,
    elevation: 6,
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
  unitSelectorButton: {
    height: 40,
    minWidth: 96,
    maxWidth: 200,
    alignSelf: "flex-end",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FCB200",
    backgroundColor: "#FFF7D6",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  unitSelectorButtonText: {
    flex: 1,
    minWidth: 0,
    marginRight: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },
  unitSelectorMenu: {
    position: "absolute",
    right: 0,
    top: 46,
    minWidth: 200,
    maxWidth: 280,
    borderWidth: 1,
    borderColor: "#F0D88C",
    borderRadius: 10,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  unitSelectorMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5EACC",
  },
  unitSelectorMenuItemSelected: {
    backgroundColor: "#FFF7D6",
  },
  unitSelectorMenuItemText: {
    color: "#444",
    fontWeight: "500",
  },
  unitSelectorMenuItemTextSelected: {
    color: "#A56A00",
    fontWeight: "700",
  },

});

export default RentalTrackerScreen;