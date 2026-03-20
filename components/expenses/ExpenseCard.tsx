import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { type Expense, formatDate } from "@/constants/mock-data";
import { PRIMARY } from "@/constants/theme";
import type { ThemeColors } from "@/constants/types";

// ── Icon mapping for expense types ───────────────────────────────────────────

function getTypeIcon(type: string): string {
  switch (type?.toLowerCase()) {
    case "food & entertainment":
      return "restaurant";
    case "travel":
      return "flight";
    case "accommodation":
      return "hotel";
    case "equipment":
      return "build";
    case "software":
      return "computer";
    case "labour":
      return "engineering";
    case "materials":
      return "inventory";
    default:
      return "receipt-long";
  }
}

function getTypeColor(type: string): { bg: string; fg: string } {
  switch (type?.toLowerCase()) {
    case "food & entertainment":
      return { bg: "#fef3c7", fg: "#d97706" };
    case "travel":
      return { bg: "#fce7f3", fg: "#db2777" };
    case "accommodation":
      return { bg: "#ede9fe", fg: "#7c3aed" };
    case "equipment":
      return { bg: "#dbeafe", fg: "#2563eb" };
    case "software":
      return { bg: "#cffafe", fg: "#0891b2" };
    case "labour":
      return { bg: "#fee2e2", fg: "#dc2626" };
    case "materials":
      return { bg: "#ffedd5", fg: "#ea580c" };
    default:
      return { bg: "#e5e7eb", fg: "#6b7280" };
  }
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ExpenseCardProps {
  expense: Expense;
  projectId: number;
  projectName: string;
  projectCode: string;
  currency: string;
  colors: ThemeColors;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ExpenseCard({
  expense,
  projectId,
  projectName,
  projectCode,
  currency,
  colors,
}: ExpenseCardProps) {
  const icon = getTypeIcon(expense.type);
  const typeColor = getTypeColor(expense.type);

  function handleEdit() {
    router.push({
      pathname: "/add-expense",
      params: {
        projectId: String(projectId),
        projectName,
        projectCode,
        // Pass existing expense data for edit mode
        editDocId: expense.id,
        editExpenseId: String(expense.expenseId),
        editAmount: String(expense.amount),
        editCurrency: expense.currency || currency,
        editDate: expense.date,
        editType: expense.type,
        editClaimant: expense.claimant,
        editDescription: expense.description ?? "",
        editLocation: expense.location ?? "",
        editPaymentMethod: expense.paymentMethod,
        editPaymentStatus: expense.paymentStatus,
      },
    });
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handleEdit}
      activeOpacity={0.7}
    >
      {/* Type icon */}
      <View style={[styles.iconTile, { backgroundColor: typeColor.bg }]}>
        <MaterialIcons name={icon as any} size={22} color={typeColor.fg} />
      </View>

      {/* Info */}
      <View style={styles.body}>
        <Text
          style={[styles.typeName, { color: colors.text }]}
          numberOfLines={1}
        >
          {expense.type || "Expense"}
        </Text>
        <Text style={[styles.meta, { color: colors.subtext }]}>
          {expense.claimant} • {formatDate(expense.date)}
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.amountCol}>
        <Text style={[styles.amount, { color: colors.text }]}>
          {expense.currency ?? currency} {expense.amount.toLocaleString()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                expense.paymentStatus?.toLowerCase() === "paid"
                  ? "#d1fae5"
                  : expense.paymentStatus?.toLowerCase() === "approved"
                    ? "#dbeafe"
                    : "#fef3c7",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  expense.paymentStatus?.toLowerCase() === "paid"
                    ? "#059669"
                    : expense.paymentStatus?.toLowerCase() === "approved"
                      ? "#2563eb"
                      : "#d97706",
              },
            ]}
          >
            {expense.paymentStatus || "Pending"}
          </Text>
        </View>
      </View>

      {/* Edit icon */}
      <MaterialIcons
        name="chevron-right"
        size={20}
        color={colors.icon}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  typeName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
  },
  amountCol: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  chevron: {
    marginLeft: 6,
  },
});
