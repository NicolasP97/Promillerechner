import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
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
    <View style={styles.container}>
      <Text style={styles.label}>Geschlecht</Text>
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
        <Text style={styles.label}>Gewicht in kg:</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(12, 5, 45)",
    alignItems: "center",
  },
  label: {
    color: "white",
    marginBottom: 5,
    fontSize: 32,
  },
  buttonWrapper: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "rgb(23, 23, 23)",
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent", // default kein Rand
    alignItems: "center",
    margin: 10,
  },

  activeButton: {
    borderColor: "white", // aktiver Rahmen
    backgroundColor: "rgb(56, 56, 56)",
  },
  massWrapper: {
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
});
