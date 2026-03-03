import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PRIMARY } from "@/constants/theme";
import type { ThemeColors } from "@/constants/types";

// ── Props ────────────────────────────────────────────────────────────────────

export interface AppliedFilters {
  status: string | null;
  manager: string | null;
  from: string; // ISO "YYYY-MM-DD"
  to: string;
}

interface SearchHeaderProps {
  colors: ThemeColors;
  nameQuery: string;
  onNameQueryChange: (v: string) => void;
  activeFilterCount: number;
  onOpenSheet: () => void;
  applied: AppliedFilters;
  onRemoveFilter: (key: "status" | "manager" | "from" | "to") => void;
}

// ── Helper ───────────────────────────────────────────────────────────────────

/** Format an ISO date string for display in a pill. */
function formatISOForPill(iso: string): string {
  if (!iso) return "…";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SearchHeader({
  colors,
  nameQuery,
  onNameQueryChange,
  activeFilterCount,
  onOpenSheet,
  applied,
  onRemoveFilter,
}: SearchHeaderProps) {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      {/* Title row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="cloud" size={26} color={PRIMARY} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Cloud Projects
          </Text>
        </View>
        <TouchableOpacity onPress={onOpenSheet} style={styles.iconBtn}>
          <MaterialIcons name="tune" size={24} color={PRIMARY} />
          {activeFilterCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search row — full width */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <MaterialIcons
            name="search"
            size={20}
            color={colors.subtext}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name or date"
            placeholderTextColor={colors.subtext}
            value={nameQuery}
            onChangeText={onNameQueryChange}
            returnKeyType="search"
          />
          {nameQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onNameQueryChange("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="close" size={18} color={colors.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick-filter pills (always visible) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickPillRow}
      >
        <View style={[styles.quickPill, styles.quickPillActive]}>
          <Text style={styles.quickPillActiveText}>All Projects</Text>
        </View>
        <View style={[styles.quickPill, { backgroundColor: colors.card }]}>
          <Text style={[styles.quickPillText, { color: colors.subtext }]}>
            Recent
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={colors.subtext}
            style={{ marginLeft: 2 }}
          />
        </View>
        <View style={[styles.quickPill, { backgroundColor: colors.card }]}>
          <Text style={[styles.quickPillText, { color: colors.subtext }]}>
            Updated
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={colors.subtext}
            style={{ marginLeft: 2 }}
          />
        </View>
      </ScrollView>

      {/* Active advanced-filter pills */}
      {activeFilterCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {(applied.from || applied.to) && (
            <View style={[styles.pill, { backgroundColor: PRIMARY }]}>
              <MaterialIcons
                name="event"
                size={14}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.pillText}>
                {formatISOForPill(applied.from)}
                {" — "}
                {formatISOForPill(applied.to)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onRemoveFilter("from");
                  onRemoveFilter("to");
                }}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <MaterialIcons
                  name="close"
                  size={14}
                  color="#fff"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
          )}

          {applied.status && (
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialIcons
                name="flag"
                size={14}
                color={colors.subtext}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.pillText, { color: colors.text }]}>
                {applied.status}
              </Text>
              <TouchableOpacity
                onPress={() => onRemoveFilter("status")}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <MaterialIcons
                  name="close"
                  size={14}
                  color={colors.subtext}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
          )}

          {applied.manager && (
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialIcons
                name="person"
                size={14}
                color={colors.subtext}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.pillText, { color: colors.text }]}>
                {applied.manager}
              </Text>
              <TouchableOpacity
                onPress={() => onRemoveFilter("manager")}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <MaterialIcons
                  name="close"
                  size={14}
                  color={colors.subtext}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  countBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  quickPillRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  quickPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickPillActive: {
    backgroundColor: PRIMARY,
  },
  quickPillActiveText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  quickPillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  pillRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
