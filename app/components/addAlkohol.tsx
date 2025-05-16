import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

type AddAlkoholArtProps = {
  onAdd: (art: string) => void; // z. B. "Wein", "Schnaps"
};

export default function AddAlkoholArt({ onAdd }: AddAlkoholArtProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (art: string) => {
    onAdd(art); // Callback in index.tsx
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Add Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={52} color="cyan" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alkoholart hinzufügen</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSelect("Bier")}
            >
              <Text style={styles.modalButtonText}>🍺 Bier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSelect("Wein")}
            >
              <Text style={styles.modalButtonText}>🍷 Wein</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSelect("Schnaps")}
            >
              <Text style={styles.modalButtonText}>🥃 Schnaps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSelect("Aperol Spritz")}
            >
              <Text style={styles.modalButtonText}>🍹Aperol Spritz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSelect("Cocktail")}
            >
              <Text style={styles.modalButtonText}>🍸Cocktail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCancel}
            >
              <Text style={styles.cancelText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    color: "white",
    marginBottom: 20,
    fontFamily: "QuicksandBold",
  },
  modalButton: {
    backgroundColor: "#00c3ef",
    paddingVertical: 12,
    borderRadius: 10,
    width: "65%",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    // iOS Shadow
    shadowColor: "cyan",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Android Shadow
    elevation: 6,
  },
  modalButtonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "QuicksandBold",
  },
  modalCancel: {
    width: "100%",
    marginTop: 10,
    padding: 5,
    alignItems: "center",
  },
  cancelText: {
    color: "#aaa",
    fontSize: 16,
    fontFamily: "Quicksand",
  },
});
