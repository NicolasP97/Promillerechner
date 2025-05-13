import { useState } from "react";
import { View, Button, Platform, Text, StyleSheet } from "react-native";
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

  return (
    <View>
      <Text style={styles.text}>Wann mit dem Trinken begonnen?</Text>
      <Button
        title={`Uhrzeit wählen: ${time.getHours()}:${time
          .getMinutes()
          .toString()
          .padStart(2, "0")}`}
        onPress={() => setShowPicker(true)}
      />

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
  text: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
  },
});
