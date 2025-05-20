import { View, StyleSheet } from "react-native";
import Svg, { Line, Path, Text, Circle, G } from "react-native-svg";
import { Animated, Easing } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Text as NativeText } from "react-native";

type PromilleChartTypes = {
  promille: number;
  time: number;
};

export default function PromilleChart({ promille, time }: PromilleChartTypes) {
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);
  const maxPromille = promille;
  const reductionFactor = 0.11;

  const timeNow = new Date();
  const hoursTillZeroPromille = maxPromille / reductionFactor;

  const timeAtZeroPromille = formatTime(
    new Date(timeNow.getTime() + hoursTillZeroPromille * 60 * 60 * 1000)
  );

  // Hilfsfunktion zum Formatieren (HH:MM:SS)
  function formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  // Stunden in Millisekunden (1h = 3600000 ms)
  const hoursToAdd = [
    0,
    hoursTillZeroPromille * 0.2,
    hoursTillZeroPromille * 0.4,
    hoursTillZeroPromille * 0.6,
    hoursTillZeroPromille * 0.8,
    hoursTillZeroPromille,
  ];
  const futureTimeObjects = hoursToAdd.map((h) => {
    const futureDate = new Date(timeNow.getTime() + h * 60 * 60 * 1000);
    return {
      label: formatTime(futureDate), // z. B. "14:29"
      minutes: Math.round((futureDate.getTime() - timeNow.getTime()) / 60000), // in Minuten
    };
  });

  const promillePerHour = hoursToAdd.map((h) => {
    return +(maxPromille - h * reductionFactor).toFixed(2);
  });
  const max = Math.max(...promillePerHour);
  const min = Math.min(...promillePerHour);

  const hoursTill05Promille = (maxPromille - 0.5) / reductionFactor;
  const minutesTill05Promille = hoursTill05Promille * 60;

  const timeAt05Promile = formatTime(
    new Date(timeNow.getTime() + hoursTill05Promille * 60 * 60 * 1000)
  );

  const data = futureTimeObjects.map((entry, index) => ({
    time: entry.label,
    minutes: entry.minutes,
    promille: promillePerHour[index],
  }));

  // Das streckt oder staucht den Graphen je nach Dauer – immer passend zur Promillezeit
  const totalMinutes = hoursTillZeroPromille * 60;
  const chartWidth = 110; // ViewBox-Breite bleibt

  const pxPerMinute = chartWidth / totalMinutes;

  // X- und Y-Datenpunkte generieren
  const toX = (minutes: number) => minutes * pxPerMinute;
  const toY = (promille: number) => {
    const range = max - min || 1; // gegen Division durch 0 absichern
    return 100 - ((promille - min) / range) * 100;
  };

  // X-Achsenlabels
  let labelStepMinutes: number;
  if (hoursTillZeroPromille < 3) {
    labelStepMinutes = 60;
  } else if (hoursTillZeroPromille > 3 && hoursTillZeroPromille < 6) {
    labelStepMinutes = 120;
  } else if (hoursTillZeroPromille > 6 && hoursTillZeroPromille < 9) {
    labelStepMinutes = 180;
  } else if (hoursTillZeroPromille > 9 && hoursTillZeroPromille < 12) {
    labelStepMinutes = 240;
  } else if (hoursTillZeroPromille > 12 && hoursTillZeroPromille < 15) {
    labelStepMinutes = 300;
  } else if (hoursTillZeroPromille > 15 && hoursTillZeroPromille < 18) {
    labelStepMinutes = 360;
  } else if (hoursTillZeroPromille > 18 && hoursTillZeroPromille < 21) {
    labelStepMinutes = 420;
  } else if (hoursTillZeroPromille > 21 && hoursTillZeroPromille < 24) {
    labelStepMinutes = 480;
  } else if (hoursTillZeroPromille > 24 && hoursTillZeroPromille < 27) {
    labelStepMinutes = 540;
  } else if (hoursTillZeroPromille > 27 && hoursTillZeroPromille < 30) {
    labelStepMinutes = 600;
  } else if (hoursTillZeroPromille > 30 && hoursTillZeroPromille < 33) {
    labelStepMinutes = 660;
  } else {
    labelStepMinutes = 720;
  }

  const numLabels = Math.floor(totalMinutes / labelStepMinutes);
  const xAxisLabels = Array.from({ length: numLabels + 1 }, (_, i) => {
    const minutes = i * labelStepMinutes;
    const date = new Date(timeNow.getTime() + minutes * 60000);
    return {
      label: formatTime(date),
      x: toX(minutes),
    };
  });
  // Zeitpunkte für 0,5 Promille und 0 Promille
  const halfPromille = toX(minutesTill05Promille);
  const lastX = toX(hoursTillZeroPromille * 60);

  // Verhindern, dass letztes Label gerendert wird wenn zu nah an anderen Labels
  const minLabelSpacing = 20;
  const isTooClose = xAxisLabels.some(
    ({ x }) => Math.abs(x - lastX) < minLabelSpacing
  );

  // Y-Achsenlabels
  const steps = 4;
  const stepSize = (max - min) / steps;
  const yLabels = Array.from(
    { length: steps + 1 },
    (_, i) => +(min + i * stepSize).toFixed(2)
  ).reverse(); // damit höchster Wert oben steht

  // Daten für Path erstellen
  const pathData = data
    .map(
      (d, i) => `${i === 0 ? "M" : "L"} ${toX(d.minutes)} ${toY(d.promille)}`
    )
    .join(" ");

  // Circle Infotext bei 0,5 Promile
  const handleClick = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  // Circle Halo-Puls-Animation Setup
  const haloRadius = useRef(new Animated.Value(0)).current;
  const haloOpacity = useRef(new Animated.Value(0.7)).current;
  const [r, setR] = useState(0);
  const [opacity, setOpacity] = useState(0.7);

  useEffect(() => {
    if (maxPromille <= 0.5) return;

    haloRadius.setValue(0);
    haloOpacity.setValue(0.7);

    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(haloRadius, {
          toValue: 10,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(haloOpacity, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    const rId = haloRadius.addListener(({ value }) => setR(value));
    const oId = haloOpacity.addListener(({ value }) => setOpacity(value));

    return () => {
      animation.stop();
      haloRadius.removeListener(rId);
      haloOpacity.removeListener(oId);
    };
  }, [maxPromille]); // Abhängig vom Wert

  return (
    <View style={styles.container}>
      <Svg
        height="100%"
        width="100%"
        viewBox="-5 -7 120 120"
        pointerEvents="box-none"
      >
        {/* Datenlinien für Prognose */}
        <Path
          d={pathData}
          fill="none"
          stroke="rgb(0, 255, 255)"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />

        {/* X-Achse */}
        <Line x1="0" y1="100" x2="115" y2="100" stroke="grey" strokeWidth="1" />
        <Text
          x="121" // etwas rechts vom X-Achsen-Ende (bei x=110)
          y="102" // auf Höhe der Achse oder leicht darunter
          fontSize="9"
          fontFamily="QuicksandBold"
          fill="white"
          textAnchor="start"
        >
          Zeit
        </Text>

        {/* Y-Achse */}
        <Line x1="0" y1="-10" x2="0" y2="100" stroke="grey" strokeWidth="1" />
        <Text
          x="-10"
          y="37" // vertikal mittig im Chart
          fontSize="10"
          fontFamily="QuicksandBold"
          fill="white"
          textAnchor="middle"
          transform="rotate(-90, -10, 50)" // Drehung um den Punkt (x=-10, y=50)
        >
          Promille
        </Text>

        {/* X-Achse Labels (Stunden) */}
        {xAxisLabels.map(({ label, x }, i) => (
          <Text
            key={`x-label-${i}-${label}`}
            x={x}
            y={110}
            fontSize="8"
            textAnchor="middle"
            fill="white"
            fontFamily="Lato"
          >
            {label}
          </Text>
        ))}
        {/* Letzter X-Wert = Zeit bei 0 Promille */}
        {!isTooClose && (
          <Text x={lastX} y={110} fontSize="8" fill="white" textAnchor="middle">
            {timeAtZeroPromille}
          </Text>
        )}

        {/* Y-Achse Labels (Promille) */}
        {yLabels.map((p, i) => (
          <Text
            key={`y-label-${i}-${p}`}
            x={-2}
            y={toY(p)}
            fontSize="8"
            textAnchor="end"
            fill="white"
            fontFamily="Lato"
          >
            {p.toFixed(2)}
          </Text>
        ))}

        {/* 0,5 Promille-Marker */}
        <Line
          x1={halfPromille}
          y1={toY(0.5)}
          x2={halfPromille}
          y2="100"
          stroke="rgb(186, 184, 184)"
          strokeWidth="1"
          strokeDasharray="5,3" // gestrichelt für Style
        />

        {/* 0,5 Promille Markierung mit Info der Uhrzeit */}
        {/* Halo-Kreis außen */}
        {maxPromille > 0.5 ? (
          <G onPressIn={handleClick}>
            <Circle
              cx={halfPromille}
              cy={toY(0.5)}
              r={r}
              fill="#ff9500"
              opacity={opacity}
            />

            {/* Fester innerer Kreis */}
            <Circle cx={halfPromille} cy={toY(0.5)} r={4} fill="#ff9500" />
          </G>
        ) : (
          ""
        )}

        {isInfoVisible ? (
          <Text
            x={halfPromille + 25}
            y={toY(0.5) - 12}
            fontSize="10"
            textAnchor="middle"
            fill="white"
            fontFamily="Lato"
          >
            {`${timeAt05Promile} Uhr*`}
          </Text>
        ) : (
          ""
        )}
        {isInfoVisible ? (
          <Text
            x={halfPromille - 20}
            y={toY(0.5) + 10}
            fontSize="10"
            textAnchor="middle"
            fill="white"
            fontFamily="Lato"
          >
            0,5‰
          </Text>
        ) : (
          ""
        )}
      </Svg>
      {isInfoVisible ? (
        <NativeText style={styles.prognoseText}>
          *Geschätze Uhrzeit für 0,5‰
        </NativeText>
      ) : (
        ""
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 275,
    width: "100%",
    marginTop: 30,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
    fontFamily: "QuicksandMedium",
  },
  prognoseText: {
    fontSize: 12,
    color: "lightgrey",
    marginTop: 10,
    fontFamily: "QuicksandMedium",
  },
});
