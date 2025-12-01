import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

import { useUser } from "../context/UserContext";

export default function UserInfo() {
  const {
    gender: selectedGender,
    setGender: onSelect,
    massKG,
    setMassKG,
  } = useUser();

  const [inputMass, setInputMass] = useState(massKG ? massKG.toString() : "");

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
                <View style={styles.genderContainer}>
                  <Ionicons name="male" color="rgb(7, 232, 248)" size={25} />
                  <Text style={styles.genderText}>männlich</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  selectedGender === "female" && styles.activeButton,
                ]}
                onPress={() => onSelect("female")}
              >
                <View style={styles.genderContainer}>
                  <Ionicons name="female" color="rgb(248, 7, 240)" size={25} />
                  <Text style={styles.genderText}>weiblich</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.massWrapper}>
              {massKG > 0 ? (
                <Text style={styles.label}>Gewicht (kg)</Text>
              ) : (
                <Text style={styles.labelMassZero}>Gewicht (kg)</Text>
              )}
              <TextInput
                style={styles.input}
                value={inputMass} // number -> string
                onChangeText={(text) => {
                  setInputMass(text);
                }}
                //erst wenn Keyboard geschlossen wird, wird der Wert aktualisiert
                onBlur={() => {
                  // Internen Wert setzen
                  const parsed = parseFloat(inputMass);
                  if (isNaN(parsed)) {
                    setMassKG(0); // intern 0
                  } else {
                    setMassKG(parsed);
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
    paddingTop: 50,
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
  labelMassZero: {
    color: "cyan",
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
    padding: 17,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent", // default kein Rand
    margin: 10,
  },

  activeButton: {
    borderColor: "white", // aktiver Rahmen
    backgroundColor: "rgb(56, 56, 56)",
  },
  genderContainer: {
    alignItems: "center",
  },
  genderText: {
    color: "white",
    fontFamily: "QuicksandBold",
    fontSize: 14,
    marginTop: 5,
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
