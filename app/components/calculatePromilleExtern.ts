import { ImageSourcePropType } from "react-native";
type AlkoholEintrag = {
  volume: string;
  strength: string;
  anzahl: string;
};

interface DrinkType {
  id: number;
  art: string;
  volume: string;
  strength: string;
  anzahl: string;
  source: ImageSourcePropType;
}

interface DrinkEvent {
  id: string;
  drinkTypeId: number;
  timestamp: string;
}
export interface HistoryPoint {
  time: Date;
  promille: number;
}

export default function calculatePromilleExtern(
  daten: AlkoholEintrag[],
  gewicht: number | 0,
  time: Date | null,
  geschlecht: "male" | "female" | null
): { promille: number; stundenSeitTrinken: number } {
  const distributionFactor = geschlecht === "male" ? 0.68 : 0.55;
  const reductionFactor = 0.11;

  // Den Fall beachten, dass über Mitternacht getrunken wird
  const jetzt = new Date();
  const zeitpunkt = time ? time : jetzt;
  let differenzInMs;
  if (zeitpunkt.getTime() > jetzt.getTime()) {
    differenzInMs =
      24 * 1000 * 60 * 60 - (zeitpunkt.getTime() - jetzt.getTime());
  } else {
    differenzInMs = jetzt.getTime() - zeitpunkt.getTime();
  }

  const stunden = differenzInMs / (1000 * 60 * 60);

  // Gesamt-Alkoholmenge in Gramm berechnen:
  const gesamtAlkohol = daten.reduce((summe, eintrag) => {
    const volumeML = parseFloat(eintrag.volume);
    const strength = parseFloat(eintrag.strength);
    const anzahl = parseFloat(eintrag.anzahl);

    if (isNaN(volumeML) || isNaN(strength) || isNaN(anzahl)) return summe;

    const alkoholInGramm = volumeML * (strength / 100) * 0.8 * anzahl;
    return summe + alkoholInGramm;
  }, 0);

  // Fehlerfall: Kein gültiges Gewicht → Sonderwert zurückgeben
  if (!gewicht || gewicht <= 0 || isNaN(gewicht)) {
    return {
      promille: 9999,
      stundenSeitTrinken: stunden,
    };
  }

  const promille =
    (gesamtAlkohol * 0.9) / (distributionFactor * gewicht) -
    reductionFactor * stunden;

  return {
    promille: Math.max(promille, 0),
    stundenSeitTrinken: stunden,
  };
}

export function computePromilleAt(
  drinkTypes: DrinkType[],
  drinkEvents: DrinkEvent[],
  gewicht: number,
  geschlecht: "male" | "female" | null,
  at: Date
): number {
  // 1) Nur Drinks bis zum Zeitpunkt at berücksichtigen
  const pastEvents = drinkEvents.filter(
    (evt) => new Date(evt.timestamp).getTime() <= at.getTime()
  );

  // 2) Für jeden Event den Einzel-Promille-Wert berechnen und aufsummieren
  const totalPromille = pastEvents.reduce((sum, evt) => {
    // Erzeuge für genau diesen Drink ein temporäres Array,
    // in dem nur dieser DrinkType einmalig mit anzahl="1" auftaucht:
    const single: AlkoholEintrag[] = drinkTypes.map((d) =>
      d.id === evt.drinkTypeId
        ? { volume: d.volume, strength: d.strength, anzahl: "1" }
        : { volume: d.volume, strength: d.strength, anzahl: "0" }
    );

    // Nutze calculatePromilleExtern, um für genau dieses Getränk
    // zur Zeit `at` den Promille-Wert inklusive Abbau zu erhalten:
    const p = calculatePromilleExtern(single, gewicht, at, geschlecht).promille;

    return sum + p;
  }, 0);

  // 3) Gesamt-Promille darf nicht negativ werden
  return Math.max(totalPromille, 0);
}

export function computePromilleHistory(
  drinkTypes: DrinkType[],
  drinkEvents: DrinkEvent[],
  gewicht: number,
  geschlecht: "male" | "female" | null
): HistoryPoint[] {
  // 1) Chronologisch sortieren
  const sorted = [...drinkEvents].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const history: HistoryPoint[] = [];

  // 2) Peak + Abbau-Punkt pro Event
  sorted.forEach((evt, idx) => {
    const tEvent = new Date(evt.timestamp);
    // a) Peak direkt nach dem Drink
    const peak = computePromilleAt(
      drinkTypes,
      drinkEvents,
      gewicht,
      geschlecht,
      tEvent
    );
    history.push({ time: tEvent, promille: +peak.toFixed(3) });

    // b) 1 Sekunde vor dem nächsten Event: Abbau
    if (idx < sorted.length - 1) {
      const nextTime = new Date(sorted[idx + 1].timestamp);
      const justBefore = new Date(nextTime.getTime() - 1000);
      const drop = computePromilleAt(
        drinkTypes,
        drinkEvents,
        gewicht,
        geschlecht,
        justBefore
      );
      history.push({ time: justBefore, promille: +drop.toFixed(3) });
    }
  });

  // 3) Punkt "jetzt", damit History nahtlos bei future[0] ansetzt
  const now = new Date();
  const nowP = computePromilleAt(
    drinkTypes,
    drinkEvents,
    gewicht,
    geschlecht,
    now
  );
  history.push({ time: now, promille: +nowP.toFixed(3) });

  // 4) Chronologische Sortierung und Rückgabe
  return history.sort((a, b) => a.time.getTime() - b.time.getTime());
}
