// components/DisclaimerModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  visible: boolean;
  onAccept: () => void;
}

export default function DisclaimerModal({ visible, onAccept }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Hinweis zur Nutzung</Text>
          <Text style={styles.text}>
            Diese App berechnet Promillewerte lediglich als grobe Orientierung.
            Die Ergebnisse sind nicht rechtlich bindend und keine Garantie für
            Fahrtüchtigkeit.
          </Text>
          <Pressable style={styles.button} onPress={onAccept}>
            <Text style={styles.buttonText}>Verstanden</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    color: "white",
    fontFamily: "QuicksandBold",
  },
  text: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    fontFamily: "QuicksandMedium",
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    fontFamily: "QuicksandBold",
  },
});
