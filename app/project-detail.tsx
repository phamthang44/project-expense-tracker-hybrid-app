import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import ExpenseCard from "@/components/expenses/ExpenseCard";
import { type Expense, formatDate } from "@/constants/mock-data";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProjects } from "@/hooks/use-projects";

// ── Component ────────────────────────────────────────────────────────────────

export default function ProjectDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { projects, loading } = useProjects();

  const project = useMemo(
    () => projects.find((p) => String(p.projectId) === projectId),
    [projects, projectId],
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        <View style={styles.centered}>
          <MaterialIcons name="error-outline" size={48} color={colors.subtext} />
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Project not found
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: PRIMARY, fontWeight: "600", marginTop: 8 }}>
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const remaining = project.budget - project.totalExpenses;
  const progress =
    project.budget > 0
      ? Math.min(project.totalExpenses / project.budget, 1)
      : 0;
  const isOverBudget = remaining < 0;

  function handleAddExpense() {
    router.push({
      pathname: "/add-expense",
      params: {
        projectId: String(project!.projectId),
        projectName: project!.projectName,
        projectCode: project!.projectCode,
      },
    });
  }

  const renderExpense = ({ item }: { item: Expense }) => (
    <ExpenseCard
      expense={item}
      projectId={project!.projectId}
      projectName={project!.projectName}
      projectCode={project!.projectCode}
      currency={project!.currency}
      colors={colors}
    />
  );

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[styles.headerTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {project.projectName}
          </Text>
          <Text style={[styles.headerSub, { color: colors.subtext }]}>
            {project.projectCode} • {project.status}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={project.expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpense}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ── Budget Summary Card ─────────────────────────────────── */}
            <View
              style={[styles.summaryCard, { backgroundColor: colors.surface }]}
            >
              {/* Top row: Budget / Expenses / Remaining */}
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                    Budget
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>
                    {project.currency}{" "}
                    {project.budget.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                    Spent
                  </Text>
                  <Text style={[styles.summaryValue, { color: PRIMARY }]}>
                    {project.currency}{" "}
                    {project.totalExpenses.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                    Remaining
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: isOverBudget ? "#ef4444" : "#059669" },
                    ]}
                  >
                    {project.currency}{" "}
                    {Math.abs(remaining).toLocaleString()}
                    {isOverBudget ? " over" : ""}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor: isOverBudget ? "#ef4444" : PRIMARY,
                    },
                  ]}
                />
              </View>

              {/* Project info row */}
              <View style={styles.infoRow}>
                <View style={styles.infoChip}>
                  <MaterialIcons
                    name="calendar-today"
                    size={13}
                    color={colors.subtext}
                  />
                  <Text style={[styles.infoText, { color: colors.subtext }]}>
                    {formatDate(project.startDate)} –{" "}
                    {formatDate(project.endDate)}
                  </Text>
                </View>
                <View style={styles.infoChip}>
                  <MaterialIcons
                    name="person"
                    size={13}
                    color={colors.subtext}
                  />
                  <Text style={[styles.infoText, { color: colors.subtext }]}>
                    {project.manager}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── Section title ────────────────────────────────────────── */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Expenses
              </Text>
              <Text style={[styles.sectionCount, { color: colors.subtext }]}>
                {project.expenses.length} item
                {project.expenses.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="receipt-long"
              size={48}
              color={colors.subtext}
            />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No expenses yet
            </Text>
            <TouchableOpacity onPress={handleAddExpense}>
              <Text
                style={{
                  color: PRIMARY,
                  fontSize: 14,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Add the first expense
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ── FAB ───────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddExpense}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerSub: { fontSize: 12, marginTop: 2 },
  headerRight: { width: 32 },

  /* List */
  listContent: { padding: 16, paddingBottom: 100 },

  /* Summary card */
  summaryCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: "700" },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e7eb",
    marginBottom: 14,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: { fontSize: 12 },

  /* Section */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  sectionCount: { fontSize: 12, fontWeight: "500" },

  /* Empty */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyText: { fontSize: 15, textAlign: "center" },

  /* FAB */
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
