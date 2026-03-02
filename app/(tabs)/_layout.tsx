import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "folder" : "folder-open"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "favorite" : "favorite-border"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
