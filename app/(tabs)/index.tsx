import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import { useState } from "react";
import AlkoholArt from "../components/alkohol";
import Berechnung from "../components/berechnung";
import TimeInput from "../components/timepicker";

export default function Index() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [alkoholDaten, setAlkoholDaten] = useState([
    {
      id: 1,
      art: "Bier",
      source: require("../../assets/images/augustiner.jpg"),
      volume: "500",
      strength: "4.9",
      anzahl: "0",
    },
    {
      id: 2,
      art: "Wein",
      source: require("../../assets/images/wein.jpg"),
      volume: "125",
      strength: "14",
      anzahl: "0",
    },
    {
      id: 3,
      art: "Schnaps",
      source: require("../../assets/images/shot.jpg"),
      volume: "40",
      strength: "40",
      anzahl: "0",
    },
  ]);

  const updateDaten = (id: number, field: string, value: string) => {
    setAlkoholDaten((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.timeInput}>
            <TimeInput onTimeChange={setSelectedTime} />
          </View>

          {alkoholDaten.map((item) => (
            <AlkoholArt
              key={item.id}
              id={item.id}
              art={item.art}
              source={item.source}
              volume={item.volume}
              strength={item.strength}
              anzahl={item.anzahl}
              onChange={updateDaten}
            />
          ))}

          <Berechnung daten={alkoholDaten} time={selectedTime} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "rgb(12, 5, 45)",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Platz unter der Tastatur
  },
  text: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  timeInput: {
    marginBottom: 15,
  },
});
