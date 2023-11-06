import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const TicketUpdateCard = ({cardTitle, cardDate}) => {

    return (
        <Card containerStyle={styles.transactionsCard}>
            <View style={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
                <View style={{display:"flex", flexDirection:"row"}}>
                    <Icon
                        name="ticket"
                        size={30}
                        color="#FCB200"
                    />
                    <View style={{marginLeft: 8}}>
                        <Text style={{fontWeight: 700, fontSize: 16, padding: 4}} p>{cardTitle}</Text>
                        <Text p>{cardDate}</Text>
                    </View>
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    transactionsCard: {
        borderRadius: 10,
        padding: 18,
        marginTop: 12,
        backgroundColor: "#EFECEC",
        borderColor: "#EFECEC",
    },
});

export default TicketUpdateCard