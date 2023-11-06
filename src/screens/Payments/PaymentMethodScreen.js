import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Text } from 'react-native-elements';
import YellowButton from '../../components/YellowButton';

const PaymentMethodScreen = ({navigation}) => {
  const onPressMM = () => navigation.navigate("MobileMoneyPayment")

  return (
    <View style={styles.container}>
      <YellowButton title={"Mobile Money"} onPress={onPressMM} />
      {/* <YellowButton title={"Visa/ MasterCard"} onPress={onPressMM} /> */}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15
  }
});

export default PaymentMethodScreen;