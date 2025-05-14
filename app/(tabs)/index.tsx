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
import { LinearGradient } from "expo-linear-gradient";

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
      volume: "175",
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
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.wrapper}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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

            {/* TO DO: Default nur Bier anzeigen, Weitere Alkoholarten durch + hinzufügen -> werden dann dynamisch gerendert */}

            <Berechnung daten={alkoholDaten} time={selectedTime} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Platz unter der Tastatur
  },
  timeInput: {
    marginBottom: 15,
  },
});
