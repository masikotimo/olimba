import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { getCountryByCca2 } from "react-native-international-phone-number";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setPaymentId } from "../../store/authslice";
import { getPaymentFlowConfig, PAYMENT_TYPES } from "../../constants/paymentFlows";
import MobileMoneyPaymentForm from "../../components/payments/MobileMoneyPaymentForm";

const EMPTY_QUOTE = {
  base_amount: 0,
  charge_amount: 0,
  total_amount: 0,
  charge_applies: false,
  charge_name: null,
};

const MobileMoneyPayment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const paymentType = route?.params?.paymentType ?? PAYMENT_TYPES.RENT;
  const utilityType = route?.params?.utilityType;
  const occupancyId = route?.params?.occupancyId;
  const flow = getPaymentFlowConfig(paymentType);

  const utilityTitle =
    utilityType === "water" ? "Pay Water" : utilityType === "electricity" ? "Pay Electricity" : flow.submitLabel;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: paymentType === PAYMENT_TYPES.UTILITY ? utilityTitle : "Mobile Money Payment",
    });
  }, [navigation, paymentType, utilityTitle]);

  const user = useSelector((state) => state.auth.user);
  const unit_id = useSelector((state) => state.auth.unit_id);

  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(EMPTY_QUOTE);
  const [loadingPaymentCall, setLoadingPaymentCall] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(() => getCountryByCca2("UG") ?? null);
  const [inputValue, setInputValue] = useState(() => {
    const phone = String(user?.phone_number ?? user?.username ?? "");
    if (!phone) return "";
    if (phone.startsWith("+256")) return phone.slice(4);
    if (phone.startsWith("256")) return phone.slice(3);
    return phone.startsWith("0") ? phone.slice(1) : phone;
  });

  const getCountryCodePrefix = (country) => {
    const root = country?.idd?.root ?? "";
    const suffix = country?.idd?.suffixes?.[0] ?? "";
    const legacyCallingCode = country?.callingCode ?? "";
    return `${root}${suffix}` || legacyCallingCode;
  };

  const normalizeLocalPhone = (phone) => {
    const compactPhone = (phone ?? "").replaceAll(" ", "");
    return compactPhone.startsWith("0") ? compactPhone.slice(1) : compactPhone;
  };

  const buildInternationalPhone = (country, phone) => {
    const localPhone = normalizeLocalPhone(phone);
    return `${getCountryCodePrefix(country)}${localPhone}`.replaceAll(" ", "");
  };

  const resetQuote = () => setQuote(EMPTY_QUOTE);

  const handleChangeAmount = (value) => {
    setAmount(value);
    setErrorMessage("");
  };

  useEffect(() => {
    if (!flow.showChargeQuote) {
      resetQuote();
      return;
    }

    const cleanAmount = amount.replace(/,/g, "").trim();
    if (!cleanAmount || Number.isNaN(Number(cleanAmount))) {
      resetQuote();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axiosInstance.get(flow.chargeQuoteEndpoint, {
          params: {
            related_rental_unit: unit_id,
            amount: cleanAmount,
          },
        });
        setQuote(response.data?.data ?? EMPTY_QUOTE);
      } catch (e) {
        resetQuote();
        if (e?.response?.data?.message) {
          setErrorMessage(e.response.data.message);
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [amount, unit_id, flow.showChargeQuote, flow.chargeQuoteEndpoint]);

  const buildPaymentPayload = (phoneNumber, cleanAmount) => {
    if (paymentType === PAYMENT_TYPES.UTILITY) {
      return {
        occupancy_id: occupancyId,
        utility_type: utilityType,
        phone_number: phoneNumber,
        amount: Number(cleanAmount),
      };
    }

    return {
      related_rental_unit: unit_id,
      related_tenant: user.id,
      phone_number: phoneNumber,
      amount: cleanAmount,
    };
  };

  const makePayment = async () => {
    const cleanAmount = amount.replace(/,/g, "").trim();
    if (!cleanAmount || Number.isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    if (paymentType === PAYMENT_TYPES.UTILITY && (!occupancyId || !utilityType)) {
      setErrorMessage("Utility payment details are missing. Please go back and try again.");
      return;
    }

    try {
      setLoadingPaymentCall(true);
      const phoneNumber = buildInternationalPhone(selectedCountry, inputValue);
      const payload = buildPaymentPayload(phoneNumber, cleanAmount);
      const response = await axiosInstance.post(flow.initiateEndpoint, payload);

      if (response.data.status === 200) {
        dispatch(setPaymentId(response.data.data.id));
        setAmount("");
        resetQuote();
        navigation.navigate("PaymentWaiting", {
          paymentType,
          utilityType,
          occupancyId,
        });
      } else {
        setErrorMessage("Payment failed. Please try again.");
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Payment failed. Please try again.";
      setErrorMessage(typeof apiError === "string" ? apiError : "Payment failed. Please try again.");
    } finally {
      setLoadingPaymentCall(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <SafeAreaProvider>
        <MobileMoneyPaymentForm
          inputValue={inputValue}
          selectedCountry={selectedCountry}
          amount={amount}
          quote={quote}
          errorMessage={errorMessage}
          loadingPaymentCall={loadingPaymentCall}
          submitLabel={flow.submitLabel}
          showChargeQuote={flow.showChargeQuote}
          onPhoneChange={setInputValue}
          onCountryChange={setSelectedCountry}
          onAmountChange={handleChangeAmount}
          onSubmit={makePayment}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
});

export default MobileMoneyPayment;
