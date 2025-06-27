import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ term, onTermChange, onTermSubmit }) => {
    return (
        <View style={styles.container}>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search what you need"
                placeholderTextColor="#b4b5b8"
                style={styles.inputStyle}
                value={term}
                onChangeText={onTermChange}
                onEndEditing={onTermSubmit}
            />
            <TouchableOpacity style={styles.iconButton} onPress={onTermSubmit}>
                <Feather name="search" style={styles.iconStyle} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 28,
        marginHorizontal: 20,
        marginTop: 18,
        marginBottom: 18,
        height: 56,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    inputStyle: {
        flex: 1,
        fontSize: 18,
        paddingLeft: 20,
        color: '#222',
        fontWeight: '500',
    },
    iconButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    iconStyle: {
        fontSize: 22,
        color: '#b4b5b8',
    },
});

export default SearchBar;