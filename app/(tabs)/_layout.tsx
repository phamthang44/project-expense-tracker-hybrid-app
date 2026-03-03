import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

/** Active tab icon wrapped in a tinted pill */
function TabIcon({
  name,
  color,
  focused,
}: {
  name: any;
  color: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: focused ? `${PRIMARY}15` : "transparent",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons name={name} size={24} color={color} />
    </View>
  );
}

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
            <TabIcon
              name={focused ? "folder" : "folder-open"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "favorite" : "favorite-border"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
