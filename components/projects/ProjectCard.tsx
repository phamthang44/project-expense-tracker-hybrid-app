import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  type Project,
  formatDate,
  getStatusVisuals,
} from "@/constants/mock-data";
import type { ThemeColors } from "@/constants/types";

interface ProjectCardProps {
  project: Project;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  colors: ThemeColors;
}

export default function ProjectCard({
  project,
  isFavorite,
  onToggleFavorite,
  colors,
}: ProjectCardProps) {
  const vis = getStatusVisuals(project.status);

  function handlePress() {
    router.push({
      pathname: "/project-detail",
      params: { projectId: String(project.projectId) },
    });
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconTile, { backgroundColor: vis.iconBgColor }]}>
        <MaterialIcons
          name={vis.iconName as any}
          size={24}
          color={vis.iconColor}
        />
      </View>

      <View style={styles.cardBody}>
        <Text
          style={[styles.cardTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {project.projectName}
        </Text>
        <Text style={[styles.cardMeta, { color: colors.subtext }]}>
          {project.projectCode} • {project.status} •{" "}
          {formatDate(project.startDate)}
        </Text>
        {project.expenses.length > 0 && (
          <Text style={[styles.expenseCount, { color: colors.subtext }]}>
            {project.expenses.length} expense
            {project.expenses.length !== 1 ? "s" : ""} •{" "}
            {project.currency} {project.totalExpenses.toLocaleString()}
          </Text>
        )}
      </View>

      {/* Favorite toggle */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite(project.id);
        }}
        style={styles.starBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons
          name={isFavorite ? "star" : "star-border"}
          size={24}
          color={isFavorite ? "#f59e0b" : colors.icon}
        />
      </TouchableOpacity>

      <MaterialIcons
        name="chevron-right"
        size={22}
        color={colors.icon}
        style={{ marginLeft: 2 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardMeta: { fontSize: 13 },
  expenseCount: { fontSize: 12, marginTop: 3 },
  starBtn: { padding: 4, marginLeft: 6 },
});
