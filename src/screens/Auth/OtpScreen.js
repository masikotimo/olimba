import React, {useState, useRef, useEffect} from 'react';
import { useToast } from "react-native-toast-notifications";
import PropTypes from 'prop-types';
import {StyleSheet, View, ActivityIndicator, TextInput, ScrollView, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setUnitId, setUnitName, setIsReset } from '../../store/authslice';
import backend from '../../api/backend';
// import RNOtpVerify from 'react-native-otp-verify';

import { isAndroid, logErrorWithMessage } from '../../utilities/helperFunctions';
import TimerText from '../../components/TimerText';

const RESEND_OTP_TIME_LIMIT = 30; // 30 secs
const AUTO_SUBMIT_OTP_TIME_LIMIT = 4; // 4 secs

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;

const OtpScreen = (props) => {
  const {otpRequestData, attempts} = props;
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const userSignUp = useSelector((state) => state.auth.userSignUp);
  const [loadingSignIn, setLoadingSignIn] = useState(false);

  const [attemptsRemaining, setAttemptsRemaining] = useState(attempts);
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  // 0 < autoSubmitOtpTime < 4 to show auto submitting OTP text
  const [autoSubmitOtpTime, setAutoSubmitOtpTime] = useState(
    AUTO_SUBMIT_OTP_TIME_LIMIT,
  );

  // TextInput refs to focus programmatically while entering OTP
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);

  // a reference to autoSubmitOtpTimerIntervalCallback to always get updated value of autoSubmitOtpTime
  const autoSubmitOtpTimerIntervalCallbackReference = useRef();

  // useEffect(() => {
  //   // autoSubmitOtpTime value will be set after otp is detected,
  //   // in that case we have to start auto submit timer
  //   autoSubmitOtpTimerIntervalCallbackReference.current = autoSubmitOtpTimerIntervalCallback;
  // });

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

//   useEffect(() => {
//     // docs: https://github.com/faizalshap/react-native-otp-verify

//     RNOtpVerify.getOtp()
//       .then(p =>
//         RNOtpVerify.addListener(message => {
//           try {
//             if (message) {
//               const messageArray = message.split('\n');
//               if (messageArray[2]) {
//                 const otp = messageArray[2].split(' ')[0];
//                 if (otp.length === 4) {
//                   setOtpArray(otp.split(''));

//                   // to auto submit otp in 4 secs
//                   setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
//                   startAutoSubmitOtpTimer();
//                 }
//               }
//             }
//           } catch (error) {
//             logErrorWithMessage(
//               error.message,
//               'RNOtpVerify.getOtp - read message, OtpVerification',
//             );
//           }
//         }),
//       )
//       .catch(error => {
//         logErrorWithMessage(
//           error.message,
//           'RNOtpVerify.getOtp, OtpVerification',
//         );
//       });

