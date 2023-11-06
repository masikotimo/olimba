import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';

const SearchBar = ({term, onTermChange, onTermSubmit}) => {
    return (
        <View style={styles.backgroundStyle}>
            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder='Search for properties'
                style={styles.inputStyle}
                value={term}
                // onChangeText={newTerm => onTermChange(newTerm)}
                // onEndEditing={()=> onTermSubmit()}
            />
            <Feather name="search" style={styles.iconStyle}/>
        </View>
    )
};

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: '#F0EEEE',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    inputStyle: {
        flex: 1,
        fontSize: 18
    },
    iconStyle: {
        fontSize: 35,
        alignSelf: 'center',
        marginHorizontal: 15
    }
});

export default SearchBar;