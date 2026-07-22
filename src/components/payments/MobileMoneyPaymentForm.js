import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Text, Button } from "react-native-elements";
import PhoneInput from "react-native-international-phone-number";

const MobileMoneyPaymentForm = ({
  inputValue,
  selectedCountry,
  amount,
  quote,
  errorMessage,
  loadingPaymentCall,
  submitLabel,
  showChargeQuote = true,
  onPhoneChange,
  onCountryChange,
  onAmountChange,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <PhoneInput
        value={inputValue}
        defaultCountry="UG"
        onChangePhoneNumber={onPhoneChange}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={onCountryChange}
      />
      <TextInput
        placeholder="Enter Amount"
        placeholderTextColor="#6B6B6B"
        value={amount}
        onChangeText={onAmountChange}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        style={styles.input}
      />

      {showChargeQuote ? (
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            {`A transaction fee of (${quote.charge_amount || 0}) UGX will be added to this transaction`}
          </Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <Button
        buttonStyle={styles.buttonStyle}
        title={submitLabel}
        onPress={onSubmit}
        disabled={loadingPaymentCall}
        loading={loadingPaymentCall}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
    padding: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15,
  },
  buttonStyle: {
    backgroundColor: "#FCB200",
    padding: 15,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 60,
  },
  input: {
    height: 50,
    marginTop: 20,
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 10,
    color: "#1f1f1f",
  },
  disclaimerContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  disclaimer: {
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 15,
    fontWeight: "300",
  },
});

export default MobileMoneyPaymentForm;
