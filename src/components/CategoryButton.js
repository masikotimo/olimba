import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryButton = ({ title, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.button, selected && styles.selectedButton]}
        onPress={onPress}
    >
        <Text style={[styles.buttonText, selected && styles.selectedButtonText]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 10,
    },
    selectedButton: {
        backgroundColor: '#FFC107',
    },
    buttonText: {
        color: '#222',
        fontWeight: '500',
    },
    selectedButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CategoryButton; 