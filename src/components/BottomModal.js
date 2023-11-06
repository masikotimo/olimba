import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import YellowButton from "./YellowButton";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const { width: windowWidth } = Dimensions.get("window");
const gap = 10;
const HEIGHT = 220;

function BottomModal({ navigation }) {

    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            return <Text >Press Confirm</Text>;
        }
        
        return (
            <View style={styles.timer}>
                <Text>Remaining</Text>
                <Text style={{fontSize: 20}}>{remainingTime}</Text>
                <Text>seconds</Text>
            </View>
        );
        };

  return (
    <>
      <Text style={styles.label}>Confirm that you have input your pin</Text>
        <View style={styles.timer_wrapper}>
        <CountdownCircleTimer
                isPlaying
                duration={20}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[20, 10, 8, 0]}
            >
                {renderTime}
        </CountdownCircleTimer>
      </View>  
      <View style={styles.container}>
        <YellowButton title={"Confirm"} onPress={()=>navigation.navigate("RentalTracker")}/>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: gap,
    flex: 1,
    height: HEIGHT / 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    // color: PRIMARY_COLOR,
  },
  swatch: {
    height: (windowWidth - 10 * gap) / 7,
    aspectRatio: 1,
    borderRadius: 4,
  },
  timer_wrapper: {
    display: 'flex',
    alignItems: "center"
  },
  timer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default BottomModal;