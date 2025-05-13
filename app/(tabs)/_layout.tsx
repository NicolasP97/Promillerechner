import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "rgb(0, 195, 239)",
          headerStyle: {
            backgroundColor: "#25292e",
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#25292e",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
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
