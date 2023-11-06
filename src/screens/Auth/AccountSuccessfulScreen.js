import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';

const AccountSuccessfulScreen = ({navigation}) => {
  return (
            <View style={styles.container}>
            <Text style={styles.headerTextStyle} h3>Your Account was successfully Verified</Text>
            <Text style={styles.helperTextStyle} h5>Now you are ready to start using RentBeta</Text>
            
            <Button
                buttonStyle={styles.buttonStyle}
                title="CONTINUE"
                onPress={() => navigation.navigate("Signin")}
            />
        </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 150,
        padding: 15,
        flexDirection: 'column',
        marginBottom: 50
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginTop: 80
    },
    headerTextStyle: {
        fontWeight: 700,
        alignSelf: "center",
    },
    helperTextStyle: {
        color: '#7D8FAB',
        marginTop: 8,
        alignSelf: "center",
        marginTop: 15,
        marginBottom: 80
    },
    inputStyle: {
        borderColor: '#7D8FAB',
        borderWidth: 0.5,
        padding: 12,
    },
});


export default AccountSuccessfulScreen;