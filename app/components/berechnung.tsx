import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useUser } from "../context/UserContext";

type AlkoholEintrag = {
  volume: string;
  strength: string;
  anzahl: string;
};

type BerechnungProps = {
  daten: AlkoholEintrag[];
  time: Date | null;
};

export default function Berechnung({ daten, time }: BerechnungProps) {
  const [ergebnis, setErgebnis] = useState<number | null>(null);
  const { gender: geschlecht, massKG: gewicht } = useUser();

  const calculatePromille = () => {
    const distributionFactor = geschlecht === "male" ? 0.68 : 0.55; // männlich 0.68, weiblich 0.55
    const reductionFactor = 0.11; // pro Stunde (zw. 0.1 und 0.15)
    const jetzt = new Date();
    const vergangeneZeit = time ? time : jetzt;

    const differenzInMs = jetzt.getTime() - vergangeneZeit.getTime();
    const startTimeInHours = differenzInMs / (1000 * 60 * 60);

    // Gesamt-Alkoholmenge in Gramm berechnen:
    const gesamtAlkohol = daten.reduce((summe, eintrag) => {
      const volumeML = parseFloat(eintrag.volume);
      const strength = parseFloat(eintrag.strength);
      const anzahl = parseFloat(eintrag.anzahl);

      if (isNaN(volumeML) || isNaN(strength) || isNaN(anzahl)) return summe;

      const alkoholInGramm = volumeML * (strength / 100) * 0.8 * anzahl;
      return summe + alkoholInGramm;
    }, 0);

    const promille =
      (gesamtAlkohol * 0.9) / (distributionFactor * gewicht) -
      reductionFactor * startTimeInHours;

    setErgebnis(Math.max(promille, 0));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={calculatePromille}>
        <Text style={styles.text}>Berechne ‰</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        Promillewert aktuell:
        <Text style={styles.ergebnis}>
          {ergebnis !== null ? ` ${ergebnis.toFixed(2)} ‰` : " -"}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
  },
  button: {
    backgroundColor: "rgb(3, 133, 184)",
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  ergebnis: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
});
