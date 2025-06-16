import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import RemoveAlkohol from "./removeAlkohol";
import Alkoholtimes from "./alkoholTimes";

type AlkoholArtProps = {
  id: number;
  art: string;
  source: ImageSourcePropType;
  volume: string;
  strength: string;
  anzahl: string;
  onChange: (id: number, field: string, value: string) => void;
  onRemove: () => void;
  onDrinkEvent: (id: number, time: Date) => void;
  onRemoveDrinkEvent: (id: number) => void;
  drinkEvents: { id: string; drinkTypeId: number; timestamp: string }[];
  updateDrinkEvent: (eventId: string, time: Date) => void;
  removeAllDrinkEvents: (id: number) => void;
};

export default function AlkoholArt({
  id,
  art,
  source,
  volume,
  strength,
  anzahl,
  onChange,
  onRemove,
  onDrinkEvent,
  onRemoveDrinkEvent,
  drinkEvents,
  updateDrinkEvent,
  removeAllDrinkEvents,
}: AlkoholArtProps) {
  const evts = drinkEvents;
  const anzahlAsNumber = Number(anzahl);
  // Für Löschanimmation der Alkoholarten
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Für + und - Button Animation
  const scalePlus = useRef(new Animated.Value(1)).current;
  const scaleMinus = useRef(new Animated.Value(1)).current;

  const onPressInPlus = () => {
    Animated.spring(scalePlus, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const onPressOutPlus = () => {
    Animated.spring(scalePlus, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onPressInMinus = () => {
    Animated.spring(scaleMinus, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const onPressOutMinus = () => {
    Animated.spring(scaleMinus, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const increment = () => {
    const current = parseFloat(anzahl) || 0;
    onChange(id, "anzahl", String(current + 1));
    // direkt ein DrinkEvent mit "now" anlegen:
    onDrinkEvent(id, new Date());
  };

  const decrement = () => {
    const current = parseFloat(anzahl) || 0;
    onChange(id, "anzahl", String(Math.max(current - 1, 0)));
    if (current > 0) {
      onRemoveDrinkEvent(id);
    }
  };

  //  Animierter fade out beim löschen der Alkoholart
  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onRemove(); // Entfernt die Komponente aus dem State
      }, 150);
    });
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity, transform: [{ scale }, { translateX }, { translateY }] },
      ]}
    >
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>{art}</Text>
        <RemoveAlkohol
          onRemove={handleRemove}
          removeAllDrinkEvents={() => removeAllDrinkEvents(id)}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.imageWrapper}>
          <Image source={source} style={styles.image} />
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Volumen (ml)</Text>
          <TextInput
            style={styles.input}
            value={volume}
            onChangeText={(text) => onChange(id, "volume", text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Gehalt (%)</Text>
          <TextInput
            style={styles.input}
            value={strength}
            onChangeText={(text) => onChange(id, "strength", text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Anzahl</Text>
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={anzahl}
            onChangeText={(text) => onChange(id, "anzahl", text)}
            keyboardType="numeric"
            editable={false}
          />

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: scalePlus }] },
            ]}
          >
            <TouchableOpacity
              onPressIn={onPressInPlus}
              onPressOut={onPressOutPlus}
              onPress={increment}
            >
              <LinearGradient
                colors={["rgb(39, 80, 131)", "rgb(22, 36, 71)"]}
                style={styles.gradientButton}
              >
                <Ionicons name="add-circle" size={26} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: scaleMinus }] },
            ]}
          >
            <TouchableOpacity
              onPressIn={onPressInMinus}
              onPressOut={onPressOutMinus}
              onPress={decrement}
            >
              <LinearGradient
                colors={["rgb(39, 80, 131)", "rgb(22, 36, 71)"]}
                style={styles.gradientButton}
              >
                <Ionicons name="remove-circle" size={26} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <View style={styles.alkoholTimesContainer}>
        {evts.map((evt, idx) => (
          <Alkoholtimes
            key={evt.id}
            count={evts.length}
            nummer={idx + 1}
            id={id}
            eventId={evt.id}
            onTimeChange={(t: Date) => updateDrinkEvent(evt.id, t)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  headerWrapper: {
    position: "relative",
    alignItems: "center",
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    color: "white",
    fontFamily: "QuicksandBold",
    marginBottom: 12,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageWrapper: {
    height: 190,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 140,
    borderRadius: 12,
    marginRight: 14,
  },
  infoBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#aaa",
    fontFamily: "QuicksandMedium",
    marginBottom: 5,
    textAlign: "center",
  },
  input: {
    width: 80,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 8,
    fontSize: 19,
    fontFamily: "QuicksandBold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  smallInput: {
    width: 60,
    alignSelf: "center",
  },
  buttonWrapper: {
    alignItems: "center",
  },
  gradientButton: {
    width: 80,
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  alkoholTimesContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap", // Wenn zu viele Buttons -> untereinander gerendert
  },
});
