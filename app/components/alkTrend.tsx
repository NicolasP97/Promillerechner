import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text as NativeText,
} from "react-native";
import Svg, { Line, Path, Text, Circle, G } from "react-native-svg";

type HistoryPoint = {
  time: Date;
  promille: number;
};

type PromilleChartProps = {
  promille: number;
  history: HistoryPoint[];
};

export default function PromilleChart({
  promille: maxPromille,
  history,
}: PromilleChartProps) {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const reductionFactor = 0.11;
  const timeNow = new Date();
  const hoursTillZeroPromille = maxPromille / reductionFactor;
  const zeroTime = new Date(
    timeNow.getTime() + hoursTillZeroPromille * 3600_000
  );

  // → 1) Finde das früheste Datum in history (oder fallback auf timeNow)
  const earliestTime =
    history.length > 0
      ? history.reduce(
          (min, p) => (p.time < min ? p.time : min),
          history[0].time
        )
      : timeNow;

  // Gesamte Minute-Spanne von frühestem Drink bis Null-Promille
  const totalMinutes = (zeroTime.getTime() - earliestTime.getTime()) / 60000;

  const earliestOffset = (earliestTime.getTime() - timeNow.getTime()) / 60000;

  // Hilfsfunktion: Date → "HH:MM"
  function formatTime(date: Date) {
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // === 1) Prognose-Datenpunkte ===
  const hoursToAdd = [0, 0.2, 0.4, 0.6, 0.8, 1].map(
    (f) => f * hoursTillZeroPromille
  );
  const futureData = hoursToAdd.map((h) => {
    const date = new Date(timeNow.getTime() + h * 3600_000);
    const prom = Math.max(maxPromille - h * reductionFactor, 0);
    const minsOffset = (date.getTime() - timeNow.getTime()) / 60000;
    return { date, promille: +prom.toFixed(2), minsOffset };
  });

  // === 2) Skalierung vorbereiten ===
  // const totalMinutes = hoursTillZeroPromille * 60;
  const chartWidth = 110; // ViewBox-Breite
  const pxPerMinute = chartWidth / totalMinutes;
  const toX = (minsOffset: number) =>
    (minsOffset - earliestOffset) * pxPerMinute;

  // Y-Skala von 0 bis größter Wert in history oder Zukunft
  const allY = [
    ...futureData.map((d) => d.promille),
    ...history.map((h) => h.promille),
  ];
  const maxY = Math.max(...allY, 0);
  const minY = 0;
  const toY = (p: number) => 100 - ((p - minY) / (maxY - minY || 1)) * 100;

  // === 3) Pfade zusammenbauen ===
  // 3a) Historischer Verlauf (solid line)
  // Hilfsfunktion zur Kurvenglättung
  type Point = { x: number; y: number };
  function catmullRom2bezier(points: Point[]): string {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      // Catmull-Rom zu Bezier Formel:
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const histPoints = history.map((h) => ({
    x: toX((h.time.getTime() - timeNow.getTime()) / 60000),
    y: toY(h.promille),
  }));
  const pathHist = catmullRom2bezier(histPoints);

  // 3b) Prognose (dashed line)
  const pathFut = futureData
    .map(
      (d, i) => `${i === 0 ? "M" : "L"} ${toX(d.minsOffset)} ${toY(d.promille)}`
    )
    .join(" ");

  // === 4) Achsen und Labels ===
  const numLabels = 3;
  const stepMin = totalMinutes / numLabels;
  // Neu – verteilt die Labels zwischen earliestTime und zeroTime:

  const xLabels = Array.from({ length: numLabels + 1 }, (_, i) => {
    const minutesSinceStart = i * stepMin;
    const labelTime = new Date(
      earliestTime.getTime() + minutesSinceStart * 60000
    );
    const minsOffset = (labelTime.getTime() - timeNow.getTime()) / 60000;
    return {
      x: toX(minsOffset),
      label: formatTime(labelTime),
    };
  });

  // Marker für 0 ‰ und 0,5 ‰
  const timeAtZero = formatTime(
    new Date(timeNow.getTime() + hoursTillZeroPromille * 3600_000)
  );
  const hoursTill05 = (maxPromille - 0.5) / reductionFactor;
  const minsTill05 = hoursTill05 * 60;
  const xHalf = toX(minsTill05);
  const yHalf = toY(0.5);

  // Puls-Animation für 0,5 ‰-Marker
  const haloR = useRef(new Animated.Value(0)).current;
  const haloO = useRef(new Animated.Value(0.7)).current;
  const [r, setR] = useState(0);
  const [o, setO] = useState(0.7);
  useEffect(() => {
    if (maxPromille <= 0.5) return;
    haloR.setValue(0);
    haloO.setValue(0.7);
    const anim = Animated.loop(
      Animated.parallel([
        Animated.timing(haloR, {
          toValue: 10,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(haloO, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    anim.start();
    const rId = haloR.addListener(({ value }) => setR(value));
    const oId = haloO.addListener(({ value }) => setO(value));
    return () => {
      anim.stop();
      haloR.removeListener(rId);
      haloO.removeListener(oId);
    };
  }, [maxPromille]);

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="-5 -7 120 120">
        {/* Historischer Verlauf (solid) */}
        <Path d={pathHist} fill="none" stroke="cyan" strokeWidth="1.5" />

        {/* Prognose (dashed) */}
        <Path
          d={pathFut}
          fill="none"
          stroke="cyan"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />

        {/* Achsen */}
        <Line x1="0" y1="100" x2="115" y2="100" stroke="grey" strokeWidth="1" />
        <Line x1="0" y1="-10" x2="0" y2="100" stroke="grey" strokeWidth="1" />

        {/* X-Achsen-Labels */}
        {xLabels.map(({ x, label }, i) => (
          <Text
            key={`x-${i}`}
            x={x}
            y={110}
            fontSize="8"
            textAnchor="middle"
            fill="white"
          >
            {label}
          </Text>
        ))}
        {/* End-Label = Zeit bei 0 ‰ */}
        <Text
          x={129}
          y={103}
          fontSize="9"
          fontFamily="QuicksandBold"
          textAnchor="middle"
          fill="white"
        >
          Zeit
        </Text>

        {/* Y-Achsen-Labels */}
        {[0, maxY / 4, maxY / 2, (3 * maxY) / 4, maxY].map((p, i) => (
          <Text
            key={`y-${i}`}
            x={-2}
            y={toY(p)}
            fontSize="8"
            textAnchor="end"
            fill="white"
          >
            {p.toFixed(2)}
          </Text>
        ))}

        <Text
          x={-10}
          y={37} // vertikal mittig im Chart
          fontSize="10"
          fontFamily="QuicksandBold"
          fill="white"
          textAnchor="middle"
          transform="rotate(-90, -10, 50)" // Drehung um den Punkt (x=-10, y=50)
        >
          Promille
        </Text>

        {/* 0,5 ‰-Marker mit Animation */}
        {maxPromille > 0.5 && (
          <>
            <Line
              x1={xHalf}
              y1={yHalf}
              x2={xHalf}
              y2="100"
              stroke="grey"
              strokeWidth="1"
              strokeDasharray="5,3"
            />
            <G onPress={() => setIsInfoVisible((v) => !v)}>
              <Circle cx={xHalf} cy={yHalf} r={r} fill="#ff9500" opacity={o} />
              <Circle cx={xHalf} cy={yHalf} r={4} fill="#ff9500" />
            </G>
            {isInfoVisible && (
              <>
                <Text
                  x={xHalf + 25}
                  y={yHalf - 12}
                  fontSize="10"
                  textAnchor="middle"
                  fill="white"
                >
                  {formatTime(
                    new Date(timeNow.getTime() + hoursTill05 * 3600_000)
                  )}{" "}
                  Uhr*
                </Text>
                <Text
                  x={xHalf - 20}
                  y={yHalf + 10}
                  fontSize="10"
                  textAnchor="middle"
                  fill="white"
                >
                  0,5‰
                </Text>
              </>
            )}
          </>
        )}
      </Svg>
      {isInfoVisible && (
        <NativeText style={styles.prognoseText}>
          *Geschätze Uhrzeit für 0,5‰
        </NativeText>
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
  prognoseText: {
    fontSize: 12,
    color: "lightgrey",
    marginTop: 10,
    fontFamily: "QuicksandMedium",
    textAlign: "center",
  },
});
