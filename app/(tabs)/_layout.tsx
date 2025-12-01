import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserProvider, { useUser } from "../context/UserContext";

// 🔥 Trick: Extra Wrapper, damit wir den Context im Layout nutzen können
function TabsWithUserBadge() {
  const { massKG } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: "rgb(0, 195, 239)",
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 8,
          paddingTop: 3,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: "QuicksandMedium",
          marginTop: 2,
        },
        tabBarItemStyle: { paddingVertical: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={focused ? 27 : 24}
              style={{ marginBottom: focused ? -2 : 0 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          title: "Nutzer",
          tabBarLabel: "Nutzer",
          headerShown: false,
          // 🔥 Dynamischer Badge abhängig vom Gewicht
          tabBarBadge: massKG > 0 ? undefined : "!",
          tabBarBadgeStyle: {
            backgroundColor: "cyan",
            fontFamily: "QuicksandBold",
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={focused ? 33 : 30}
              style={{ marginBottom: focused ? -2 : 0 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

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
      <TabsWithUserBadge />
    </UserProvider>
  );
}
