import { useState } from "react";
import {
  View,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

type TimeInputProps = {
  onTimeChange: (time: Date) => void;
};

export default function TimeInput({ onTimeChange }: TimeInputProps) {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setTime(selectedDate);
      onTimeChange(selectedDate); // Uhrzeit an Eltern weitergeben
    }
  };

  const formattedTime = `${time.getHours()}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Saufen begonnen um:</Text>

      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <LinearGradient
          colors={["cyan", "rgb(0, 81, 255)"]}
          style={styles.gradientButton}
        >
          <View style={styles.buttonTextWrapper}>
            <Ionicons name={"time-outline"} color={"white"} size={24} />
            <Text style={styles.buttonText}>
              Uhrzeit wählen: {formattedTime}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

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
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
    fontFamily: "QuicksandMedium",
  },
  gradientButton: {
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    // iOS Shadow
    shadowColor: "cyan",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Android Shadow
    elevation: 6,
    marginBottom: 10,
  },
  buttonTextWrapper: {
    flexDirection: "row",
    alignItems: "center", //vertikale Zentrierung
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 5,
    color: "#fff",
    fontSize: 18,
    fontFamily: "QuicksandBold",
    textAlign: "center",
    lineHeight: 22, // leicht angepasst für bessere vertikale Ausrichtung
  },
});
