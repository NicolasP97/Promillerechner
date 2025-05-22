type AlkoholEintrag = {
  volume: string;
  strength: string;
  anzahl: string;
};

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
