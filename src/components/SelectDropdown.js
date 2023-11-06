import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SelectComponent = ({data, onSelect, afterSelection, textForSelection, buttonText}) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem)
      }}
      defaultButtonText={buttonText}
      buttonTextAfterSelection={(selectedItem, index) => afterSelection(selectedItem)}
      rowTextForSelection={(item, index) => textForSelection(item)}
      buttonStyle={styles.dropdown1BtnStyle}
      buttonTextStyle={styles.dropdown1BtnTxtStyle}
      renderDropdownIcon={isOpened => {
        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={styles.dropdown1DropdownStyle}
      rowStyle={styles.dropdown1RowStyle}
      rowTextStyle={styles.dropdown1RowTxtStyle}
    />
  )
};

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 20,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default SelectComponent;