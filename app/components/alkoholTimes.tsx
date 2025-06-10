import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

type AlkoholTimesProps = {
  count: number;
  nummer: number;
  id: number;
};

export default function Alkoholtimes({ count, nummer, id }: AlkoholTimesProps) {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const scalePlus = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onPress = () => {
    setShowPicker(true);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  const formattedTime = `${time.getHours()}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.buttonWrapper, { transform: [{ scale: scalePlus }] }]}
      >
        <TouchableOpacity
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPress}
        >
          <LinearGradient
            colors={["cyan", "rgb(0, 81, 255)"]}
            style={styles.gradientButton}
          >
            <View style={styles.nummerContainer}>
              <Text style={styles.buttonText}>
                {nummer}.
                {id === 1 ? (
                  <Text>🍺</Text>
                ) : id === 2 ? (
                  <Text>🍷</Text>
                ) : id === 3 ? (
                  <Text>🥃</Text>
                ) : id === 4 ? (
                  <Text>🍹</Text>
                ) : id === 5 ? (
                  <Text>🍸</Text>
                ) : null}
              </Text>
            </View>
            <Text style={styles.buttonText}>{formattedTime}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    marginTop: 10,
  },
  gradientButton: {
    width: 55,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",

    // iOS Shadow
    shadowColor: "cyan",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Android Shadow
    elevation: 6,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "QuicksandBold",
    textAlign: "center",
    lineHeight: 14, // leicht angepasst für bessere vertikale Ausrichtung
  },
  nummerContainer: {
    flexDirection: "row",
  },
});
