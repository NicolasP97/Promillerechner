import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UserProvider from "../context/UserContext";

export default function RootLayout() {
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
            height: 70, // muss ca 60-70 sein damit labels angezeigt werden!!
            marginBottom: -17,
            backgroundColor: "#25292e",
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
                size={23}
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
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
