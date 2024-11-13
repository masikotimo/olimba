import React, { useEffect, useState } from "react";
import axios from 'axios';
import {Text, StyleSheet, ScrollView, TextInput, View} from "react-native";
import { Button } from 'react-native-elements';
import { useSelector, useDispatch } from "react-redux";
import {API_URL} from '@env';

const RentScheduleScreen = ({navigation}) => {
  const [unitId, setUnitId] = useState("");
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [loadingScheduleCall, setLoadingScheduleCall] = useState(false)
  const [status, setStatus] = useState(false);
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-')};

  const addRentalSchedule = async () => {
    try {
      setLoadingScheduleCall(true)
      const convertedDate = new Date(date)
      const formattedDate = formatDate(convertedDate)
      const response = await axios.post(`${API_URL}/tenants/schedule/create`, { "tenant_id": user.id, "unit_id": unitId });
      navigation.navigate("ScheduleList");
    } catch (err) {
      setErrorMessage("Schedule Addition Failed")
      setLoadingScheduleCall(false)
    }
  };


  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.disclaimer}>Provide a preferred unit name and the amount of rent you pay for that unit</Text>

      <View style={styles.textContainer}>
        <TextInput
          placeholder="Add Unit Name"
          style={styles.inputBox}
          onChangeText={setUnitName}
          value={unitName}
        />

        <TextInput
          placeholder="Add Unit Rent Amount"
          style={styles.inputBox}
          onChangeText={setUnitRent}
          value={unitRent}
        />
      </View>

      {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      {loadingScheduleCall ? (
          <Button
          buttonStyle={styles.buttonStyle}
          title="Add Rent Schedule"
          disabled
          loading
          />
        ) : (
          <Button
            buttonStyle={styles.buttonStyle}
            title="Add Rent Schedule"
            onPress={() => addRentalSchedule({ tenantId, unitId })}
          />
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
  },
  inputBox: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 30,
    marginHorizontal: "5%"
  },
  workingStatus: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 30
  },
  error: {
    color: "red",
    marginHorizontal: "10%"
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
    marginBottom: 50,
    width: "auto"
  },
  dateContainer: {
    display: "flex",
    flexDirection: "column",
  },
  information: {
    fontSize: 15,
    marginTop: 13,
    marginRight: 5
  },
  pickerContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 15,
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
    marginRight: 15
  },
  textContainer: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15
  },
  disclaimer: {
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 15,
    fontWeight: 300
  },
  scheduleButton: {
    backgroundColor: "#424447",
    padding: 10
  }
});

export default RentScheduleScreen;