import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const PropertyDetail = ({result}) => {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: `https://api.rentbeta.iolabsug.com${result.images[0].image}`}}/>
            <Text style={styles.name}>{result.related_rental.rental_name}</Text>
            <Text >{result.metadata.unit_rent} UGX</Text>
            <Text >{result.related_rental.location} </Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 15,
        marginTop: 15
    },  
    image: {
        width: 200,
        height: 150,
        borderRadius: 4,
        marginBottom: 5
    },
    name: {
        fontWeight: 500,
    }
});

export default PropertyDetail;