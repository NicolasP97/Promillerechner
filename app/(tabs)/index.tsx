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
import AddAlkoholArt from "../components/addAlkohol";

export default function Index() {
  const [sichtbareIDs, setSichtbareIDs] = useState([1]); // erstmal nur Bier rendern
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [alkoholDaten, setAlkoholDaten] = useState([
    {
      id: 1,
      art: "Bier",
      source: require("../../assets/images/bier.jpg"),
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
    {
      id: 4,
      art: "Aperol Spritz",
      source: require("../../assets/images/aperol.jpg"),
      volume: "200",
      strength: "10.5",
      anzahl: "0",
    },
    {
      id: 5,
      art: "Cocktail",
      source: require("../../assets/images/cocktail.jpg"),
      volume: "250",
      strength: "20",
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

            {alkoholDaten
              .filter((item) => sichtbareIDs.includes(item.id))
              .map((item) => (
                <AlkoholArt
                  key={item.id}
                  id={item.id}
                  art={item.art}
                  source={item.source}
                  volume={item.volume}
                  strength={item.strength}
                  anzahl={item.anzahl}
                  onChange={updateDaten}
                  onRemove={() => {
                    setSichtbareIDs(
                      sichtbareIDs.filter((id) => id !== item.id)
                    );
                    updateDaten(item.id, "anzahl", "0");
                  }}
                />
              ))}

            <AddAlkoholArt
              onAdd={(art) => {
                const gefunden = alkoholDaten.find((item) => item.art === art);
                if (gefunden && !sichtbareIDs.includes(gefunden.id)) {
                  setSichtbareIDs([...sichtbareIDs, gefunden.id]);
                }
              }}
            />
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
