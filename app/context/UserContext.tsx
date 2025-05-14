import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Gender = "male" | "female" | null;

type UserContextType = {
  gender: Gender;
  setGender: (gender: Gender) => void;
  massKG: number;
  setMassKG: (mass: number) => void;
};

// 1. Context erstellen
const UserContext = createContext<UserContextType | undefined>(undefined);

// 2. Provider-Komponente
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [gender, setGenderState] = useState<Gender>(null);
  const [massKG, setMassKGState] = useState<number>(0); // Standardgewicht

  // Setter für Gender (inkl. Speicherung)
  const setGender = async (selected: Gender) => {
    setGenderState(selected);
    try {
      await AsyncStorage.setItem("@gender", selected || "");
    } catch (error) {
      console.error("Fehler beim Speichern von Gender:", error);
    }
  };

  // Setter für Gewicht (inkl. Speicherung)
  const setMassKG = async (value: number) => {
    setMassKGState(value);
    try {
      await AsyncStorage.setItem("@massKG", value.toString());
    } catch (error) {
      console.error("Fehler beim Speichern von Gewicht:", error);
    }
  };

  // Einmaliges Laden beim App-Start
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedGender = await AsyncStorage.getItem("@gender");
        if (storedGender === "male" || storedGender === "female") {
          setGenderState(storedGender);
        }

        const storedMass = await AsyncStorage.getItem("@massKG");
        if (storedMass !== null) {
          const parsed = parseFloat(storedMass);
          if (!isNaN(parsed)) {
            setMassKGState(parsed);
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden von Userdaten:", error);
      }
    };
    loadData();
  }, []);

  return (
    <UserContext.Provider value={{ gender, setGender, massKG, setMassKG }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom Hook für Zugriff
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser muss innerhalb eines UserProviders verwendet werden."
    );
  }
  return context;
};

export default UserProvider;
