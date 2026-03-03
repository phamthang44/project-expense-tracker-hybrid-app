import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors, PRIMARY } from "@/constants/theme";
import { useThemeContext, type ThemePreference } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: string }[] =
  [
    { value: "system", label: "System Default", icon: "smartphone" },
    { value: "light", label: "Light", icon: "light-mode" },
    { value: "dark", label: "Dark", icon: "dark-mode" },
  ];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { preference, setPreference } = useThemeContext();

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

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Appearance section ──────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          APPEARANCE
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {THEME_OPTIONS.map((opt, idx) => {
            const active = preference === opt.value;
            const isLast = idx === THEME_OPTIONS.length - 1;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.row,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
                activeOpacity={0.6}
                onPress={() => setPreference(opt.value)}
              >
                <View
                  style={[
                    styles.rowIconWrap,
                    {
                      backgroundColor: active ? `${PRIMARY}15` : colors.card,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={opt.icon as any}
                    size={20}
                    color={active ? PRIMARY : colors.icon}
                  />
                </View>

                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {opt.label}
                </Text>

                {active && (
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color={PRIMARY}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── About section ──────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          ABOUT
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.row,
              { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
          >
            <View
              style={[styles.rowIconWrap, { backgroundColor: colors.card }]}
            >
              <MaterialIcons
                name="info-outline"
                size={20}
                color={colors.icon}
              />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Version
            </Text>
            <Text style={[styles.rowValue, { color: colors.subtext }]}>
              1.0.0
            </Text>
          </View>

          <View style={styles.row}>
            <View
              style={[styles.rowIconWrap, { backgroundColor: colors.card }]}
            >
              <MaterialIcons name="school" size={20} color={colors.icon} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Course
            </Text>
            <Text style={[styles.rowValue, { color: colors.subtext }]}>
              COMP1786
            </Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