//     // remove listener on unmount
//     return () => {
//       RNOtpVerify.removeListener();
//     };
//   }, []);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  // this callback is being invoked from startAutoSubmitOtpTimer which itself is being invoked from useEffect
  // since useEffect use closure to cache variables data, we will not be able to get updated autoSubmitOtpTime value
  // as a solution we are using useRef by keeping its value always updated inside useEffect(componentDidUpdate)
  const autoSubmitOtpTimerIntervalCallback = () => {
    if (autoSubmitOtpTime <= 0) {
      clearInterval(autoSubmitOtpTimerInterval);

      // submit OTP
      onSubmitButtonPress();
    }
    setAutoSubmitOtpTime(autoSubmitOtpTime - 1);
  };

  const startAutoSubmitOtpTimer = () => {
    if (autoSubmitOtpTimerInterval) {
      clearInterval(autoSubmitOtpTimerInterval);
    }
    autoSubmitOtpTimerInterval = setInterval(() => {
      autoSubmitOtpTimerIntervalCallbackReference.current();
    }, 1000);
  };

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const onResendOtpButtonPress = () => {
    // clear last OTP
    if (firstTextInputRef) {
      setOtpArray(['', '', '', '']);
      firstTextInputRef.current.focus();
    }

    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    // resend OTP Api call
    // todo
    console.log('todo: Resend OTP');
  };

  const onSubmitButtonPress = async () => {
    try {
      setLoadingSignIn(true)
      let otpUnclean = otpArray.toString()
      let otp_code = otpUnclean.replaceAll(",", "")
      
      const url = "/accounts/otp/verify"
      const response = await backend.post(`/accounts/otp/verify`, { "related_user": userSignUp.id, "otp_code": parseInt(otp_code) });
      dispatch(setLogin({ user: response.data.data.user_details, token: response.data.data.token.token }));
      dispatch(setUnitId(response.data.data.units[0].related_rental_unit.id))
      dispatch(setUnitName(response.data.data.units[0].related_rental_unit.unit_name))
      setLoadingSignIn(false)
      await AsyncStorage.setItem("token", response.data.data.token.token);
      await AsyncStorage.setItem("user_details", JSON.stringify(response.data.data.user_details));
      await AsyncStorage.setItem("unit_id", String(response.data.data.units[0].related_rental_unit.id))
    } catch (err) {
      toast.show("Invalid OTP, Please use the correct OTP", {
        type: "danger",
        placement: "top",
        duration: 4000,
        offset: 1000,
        animationType: "slide-in",
      });
      setLoadingSignIn(false)
    }
  };

  // this event won't be fired when text changes from '' to '' i.e. backspace is pressed
  // using onOtpKeyPress for this purpose
  const onOtpChange = index => {
    return value => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        }
      }
    };
  };

  // only backspace key press event is fired on Android
  // to have consistency, using this event just to detect backspace key press and
  // onOtpChange for other digits press
  const onOtpKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy);
        }
      }
    };
  };

  return (
    <ScrollView style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "white"}}
        keyboardShouldPersistTaps="always"
    >
        <View style={styles.container}>
            <Text style={{fontSize: 16}}>
                Enter OTP sent to {userSignUp.username}
            </Text>
            <View style={{display:"flex", flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 20, justifyContent: "space-around"}}>
                {[
                firstTextInputRef,
                secondTextInputRef,
                thirdTextInputRef,
                fourthTextInputRef,
                ].map((textInputRef, index) => (
                <View style={{
                    borderColor: "#FCB200",
                    borderWidth: 1,
                    borderRadius: 4,
                    padding: 20,
                }} key={index}>
                    <TextInput
                        containerStyle={[styles.fill, styles.mr12]}
                        value={otpArray[index]}
                        onKeyPress={onOtpKeyPress(index)}
                        onChangeText={onOtpChange(index)}
                        keyboardType={'numeric'}
                        maxLength={1}
                        style={[styles.otpText, styles.centerAlignedText]}
                        autoFocus={index === 0 ? true : undefined}
                        ref={refCallback(textInputRef)}
                        key={index}
                    />
                </View>
                ))}
            </View>

          <TouchableOpacity>
            <Text>Resend OTP</Text>
          </TouchableOpacity>
          {/* {resendButtonDisabledTime > 0 ? (
            <TimerText text={'Resend OTP in'} time={resendButtonDisabledTime} />
          ) : ( */}
          <>
          {loadingSignIn ? (
            <Button
              buttonStyle={styles.buttonStyle}
              title="VERFIY OTP"
              loading
              disabled
            />
          ) : (
            <Button
            buttonStyle={styles.buttonStyle}
            title="VERIFY OTP"
            onPress={() => onSubmitButtonPress()}
            />
            )}
          </>
          {/* )} */}
          <View style={styles.fill} />
          {submittingOtp && <ActivityIndicator />}
          {autoSubmitOtpTime > 0 &&
          autoSubmitOtpTime < AUTO_SUBMIT_OTP_TIME_LIMIT ? (
            <TimerText text={'Submitting OTP in'} time={autoSubmitOtpTime} />
          ) : null}
          {/* <Text
            style={[styles.centerAlignedText]}>
            {attemptsRemaining || 0} Attempts remaining
          </Text> */}
          <Button
            type={'fill'}
            text={'Submit'}
            textStyle={styles.submitButtonText}
            onPress={onSubmitButtonPress}
            disabled={submittingOtp}
          />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    display: "flex",
    backgroundColor: "white345"
  },
  submitButtonText: {
    color: "#FCB200",
  },
  otpResendButton: {
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  otpResendButtonText: {
    color: "#FCB200",
    textTransform: 'none',
    textDecorationLine: 'underline',
  },
  otpText: {
    // fontWeight: 500,
    color: "#444",
    fontSize: 18,
    width: '100%',
  },
  fill: {
    flex: 1,
  },
  mr12: {
    marginRight: 12,
    border: 1
  },
  centerAlignedText: {
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15
  },
});

export default OtpScreen;