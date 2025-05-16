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

type RemoveAlkoholProps = {
  onRemove: () => void;
};

export default function RemoveAlkohol({ onRemove }: RemoveAlkoholProps) {
  return (
    <View style={styles.trashIconWrapper}>
      <TouchableOpacity onPress={onRemove}>
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
});
