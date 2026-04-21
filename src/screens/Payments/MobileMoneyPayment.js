import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from '../../api/axiosInstance';
import PhoneInput, { getCountryByCca2 } from 'react-native-international-phone-number';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setPaymentId } from '../../store/authslice';

const MobileMoneyPayment = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [amount, setAmount] = useState('');
    const user = useSelector((state) => state.auth.user);
    const unit_id = useSelector((state) => state.auth.unit_id);
    const [quote, setQuote] = useState({
        base_amount: 0,
        charge_amount: 0,
        total_amount: 0,
        charge_applies: false,
        charge_name: null,
    });
    const [word, setWord] = useState("Pay Rent")
    const [loadingPaymentCall, setLoadingPaymentCall] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState(() => getCountryByCca2('UG') ?? null);
    const [inputValue, setInputValue] = useState(() => {
        const phone = String(user?.phone_number ?? '');
        if (!phone) return '';
        if (phone.startsWith('+256')) return phone.slice(4);
        if (phone.startsWith('256')) return phone.slice(3);
        return phone.startsWith('0') ? phone.slice(1) : phone;
    });

    const getCountryCodePrefix = (country) => {
        const root = country?.idd?.root ?? '';
        const suffix = country?.idd?.suffixes?.[0] ?? '';
        const legacyCallingCode = country?.callingCode ?? '';
        return `${root}${suffix}` || legacyCallingCode;
    };

    const normalizeLocalPhone = (phone) => {
        const compactPhone = (phone ?? '').replaceAll(' ', '');
        return compactPhone.startsWith('0') ? compactPhone.slice(1) : compactPhone;
    };

    const buildInternationalPhone = (country, phone) => {
        const localPhone = normalizeLocalPhone(phone);
        return `${getCountryCodePrefix(country)}${localPhone}`.replaceAll(' ', '');
    };

    const resetQuote = () => {
        setQuote({
            base_amount: 0,
            charge_amount: 0,
            total_amount: 0,
            charge_applies: false,
            charge_name: null,
        });
    };
    
    function handleInputValue(phoneNumber) {
        setInputValue(phoneNumber);
    }
  
    function handleSelectedCountry(country) {
        setSelectedCountry(country);
    }

    const handleChangeAmount = (value) => {
        setAmount(value)
        setErrorMessage("")
    }

    useEffect(() => {
        const cleanAmount = amount.replace(/,/g, '').trim();
        if (!cleanAmount || Number.isNaN(Number(cleanAmount))) {
            resetQuote();
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await axiosInstance.get('/tenants/payments/charge-quote', {
                    params: {
                        related_rental_unit: unit_id,
                        amount: cleanAmount,
                    },
                });
                setQuote(response.data?.data ?? {});
            } catch (e) {
                resetQuote();
                if (e?.response?.data?.message) {
                    setErrorMessage(e.response.data.message);
                }
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [amount, unit_id]);

    const makePayment = async ({ amount }) => {
        try {
            setLoadingPaymentCall(true)
            const phoneNumber = buildInternationalPhone(selectedCountry, inputValue)
            const cleanAmount = amount.replace(/,/g, '').trim();
            console.log("payload", { 
                "related_rental_unit": unit_id, 
                "related_tenant": user.id, 
                "phone_number": phoneNumber, 
                "amount": cleanAmount 
            })
            const response = await axiosInstance.post('/tenants/payments', { 
                "related_rental_unit": unit_id, 
                "related_tenant": user.id, 
                "phone_number": phoneNumber, 
                "amount": cleanAmount 
            });
            if(response.data.status === 200) {
                dispatch(setPaymentId(response.data.data.id))
                setTimeout(() => {
                    setLoadingPaymentCall(false)
                    setAmount("")
                    resetQuote()
                    navigation.navigate("PaymentWaiting");
                }, 2000);
            }
        } catch (err) {
            console.log(err)
            setErrorMessage("Payment Failed")
            setLoadingPaymentCall(false)
        }
    };
  
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <View style={styles.container}>
                    <PhoneInput
                        value={inputValue}
                        defaultCountry="UG"
                        onChangePhoneNumber={handleInputValue}
                        selectedCountry={selectedCountry}
                        onChangeSelectedCountry={handleSelectedCountry}
                    />
                    <TextInput
                        placeholder="Enter Amount"
                        value={amount}
                        onChangeText={amount => handleChangeAmount(amount)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />

                    <View style={{alignItems: "center", marginTop: 15}}>
                        <Text style={styles.disclaimer}>
                            {quote.charge_applies
                                ? `A charge of ${quote.charge_amount} (${quote.charge_name}) applies. Total: ${quote.total_amount}`
                                : `No extra charge applies. Total: ${quote.total_amount || 0}`}
                        </Text>
                    </View>
                    {errorMessage ? (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}

                    {loadingPaymentCall ? (
                        <Button
                            buttonStyle={styles.buttonStyle}
                            title="Make Payment"
                            onPress={() => makePayment({ amount })}
                            disabled
                            loading
                        />
                    ) : (
                        <Button
                            buttonStyle={styles.buttonStyle}
                            title={word}
                            onPress={() => makePayment({ amount })}
                        />
                    )}
                </View>
                {/* {isOpen && (
                <>
                    <Pressable style={styles.backdrop} onPress={toggleSheet}/>
                    <View style={styles.sheet}>
                        <BottomModal navigation={navigation}/>
                    </View>
                </>
                )} */}
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FF",
        padding: 10
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15,
        marginTop: 15
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 60
    },
    headerTextStyle: {
        fontWeight: 700
    },
    helperTextStyle: {
        color: '#7D8FAB',
        marginTop: 8
    },
    topInputStyle: {
        marginLeft: 15,
        marginRight: 15,
    },
    bottomInputStyle: {
        marginLeft: 15,
        marginRight: 15
    },
    input: {
        height: 50,
        marginTop: 20,
        borderWidth: 0.5,
        padding: 15,
        borderRadius: 10
    },
    topLabelStyle: {
        marginTop: 40
    },
    bottomLabelStyle: {
        marginTop: 20
    },
    sheet: {
        backgroundColor: "white",
        padding: 16,
        height: 350,
        width: "100%",
        position: "absolute",
        bottom: -20 * 1.1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#F8F9FF",
        zIndex: 1,
    },
    disclaimer: {
        marginTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 15,
        fontWeight: 300
    },
});
  
export default MobileMoneyPayment;