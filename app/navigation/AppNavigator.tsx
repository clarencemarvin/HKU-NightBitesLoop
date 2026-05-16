import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProviderScreen from "../screens/ProviderScreen";
import ImpactScreen from "../screens/ImpactScreen";

const Tab = createBottomTabNavigator();

const TEAL = "#0D7B6A";

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: TEAL,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Discover") iconName = "compass-outline";
          if (route.name === "Provider") iconName = "storefront-outline";
          if (route.name === "Impact") iconName = "leaf-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={HomeScreen} />
      <Tab.Screen name="Provider" component={ProviderScreen} />
      <Tab.Screen name="Impact" component={ImpactScreen} />
    </Tab.Navigator>
  );
}
