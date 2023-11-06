import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';

const PropertyDetailsScreen = ({navigation}) => {
  return (
        <ScrollView>
            <Image style={styles.image} source={require("../../../assets/apartments1.jpeg")}/>
            <View style={styles.container}>
                <View style={styles.headerText}>
                    <Text h3>SummerVille House</Text>
                    <Text h4>20000000 UGX</Text>
                </View>
                <View style={styles.ammenitiesView}>
                    
                </View>
                <Text style={styles.descriptionHead}>Description</Text>
                <Text style={styles.descriptionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed neque commodo, dictum leo venenatis, ultricies nulla. Donec pharetra purus felis, non vulputate purus gravida non. Proin dignissim, velit nec mollis malesuada, lorem lacus luctus ante, a dignissim nulla enim et ligula. Nam lobortis gravida ipsum eu consequat. Curabitur malesuada dignissim tortor, nec aliquet metus maximus vel. Fusce sit amet volutpat nisi. Proin nisl diam, ullamcorper dapibus placerat eu, malesuada eget mi. Phasellus ornare mi efficitur vehicula feugiat. Curabitur ac lorem ut dolor pellentesque sagittis quis ut metus. Morbi pretium eu purus et fringilla.</Text>
                <Button
                    buttonStyle={styles.buttonStyle}
                    title="Book Tour"
                    // onPress={() => navigation.navigate("PaymentMethod")}
                />
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300,
    },
    container: {
        marginLeft: 15,
        marginRight: 15
    },
    buttonStyle: {
        backgroundColor: '#FCB200',
        padding: 15,
        borderRadius: 10,
        marginTop: 20
    },
    descriptionHead: {
        fontWeight: 500,
        marginTop: 15
    }
});

export default PropertyDetailsScreen;