import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
      </View>

      {/* Placeholder */}
      <View style={styles.placeholder}>
        <View style={[styles.iconCircle, { backgroundColor: `${PRIMARY}15` }]}>
          <MaterialIcons name="settings" size={40} color={PRIMARY} />
        </View>
        <Text style={[styles.comingSoonTitle, { color: colors.text }]}>
          Settings
        </Text>
        <Text style={[styles.comingSoonSub, { color: colors.subtext }]}>
          User preferences and app configuration will be{"\n"}available in a
          future update.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: Platform.OS === "android" ? 20 : 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  comingSoonSub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});
