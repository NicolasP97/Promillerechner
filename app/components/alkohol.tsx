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
import Ionicons from "@expo/vector-icons/Ionicons";
import RemoveAlkohol from "./removeAlkohol";

type AlkoholArtProps = {
  id: number;
  art: string;
  source: ImageSourcePropType;
  volume: string;
  strength: string;
  anzahl: string;
  onChange: (id: number, field: string, value: string) => void;
  onRemove: () => void; // z. B. "Wein", "Schnaps"
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
}: AlkoholArtProps) {
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
  };

  const decrement = () => {
    const current = parseFloat(anzahl) || 0;
    onChange(id, "anzahl", String(Math.max(current - 1, 0)));
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
        <RemoveAlkohol onRemove={handleRemove} />
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
          />

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: scalePlus }] },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPressIn={onPressInPlus}
              onPressOut={onPressOutPlus}
              onPress={increment}
            >
              <Ionicons name="add-circle" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: scaleMinus }] },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPressIn={onPressInMinus}
              onPressOut={onPressOutMinus}
              onPress={decrement}
            >
              <Ionicons name="remove-circle" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
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
    marginRight: 16,
  },
  infoBlock: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#aaa",
    fontFamily: "QuicksandMedium",
    marginBottom: 4,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
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
  button: {
    width: 80,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 7,
    alignItems: "center",
    justifyContent: "center",
  },
});
