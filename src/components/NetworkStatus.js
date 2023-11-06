import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const colors = {
    connected: "#4CAF50",
    internetReachable: "#FFEB3B",
    disconnected: "#F44336"
};

const NetworkStatus = () => {
    // Define state variables for network state and color
    const [networkState, setNetworkState] = useState(null);
    const [color, setColor] = useState(colors.disconnected);
    const [alertVisible, setAlertVisible] = useState(false)
    const [networkName, setNetworkName] = useState("Connected")
  
    const updateColor = state => {
      if (state.isConnected && state.isInternetReachable) {
        setColor(colors.connected);
        setAlertVisible(true);
        setNetworkName("Connected");
        setAlertVisible(false);
      } else if (state.isConnected && !state.isInternetReachable) {
        setColor(colors.internetReachable);
        setAlertVisible(true)
        setNetworkName("Your Connection is Unstable")
      } else {
        setColor(colors.disconnected);
        setAlertVisible(true)
        setNetworkName("Disconnected from the internet")
      }
    };
  
    // Use useEffect hook to subscribe and unsubscribe to network state updates
    useEffect(() => {
      // Get the network state once
      NetInfo.fetch().then(state => {
        setNetworkState(state);
        updateColor(state);
      });
  
      // Subscribe to network state updates
      const unsubscribe = NetInfo.addEventListener(state => {
        setNetworkState(state);
        updateColor(state);
        setTimeout(() => {
          setAlertVisible(false)
        }, 5000)
      });
  
      // Unsubscribe from network state updates
      return () => {
        unsubscribe();
      };
    }, []);
  
    // Return a view with a text and a color indicator
    return (
      <>
      {alertVisible ? (
        <View style={styles.container}>
          <Text style={[styles.subHeader, {backgroundColor: color}]}>{networkName}</Text>
        </View>
      ) : (
        null
      )}
      </>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "10%"
    },
    subHeader: {
        backgroundColor : "#2089dc",
        color : "white",
        textAlign : "center",
        paddingVertical : 5,
        width: "100%"
    }
});

export default NetworkStatus