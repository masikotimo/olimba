import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const YellowButton = ({title, onPress}) => {
    return (
        <Button
            buttonStyle={styles.buttonStyle}
            title={title}
            onPress={onPress}
        />
    )
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginTop: 15
    },
});

export default YellowButton;