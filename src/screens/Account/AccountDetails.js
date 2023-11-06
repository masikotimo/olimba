import React, {useContext} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Text, Avatar } from 'react-native-elements';
import { useSelector } from "react-redux";

const AccountDetailsScreen = () => {
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
            <Avatar
                size="large"
                rounded
                title="AV"
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
                containerStyle={{backgroundColor: "#FCB200", alignSelf: "center" }}
            />

            <Card containerStyle={styles.optionsCard}>
                <View>
                    <Text h5 style={styles.h5Text}>FIRST NAME</Text>
                    <Text h4 style={styles.h4Text}>{user.first_name}</Text>
                    <Card.Divider/>
                    <Text h5 style={styles.h5Text}>LAST NAME</Text>
                    <Text h4 style={styles.h4Text}>{user.last_name}</Text>                   
                    <Card.Divider/>
                    <Text h5 style={styles.h5Text}>TENANT ID</Text>
                    <Text h4 style={styles.h4Text}>{user.tenant_number}</Text>
                    <Card.Divider/>
                    <Text h5 style={styles.h5Text}>PHONE NUMBER</Text>
                    <Text h4 style={styles.h4Text}>+256 {user.phone_number}</Text>
                    <Card.Divider />
                    <Text h5 style={styles.h5Text}>EMAIL</Text>
                    <Text h4 style={styles.h4Text}>{user.email}</Text>
                    <Card.Divider/>
                </View>
            </Card>
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
        fontSize: 16,
        marginTop: 8,
        marginBottom: 8
    }
});

export default AccountDetailsScreen;