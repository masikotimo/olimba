import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { currencyFormatter } from '../utilities/currencyFormatter';

const TransactionsCard = ({cardTitle, cardAmount, cardDate, cardInterest, onPress}) => {

    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Card containerStyle={styles.transactionsCard}>
                <View style={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
                    <View style={{display:"flex", flexDirection:"row"}}>
                        <Icon
                            name="circle-o-notch"
                            size={30}
                            color="#FCB200"
                        />
                        <View style={{marginLeft: 8}}>
                            <Text style={{fontWeight: 700, fontSize: 16}} p>{cardTitle}</Text>
                            <Text p>{cardDate}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontWeight: 600, fontSize: 16, color:"#19B289"}} p>{currencyFormatter(parseInt(cardAmount))}</Text>
                        {cardInterest && (
                            <Text style={{fontWeight: 300, fontSize: 15, color:"#fa0f0f"}} p> - {currencyFormatter(parseInt(cardInterest))}</Text>
                        )}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
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

export default TransactionsCard