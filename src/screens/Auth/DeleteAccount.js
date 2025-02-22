import React, {useState} from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLogout } from '../../store/authslice';
import { useDispatch } from 'react-redux';
import {API_URL} from '@env';
import axiosInstance from '../../api/axiosInstance';

const DeleteAccountScreen = ({navigation}) => {
  const [reason, setReason] = useState("");
  const [username, setUsername] = useState("");
  const [valid, setValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loadingDeleteCall, setLoadingDeleteCall] = useState(false)
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const validateUsername = (event) => {
    const validated = event.nativeEvent.text
    const expected = `+256${user.phone_number}`
    if(validated === expected && valid === false){
      setValid(true)
    }
    if(valid === true && validated !== expected){
      setValid(false)
    }
  }

  const performDelete = async () => {
    try {
      setLoadingDeleteCall(true)
      const response = await axiosInstance.post(`/accounts/tenants/schedule_delete`, {
        "username": username,
        "reason": reason
      });
      if(response.data.status === 200 || response.data.status === 404) {
        dispatch(setLogout())
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('user_details')
        await AsyncStorage.removeItem('unit_id')
      }
      setLoadingDeleteCall(false)
    } catch (err) {
      setLoadingDeleteCall(false)
      setErrorMessage("Delete Failed")
    }
  };

  return(
    <ScrollView style={styles.formContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.disclaimer}>Your account could take upto 30 days before its deleted.</Text>
        <Text style={styles.disclaimer}>Please withdraw any balances from your account before you continue to delete it, We shall not be able to delete an account that still has rent payment balances</Text>
      </View>

      <View style={styles.textContainer}>
        <TextInput
          placeholder="Enter the reason for deleting"
          style={styles.inputBox}
          onChangeText={setReason}
          value={reason}
          multiline
          numberOfLines={4}
          maxLength={40}
        />

        {user ? (
          <Text style={styles.disclaimer}>Please type your phone number as +256{user.phone_number} to confirm</Text>
        ) : (
          <></>
        )}

        <TextInput
          placeholder="Confirm Username"
          style={styles.inputBox}
          onChangeText={setUsername}
          onChange={validateUsername}
          value={username}
        />
        
        {loadingDeleteCall ? (
          <Button
          buttonStyle={styles.buttonStyle}
          title="Confirm Delete"
          loading
          disabled
          />
        ) : (
          <>
          {valid ? (
            <Button
              buttonStyle={styles.buttonStyle}
              title="Confirm Delete"
              onPress={performDelete}
            />
          ) : (
            <Button
              buttonStyle={styles.buttonStyle}
              title="Confirm Delete"
              disabled
            />
          )}
          </>
        )}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1
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
  inputBox: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    marginHorizontal: "5%",
    height: 50,
    marginTop: 10
  },
  buttonStyle: {
    backgroundColor: 'red',
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
});

export default DeleteAccountScreen;