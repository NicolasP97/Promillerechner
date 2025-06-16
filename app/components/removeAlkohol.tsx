import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type RemoveAlkoholProps = {
  onRemove: () => void;
  removeAllDrinkEvents: () => void;
};

export default function RemoveAlkohol({
  onRemove,
  removeAllDrinkEvents,
}: RemoveAlkoholProps) {
  return (
    <View style={styles.trashIconWrapper}>
      <TouchableOpacity
        onPress={() => {
          onRemove();
          removeAllDrinkEvents();
        }}
        style={styles.button}
      >
        <Ionicons name="trash-outline" size={24} color="cyan" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  trashIconWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  button: {
    paddingHorizontal: 10,
  },
});
