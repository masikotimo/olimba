import React, {useState} from 'react';
import { View, StyleSheet} from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';

const ForgotPasswordScreen = ({navigation}) => {
  const [phonenumber, setPhoneNumber] = useState('');

  return(
    <View style={styles.container}>
        <Text style={styles.headerTextStyle} h3>Reset Password</Text>
        <Text style={styles.helperTextStyle} h5>Enter your phone number so we can send you the OTP code to reset your password</Text>
        <Input
            placeholder='Your Phone Number'
            value={phonenumber}
            onChangeText={setPhoneNumber}
            autoCapitalize="none"
            autoCorrect={false}
            inputStyle={styles.inputStyle}
            leftIcon={
                <FontAwesome5
                    name="flag-checkered" 
                    size={24} 
                    color="black"
                    style={styles.icon}
                />
            }
        />
         <Button
          buttonStyle={styles.buttonStyle}
          title="REQUEST OTP"
          onPress={() => navigation.navigate("Otp")}
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
        paddingLeft: 50,
        paddingRight: 50,
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

export default ForgotPasswordScreen;