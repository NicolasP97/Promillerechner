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
  const distributionFactor = geschlecht === "male" ? 0.68 : 0.55;
  const reductionFactor = 0.11;

  // Nur Drinks bis zum Zeitpunkt at berücksichtigen
  const pastEvents = drinkEvents.filter(
    (evt) => new Date(evt.timestamp).getTime() <= at.getTime()
  );

  // Für jeden Drink berechnen: Wie viel Gramm Alkohol ist zum Zeitpunkt at noch da?
  const totalGrams = pastEvents.reduce((sum, evt) => {
    const type = drinkTypes.find((d) => d.id === evt.drinkTypeId);
    if (!type) return sum;

    const volumeML = parseFloat(type.volume);
    const strength = parseFloat(type.strength);
    const grams = volumeML * (strength / 100) * 0.8;

    // Hier der entscheidende Unterschied:
    const drankAt = new Date(evt.timestamp);
    const hours = (at.getTime() - drankAt.getTime()) / 3_600_000;
    const remaining = Math.max(grams - reductionFactor * hours, 0);
    console.log("evt", evt, "hours", hours, "remaining", remaining);
    return sum + remaining;
  }, 0);

  // Widmark-Formel
  const promille = (totalGrams * 0.9) / (distributionFactor * gewicht);
  return Math.max(promille, 0);
}

export function computePromilleHistory(
  drinkTypes: DrinkType[],
  drinkEvents: DrinkEvent[],
  gewicht: number,
  geschlecht: "male" | "female" | null,
  aktuellerPromillewert: number | 0
): HistoryPoint[] {
  const reductionFactor = 0.11;
  const distributionFactor = geschlecht === "male" ? 0.68 : 0.55;

  // 1) Chronologisch sortieren
  const sorted = [...drinkEvents].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let history: HistoryPoint[] = [];

  sorted.forEach((evt, idx) => {
    const tEvent = new Date(evt.timestamp);

    // 1. Für alle bisherigen Drinks berechnen: Wie viel Promille bleibt noch übrig bis tEvent?
    let promilleSum = 0;

    for (let j = 0; j <= idx; j++) {
      const earlierEvt = sorted[j];
      const earlierType = drinkTypes.find(
        (d) => d.id === earlierEvt.drinkTypeId
      );
      if (!earlierType) continue;

      const volumeML = parseFloat(earlierType.volume);
      const strength = parseFloat(earlierType.strength);
      const grams = volumeML * (strength / 100) * 0.8;
      const earlierPeak = (grams * 0.9) / (distributionFactor * gewicht);

      const earlierTime = new Date(earlierEvt.timestamp);
      const hours = (tEvent.getTime() - earlierTime.getTime()) / 3_600_000;
      const reduced = Math.max(earlierPeak - reductionFactor * hours, 0);

      promilleSum += reduced;
    }

    // 2. Das ist jetzt der tatsächliche Promillewert beim Event-Zeitpunkt!
    history.push({ time: tEvent, promille: +promilleSum.toFixed(3) });

    // 3. Für Drop (eine Sekunde vor dem nächsten Event)
    if (idx < sorted.length - 1) {
      const nextTime = new Date(sorted[idx + 1].timestamp);
      const justBefore = new Date(nextTime.getTime() - 1000);

      // Summe aller bisherigen Drinks, abgebaut bis justBefore
      let dropSum = 0;
      for (let j = 0; j <= idx; j++) {
        const earlierEvt = sorted[j];
        const earlierType = drinkTypes.find(
          (d) => d.id === earlierEvt.drinkTypeId
        );
        if (!earlierType) continue;

        const volumeML = parseFloat(earlierType.volume);
        const strength = parseFloat(earlierType.strength);
        const grams = volumeML * (strength / 100) * 0.8;
        const earlierPeak = (grams * 0.9) / (distributionFactor * gewicht);

        const earlierTime = new Date(earlierEvt.timestamp);
        const hours =
          (justBefore.getTime() - earlierTime.getTime()) / 3_600_000;
        const reduced = Math.max(earlierPeak - reductionFactor * hours, 0);

        dropSum += reduced;
      }
      history.push({ time: justBefore, promille: +dropSum.toFixed(3) });
    }
  });

  // Am Ende: Jetzt-Wert über calculatePromilleExtern anhängen
  const promilleJetzt = aktuellerPromillewert;
  history.push({
    time: new Date(),
    promille: +aktuellerPromillewert.toFixed(3),
  });

  // Chronologisch sortieren (safety, falls du es brauchst)
  return history.sort((a, b) => a.time.getTime() - b.time.getTime());
}
