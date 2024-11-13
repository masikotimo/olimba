import React, {useContext} from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Text, Avatar } from 'react-native-elements';
import { useSelector } from "react-redux";
import { AntDesign } from '@expo/vector-icons';

const AccountDetailsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const user = useSelector((state) => state.auth.user);

  return (  
    <ScrollView style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#F0ECE6"}}
    >
        <View style={styles.container}>
            {user ? (
                <Card containerStyle={styles.optionsCard}>
                <View>
                    <Text h5 style={styles.h5Text}>FIRST NAME</Text>
                    <Text h5 style={styles.h4Text}>{user?.first_name}</Text>
                    <Card.Divider/>
                    <Text h5 style={styles.h5Text}>LAST NAME</Text>
                    <Text h5 style={styles.h4Text}>{user?.last_name}</Text>                   
                    <Card.Divider/>
                    <Text h5 style={styles.h5Text}>TENANT ID</Text>
                    <Text h5 style={styles.h4Text}>{user?.tenant_number}</Text>
                    <Card.Divider/>
                    <Text h5 style={styles.h5Text}>PHONE NUMBER</Text>
                    <Text h5 style={styles.h4Text}>+256 {user?.phone_number}</Text>
                    <Card.Divider />
                    <Text h5 style={styles.h5Text}>EMAIL</Text>
                    <Text h5 style={styles.h4Text}>{user?.email}</Text>
                    <Card.Divider/>
                    <TouchableOpacity onPress={() => navigation.navigate("AccountDelete")}>
                        <View style={styles.deleteView}>
                            <AntDesign name="delete" size={25} color="red" style={{marginRight: 10}}/>
                            <Text h5 style={styles.deleteText}>Delete Account</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Card>
            ) : (
                <></>
            )}
            
        </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#F0ECE6",
    },
    optionsCard: {
      borderRadius: 20,
      padding: 25
    },
    h5Text: {
        fontSize: 14,
    },
    h4Text: {
        fontSize: 18,
        marginTop: 8,
        marginBottom: 8,
        fontWeight: 500
    },
    deleteText: {
        color: "red",
        fontSize: 14,
        fontSize: 16
    },
    deleteView: {
        flex: 1,
        flexDirection: "row",
        marginTop: 6
    }
});

export default AccountDetailsScreen;