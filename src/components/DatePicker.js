import React, {  useState } from 'react';
import DatePicker from 'react-native-date-picker'

const DatePickerComponent = ({ setOpen, setDate, open }) => {
  const date = new Date()
  const maxDate = new Date( Date.now() + 60 * 24 * 60 * 60 * 1000)

  return (
    <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        maximumDate={maxDate}
        theme="light"
        minimumDate={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
  )
};

export default DatePickerComponent;
