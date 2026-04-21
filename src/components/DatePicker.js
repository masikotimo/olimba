import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerComponent = ({ setOpen, setDate, open, date }) => {
  const minimumDate = new Date();
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  if (!open) {
    return null;
  }

  return (
    <View style={styles.container}>
      <DateTimePicker
        mode="date"
        value={date ?? minimumDate}
        maximumDate={maxDate}
        minimumDate={minimumDate}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        onChange={(_, selectedDate) => {
          if (selectedDate) {
            setDate(selectedDate);
          }

          if (Platform.OS !== 'ios') {
            setOpen(false);
          }
        }}
      />
      {Platform.OS === 'ios' ? (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            setOpen(false);
          }}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  doneButton: {
    alignSelf: 'flex-end',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneButtonText: {
    color: '#FCB200',
    fontWeight: '600',
  },
});

export default DatePickerComponent;
