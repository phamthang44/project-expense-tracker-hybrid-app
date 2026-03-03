import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  type Project,
  formatDate,
  getStatusVisuals,
} from "@/constants/mock-data";
import { PRIMARY } from "@/constants/theme";
import type { ThemeColors } from "@/constants/types";

// ── Props ────────────────────────────────────────────────────────────────────

interface FavoriteItemProps {
  project: Project;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  colors: ThemeColors;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function FavoriteItem({
  project,
  isFavorite,
  onToggleFavorite,
  colors,
}: FavoriteItemProps) {
  const vis = getStatusVisuals(project.status);

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      {/* Status icon */}
      <View style={styles.thumbContainer}>
        <View
          style={[
            styles.thumb,
            styles.thumbFallback,
            { backgroundColor: vis.iconBgColor },
          ]}
        >
          <MaterialIcons
            name={vis.iconName as any}
            size={28}
            color={vis.iconColor}
          />
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {project.projectName}
        </Text>
        <Text style={[styles.meta, { color: colors.subtext }]}>
          {project.projectCode} • {project.status} •{" "}
          {formatDate(project.startDate)}
        </Text>
        {project.priority === "High" && (
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: "#d1fae5" }]}>
              <Text style={[styles.badgeText, { color: "#059669" }]}>
                PRIORITY
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Heart button */}
      <TouchableOpacity
        onPress={() => onToggleFavorite(project.id)}
        style={styles.heartBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons
          name={isFavorite ? "favorite" : "favorite-border"}
          size={24}
          color={PRIMARY}
        />
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  thumbContainer: {
    marginRight: 14,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  thumbFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heartBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
