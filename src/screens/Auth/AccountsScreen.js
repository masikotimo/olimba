import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from "react-redux";
import {setLogout} from "../../store/authslice";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Option from '../../components/Option';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [count, setCount] = useState(0)
  const url = "https://api.rentbeta.fanya.ug/api/v1"

  useEffect(() => {
    useGetTicketDetails()

  }, [])

  const useGetTicketDetails = async () => {
    try {
        const response = await axios.get(`${url}/accounts/users/has_schedule?tenant_id=${user.id}`);
        setCount(response.data.data)
    } catch (e) {
        console.log("Fetch ticket details failed");
    }
  }

  const signOut = async () => {
    dispatch(setLogout())
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user_details');
    await AsyncStorage.removeItem('unit_id');
  }

  return (
    <ScrollView style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: "#F0ECE6"}}
      >
      <Text style={styles.headerText} h3>My Account</Text>
        {user !== null ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("AccountDetails")}
          >
            <Card containerStyle={styles.profileCard}>
              <View style={styles.cardContainer}>
                <View style={styles.innerContainer}>
                  <Avatar
                    size="large"
                    rounded
                    title="AV"
                    activeOpacity={0.7}
                    containerStyle={{backgroundColor: "#FCB200", marginRight: 15 }}
                  />
                  <View>
                    <Text style={styles.trackerCardh5} h3>{user.first_name} {user.last_name}</Text>
                    <Text style={styles.trackerCardh2} h5>{user.tenant_number}</Text>
                    <Text style={styles.trackerCardh5} h5>+256{user.phone_number}</Text>
                  </View>
                </View>
                <View style={{alignSelf: "center"}}>
                  <Icon
                    name="arrow-right"
                    size={25}
                    color="#FCB200"
                  />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ) : (
          null
        )}
        

        <Card containerStyle={styles.optionsCard}>
          <View >
            {/* <Option optionText={"Recent Payments"} onPress={() => navigation.navigate("PaymentsList")}/>
            <Card.Divider/> */}
            {count > 0 && (
              <>
                <Option optionText={"Tickets"} onPress={() => navigation.navigate("TicketList")}/>
                <Card.Divider/>
              </>
            )}
            <Option optionText={"Rent Schedules"}  onPress={() => navigation.navigate("ScheduleList")}/>
            <Card.Divider/>
            <Option optionText={"Help and Support"} onPress={() => navigation.navigate("HelpSupport")}/>
            <Card.Divider/>
            <Option optionText={"App Version and Info"} onPress={() => navigation.navigate("AppVersion")}/>
            <Card.Divider />
            <Option optionText={"Logout"} onPress={signOut} />
            <Card.Divider/>
          </View>
        </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0ECE6",
  },
  cardContainer:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileCard: {
    borderRadius: 20,
    padding: 25
  },
  optionsCard: {
    borderRadius: 20,
    padding: 25
  },
  headerText: {
    fontWeight: 700,
    marginTop: 30,
    marginLeft: 15
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15
  },
});

export default AccountScreen;