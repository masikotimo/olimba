import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';

const OtpScreens = ({navigation}) => {
    const [otp, setOtp] = useState('');

    return(
        <View style={styles.container}>
            <Text style={styles.headerTextStyle} h3>Enter OTP Code</Text>
            <Text style={styles.helperTextStyle} h5>Enter OTP code that we sent to +256700000000</Text>
            <Input
                placeholder='Your One Time Password'
                value={otp}
                onChangeText={setOtp}
                autoCapitalize="none"
                autoCorrect={false}
                inputStyle={styles.inputStyle}
            />
             <Button
              buttonStyle={styles.buttonStyle}
              title="VERIFY"
              onPress={() => navigation.navigate("AccountSuccessful")}
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
    icon:{
        paddingLeft: 10,
        paddingRight: 10
    }
});

export default OtpScreens;