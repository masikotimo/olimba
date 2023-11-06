import React from 'react';
import {StyleSheet, Text} from 'react-native';

const TimerText = props => {
  const {text, time} = props;

  return (
    <Text>
      {text}
      <Text >{' ' + time}s</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  resendOtpTimerText: {
    fontSize: 12,
  },
});

export default TimerText;