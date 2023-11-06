import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Text } from 'react-native-elements';

const HelpSupportScreen = () => {

  return (
    <ScrollView style={{
        marginTop: 20}}
    >
        <Card containerStyle={styles.optionsCard}>
            <View>
                <TouchableOpacity>
                  <Text style={styles.text}>Call Help Line</Text>
                </TouchableOpacity>
                <Card.Divider/>
                <TouchableOpacity>
                  <Text style={styles.text}>Report an issue</Text>
                </TouchableOpacity>
                <Card.Divider/>
                <TouchableOpacity>
                  <Text style={styles.text}>Send Feedback</Text>
                </TouchableOpacity>
                <Card.Divider/>
                <TouchableOpacity>
                  <Text style={styles.text}>Rate Us</Text>
                </TouchableOpacity>
            </View>
          </Card>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: 300,
    padding: 10
  }
});

export default HelpSupportScreen;