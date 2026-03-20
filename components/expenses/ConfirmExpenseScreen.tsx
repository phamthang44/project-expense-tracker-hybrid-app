import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { AddExpenseFormData } from "@/components/expenses/AddExpenseForm";
import { PRIMARY } from "@/constants/theme";
import type { ThemeColors } from "@/constants/types";

// ── Props ────────────────────────────────────────────────────────────────────

interface ConfirmExpenseScreenProps {
  data: AddExpenseFormData;
  projectName: string;
  projectCode: string;
  isEditing: boolean;
  colors: ThemeColors;
  onGoBack: () => void;
  onConfirm: () => Promise<void>;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ConfirmExpenseScreen({
  data,
  projectName,
  projectCode,
  isEditing,
  colors,
  onGoBack,
  onConfirm,
}: ConfirmExpenseScreenProps) {
  // ── Strict 1-click guard ────────────────────────────────────────────────
  const hasConfirmedRef = useRef(false);
  const [saving, setSaving] = React.useState(false);

  async function handleConfirm() {
    // Absolutely prevent any second click
    if (hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;
    setSaving(true);

    try {
      await onConfirm();
    } catch {
      // On error, allow retry
      hasConfirmedRef.current = false;
      setSaving(false);
    }
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // ── Render helpers ──────────────────────────────────────────────────────

  function renderRow(label: string, value: string, icon?: string) {
    return (
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <View style={styles.rowLeft}>
          {icon && (
            <MaterialIcons
              name={icon as any}
              size={18}
              color={colors.subtext}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[styles.rowLabel, { color: colors.subtext }]}>
            {label}
          </Text>
        </View>
        <Text
          style={[styles.rowValue, { color: colors.text }]}
          numberOfLines={2}
        >
          {value || "—"}
        </Text>
      </View>
    );
  }

  function renderSection(title: string) {
    return (
      <Text style={[styles.sectionTitle, { color: PRIMARY }]}>{title}</Text>
    );
  }

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header badge */}
      <View style={[styles.badge, { backgroundColor: `${PRIMARY}12` }]}>
        <MaterialIcons name="preview" size={20} color={PRIMARY} />
        <Text style={[styles.badgeText, { color: PRIMARY }]}>
          Review Before {isEditing ? "Saving" : "Adding"}
        </Text>
      </View>

      {/* Project info */}
      <View style={[styles.projectRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialIcons name="folder" size={20} color={PRIMARY} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.projectName, { color: colors.text }]}>
            {projectName}
          </Text>
          <Text style={[styles.projectCode, { color: colors.subtext }]}>
            {projectCode}
          </Text>
        </View>
      </View>

      {/* ── Data review card ──────────────────────────────────────────── */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {renderSection("EXPENSE INFO")}
        {renderRow("Expense ID", data.expenseId, "tag")}
        {renderRow("Date", formatDate(data.date), "calendar-today")}
        {renderRow("Type", data.type, "category")}

        {renderSection("AMOUNT")}
        {renderRow("Amount", `${data.currency} ${data.amount}`, "attach-money")}

        {renderSection("PAYMENT")}
        {renderRow("Method", data.paymentMethod, "payment")}
        {renderRow("Status", data.paymentStatus, "flag")}

        {renderSection("DETAILS")}
        {renderRow("Claimant", data.claimant, "person")}
        {renderRow("Location", data.location || "Not specified", "location-on")}
        {renderRow("Description", data.description || "Not specified", "description")}
      </View>

      {/* ── Action buttons ────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.backBtn, { borderColor: colors.border }]}
          onPress={onGoBack}
          activeOpacity={0.7}
          disabled={saving}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          <Text style={[styles.backBtnText, { color: colors.text }]}>
            Back to Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialIcons
                name={isEditing ? "save" : "check-circle"}
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.confirmBtnText}>
                {isEditing ? "Save Changes" : "Confirm & Add"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  projectName: {
    fontSize: 15,
    fontWeight: "700",
  },
  projectCode: {
    fontSize: 12,
    marginTop: 2,
  },

  /* Review card */
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },

  /* Action buttons */
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  backBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
