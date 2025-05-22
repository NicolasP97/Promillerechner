import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import calculatePromilleExtern from "./calculatePromilleExtern";
import PromilleChart from "./alkTrend";

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
  const [ergebnis, setErgebnis] = useState<number>(0);
  const [drinkingTime, setDrinkingTime] = useState<number>(0);
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
    const result = calculatePromilleExtern(daten, gewicht, time, geschlecht);
    setDrinkingTime(result.stundenSeitTrinken);
    setErgebnis(result.promille);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={calculatePromille}
        >
          <LinearGradient
            colors={["cyan", "rgb(0, 81, 255)"]}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Berechne Promille</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.text}>
        Promillewert aktuell:
        <Text style={styles.ergebnis}>
          {ergebnis !== null && ergebnis > 1000 ? (
            <Text style={styles.gewichtText}> Gewicht schon eingegeben?</Text>
          ) : ergebnis > 5 ? (
            <Text style={styles.highPromilleText}>
              {" "}
              {ergebnis.toFixed(2)}‰ 🤔
            </Text>
          ) : ergebnis !== null ? (
            ` ${ergebnis.toFixed(2)}‰`
          ) : (
            " -"
          )}
        </Text>
      </Text>

      {ergebnis !== 0 && ergebnis <= 20 ? (
        <PromilleChart promille={ergebnis} time={drinkingTime} />
      ) : (
        ""
      )}

      <Text style={styles.disclaimer}>
        {ergebnis !== null && ergebnis >= 0.2 && ergebnis < 50 ? (
          <>
            Bereits ab 0,2 ‰ kann die Fahrtüchtigkeit beeinträchtigt sein. Die
            dargestellten Werte basieren auf einer Schätzung und sind nicht
            rechtsverbindlich.{" "}
            <Text style={{ fontWeight: "bold" }}>
              Niemals unter Alkoholeinfluss fahren.
            </Text>
          </>
        ) : (
          ""
        )}
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
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontFamily: "QuicksandBold",
  },
  buttonText: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    fontFamily: "QuicksandBold",
  },
  gradientButton: {
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 26,
    color: "white",
    fontFamily: "QuicksandBold",
  },
  gewichtText: {
    fontSize: 24,
    color: "cyan",
    fontFamily: "QuicksandBold",
  },
  highPromilleText: {
    fontSize: 26,
    color: "red",
    fontFamily: "QuicksandBold",
  },
  disclaimer: {
    marginTop: 50,
    fontSize: 20,
    color: "white",
    fontStyle: "italic",
    textAlign: "center",
  },
});
