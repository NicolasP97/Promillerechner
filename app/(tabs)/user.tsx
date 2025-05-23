import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { useUser } from "../context/UserContext";

export default function UserInfo() {
  const {
    gender: selectedGender,
    setGender: onSelect,
    massKG,
    setMassKG,
  } = useUser();

  const [inputMass, setInputMass] = useState(massKG.toString());
  useEffect(() => {
    setInputMass(massKG.toString());
  }, [massKG]);

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardWrapper}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View style={styles.content}>
            <Text style={styles.label}>Geschlecht (biologisch)</Text>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedGender === "male" && styles.activeButton,
                ]}
                onPress={() => onSelect("male")}
              >
                <Ionicons name="male" color="rgb(7, 232, 248)" size={25} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  selectedGender === "female" && styles.activeButton,
                ]}
                onPress={() => onSelect("female")}
              >
                <Ionicons name="female" color="rgb(248, 7, 240)" size={25} />
              </TouchableOpacity>
            </View>

            <View style={styles.massWrapper}>
              <Text style={styles.label}>Gewicht (kg)</Text>
              <TextInput
                style={styles.input}
                value={inputMass} // number -> string
                onChangeText={(text) => {
                  setInputMass(text);
                  const parsed = parseFloat(text);
                  if (!isNaN(parsed)) {
                    setMassKG(parsed); //  safe update
                  }
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoHeader}>Information:</Text>
            <Text style={styles.infoText}>
              Diese App berechnet Promillewerte mithilfe der Widmark-Formel. Die
              errechneten Werte dienen lediglich als grobe Orientierung. Die
              Ergebnisse sind nicht rechtlich bindend und keine Garantie für
              Fahrtüchtigkeit.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  keyboardWrapper: {
    flex: 1,
    justifyContent: "space-between", // verteilt oben & unten
    width: "100%", // wichtig für volle Breite
    alignItems: "center", // zentriert Elemente horizontal
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: "white",
    marginBottom: 10,
    fontSize: 32,
    fontFamily: "QuicksandBold",
    textAlign: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "rgb(23, 23, 23)",
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent", // default kein Rand
    margin: 10,
  },

  activeButton: {
    borderColor: "white", // aktiver Rahmen
    backgroundColor: "rgb(56, 56, 56)",
  },
  massWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  input: {
    width: 100,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    color: "white",
    fontFamily: "QuicksandBold",
    textAlign: "center",
    margin: 10,
  },
  infoContainer: {
    width: "95%",
    marginBottom: 20,
  },
  infoHeader: {
    color: "lightgrey",
    fontSize: 16,
    fontFamily: "QuicksandBold",
    textAlign: "center",
  },
  infoText: {
    color: "lightgrey",
    fontSize: 14,
    fontFamily: "QuicksandMedium",
    textAlign: "center",
  },
});
