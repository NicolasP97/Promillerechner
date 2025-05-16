import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
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

  const scale = useRef(new Animated.Value(1)).current;

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

  const calculatePromille = () => {
    const distributionFactor = geschlecht === "male" ? 0.68 : 0.55; // männlich 0.68, weiblich 0.55
    const reductionFactor = 0.11; // pro Stunde (zw. 0.1 und 0.15)
    const jetzt = new Date();
    const vergangeneZeit = time ? time : jetzt;

    // Den Fall beachten, dass über Mitternacht getrunken wird
    let differenzInMs;
    if (vergangeneZeit.getTime() > jetzt.getTime()) {
      differenzInMs =
        24 * 1000 * 60 * 60 - (vergangeneZeit.getTime() - jetzt.getTime());
    } else {
      differenzInMs = jetzt.getTime() - vergangeneZeit.getTime();
    }

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
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={calculatePromille}
        >
          <Text style={styles.text}>Berechne Promille</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.text}>
        Promillewert aktuell:
        <Text style={styles.ergebnis}>
          {ergebnis !== null && ergebnis > 1000
            ? " Gewicht eingegeben?"
            : ergebnis !== null
            ? ` ${ergebnis.toFixed(2)} ‰`
            : " -"}
        </Text>
      </Text>
      <Text style={styles.disclaimer}>
        {ergebnis !== null && ergebnis >= 0.2
          ? "Bereits ab 0,2 Promille kann es zu Beeinträchtigungen der Fahrtüchtigkeit kommen. Don't drink and drive!"
          : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    fontFamily: "QuicksandBold",
  },
  button: {
    width: 300,
    backgroundColor: "#00c3ef",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,

    // iOS Shadow
    shadowColor: "cyan",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Android Shadow
    elevation: 6,
  },
  ergebnis: {
    fontSize: 24,
    color: "white",
    fontFamily: "QuicksandBold",
  },
  disclaimer: {
    marginTop: 40,
    fontSize: 20,
    color: "white",
    fontStyle: "italic",
    textAlign: "center",
  },
});
