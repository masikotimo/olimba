import React from 'react';
import { Text, Button, Card } from 'react-native-elements';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Option = ({onPress, optionText, link}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={styles.container}>
                <Text h5Style={styles.text} h5>{optionText}</Text>
                <Icon
                    name="arrow-right"
                    size={25}
                    color="#FCB200"
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        padding: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 500
    }
})

export default Option
