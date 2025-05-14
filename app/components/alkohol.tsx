import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
} from "react-native";

type AlkoholArtProps = {
  id: number;
  art: string;
  source: ImageSourcePropType;
  volume: string;
  strength: string;
  anzahl: string;
  onChange: (id: number, field: string, value: string) => void;
};

export default function AlkoholArt({
  id,
  art,
  source,
  volume,
  strength,
  anzahl,
  onChange,
}: AlkoholArtProps) {
  const increment = () => {
    const current = parseFloat(anzahl) || 0;
    onChange(id, "anzahl", String(current + 1));
  };

  const decrement = () => {
    const current = parseFloat(anzahl) || 0;
    onChange(id, "anzahl", String(Math.max(current - 1, 0)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Text style={styles.header}>{art}</Text>
        <Image source={source} style={styles.image} />
      </View>

      <View style={styles.volumenWrapper}>
        <Text style={styles.label}>Volumen ml</Text>
        <TextInput
          style={styles.input}
          value={volume}
          onChangeText={(text) => onChange(id, "volume", text)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Gehalt %</Text>
        <TextInput
          style={styles.input}
          value={strength}
          onChangeText={(text) => onChange(id, "strength", text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.volumenWrapper}>
        <Text style={[styles.text, { marginBottom: 12 }]}>Anzahl</Text>
        <View style={styles.anzahlWrapper}>
          <TextInput
            style={[styles.input, { width: 45 }]}
            value={anzahl}
            onChangeText={(text) => onChange(id, "anzahl", text)}
            keyboardType="numeric"
          />
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={increment}>
              <Text style={styles.buttonText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={decrement}>
              <Text style={styles.buttonText}>-1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageWrapper: {
    width: 135,
    marginRight: 15,
    marginBottom: 5,
  },
  volumenWrapper: {
    width: 110,
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontFamily: "QuicksandMedium",
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    fontFamily: "QuicksandMedium",
  },
  image: {
    width: 135,
    height: 175,
  },
  label: {
    color: "white",
    marginBottom: 5,
    fontSize: 20,
    fontFamily: "QuicksandMedium",
  },
  input: {
    width: 70,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    color: "white",
    marginBottom: 10,
    fontFamily: "QuicksandBold",
  },
  anzahlWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 9,
    paddingHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontFamily: "QuicksandBold",
  },
});
