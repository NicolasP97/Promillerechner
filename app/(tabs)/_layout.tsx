import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UserProvider from "../context/UserContext";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/montserrat-regular.ttf"),
    Quicksand: require("../../assets/fonts/quicksand-regular.ttf"),
    QuicksandMedium: require("../../assets/fonts/quicksand-medium.ttf"),
    QuicksandBold: require("../../assets/fonts/quicksand-bold.ttf"),
    Lato: require("../../assets/fonts/lato-regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00c3ef" />
      </View>
    );
  }
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true, // ← das erzwingt Labels auf Android
          tabBarActiveTintColor: "rgb(0, 195, 239)",
          headerStyle: {
            backgroundColor: "#25292e",
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
            height: 65, // Genug height und paddingTop/paddingBottom wichtig für normal große Touchflächen der Tabs!!
            paddingBottom: 1,
            paddingTop: 3,
            backgroundColor: "#25292e",
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: "QuicksandMedium",
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabel: "Home", // 👈 wichtig!
            headerShown: false, // <-- Das hier blendet die obere Leiste aus!
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            title: "Nutzer",
            tabBarLabel: "Nutzer", // 👈 wichtig!
            headerShown: false, // <-- Das hier blendet die obere Leiste aus!
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
