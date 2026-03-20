import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddExpenseForm, {
  type AddExpenseFormData,
  type ExpenseInitialData,
} from "@/components/expenses/AddExpenseForm";
import ConfirmExpenseScreen from "@/components/expenses/ConfirmExpenseScreen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { addExpense, updateExpense } from "@/hooks/use-add-expense";

// ── Screen ───────────────────────────────────────────────────────────────────

type Step = "form" | "confirm";

export default function AddExpenseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  // Route params
  const params = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    projectCode: string;
    // Edit-mode params (optional)
    editDocId?: string;
    editExpenseId?: string;
    editAmount?: string;
    editCurrency?: string;
    editDate?: string;
    editType?: string;
    editClaimant?: string;
    editDescription?: string;
    editLocation?: string;
    editPaymentMethod?: string;
    editPaymentStatus?: string;
  }>();

  const isEditing = !!params.editDocId;

  // Build initial data for edit mode
  const initialData = useMemo<ExpenseInitialData | undefined>(() => {
    if (!isEditing) return undefined;
    return {
      expenseId: params.editExpenseId ? `EXP-${params.editExpenseId}` : undefined,
      amount: params.editAmount ?? "",
      currency: params.editCurrency ?? "USD",
      date: params.editDate ?? "",
      type: params.editType ?? "",
      claimant: params.editClaimant ?? "",
      description: params.editDescription ?? "",
      location: params.editLocation ?? "",
      paymentMethod: params.editPaymentMethod ?? "Cash",
      paymentStatus: params.editPaymentStatus ?? "Pending",
    };
  }, [isEditing, params]);

  // ── Two-step flow ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<AddExpenseFormData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /** Format a Date as DD/MM/YYYY to match the admin app convention. */
  function toDDMMYYYY(d: Date): string {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  /** Step 1 → Step 2: form validated, go to confirmation. */
  function handleFormSubmit(data: AddExpenseFormData) {
    setFormData(data);
    setStep("confirm");
  }

  /** Step 2 → back to Step 1. */
  function handleGoBackToForm() {
    setStep("form");
  }

  /** Step 2: Confirm → write to Firestore → navigate back. */
  async function handleConfirmSave() {
    if (!formData) return;

    const payload = {
      projectId: Number(params.projectId),
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: toDDMMYYYY(formData.date),
      type: formData.type,
      claimant: formData.claimant,
      description: formData.description,
      location: formData.location,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
    };

    if (isEditing) {
      await updateExpense(params.editDocId!, payload);
    } else {
      await addExpense(payload);
    }

    // Navigate back to project detail
    router.back();
  }

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Custom header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            if (step === "confirm") {
              handleGoBackToForm();
            } else {
              router.back();
            }
          }}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={step === "confirm" ? "arrow-back" : "close"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {step === "confirm"
            ? "Review Expense"
            : isEditing
              ? "Edit Expense"
              : "Add New Expense"}
        </Text>

        <View style={styles.headerRight}>
          <Text style={[styles.headerCode, { color: colors.subtext }]}>
            {params.projectCode}
          </Text>
        </View>
      </View>

      {/* ── Step 1: Form ─────────────────────────────────────────────── */}
      {step === "form" && (
        <AddExpenseForm
          projectName={params.projectName ?? ""}
          colors={colors}
          isDark={isDark}
          submitting={submitting}
          isEditing={isEditing}
          initialData={initialData}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* ── Step 2: Confirmation ─────────────────────────────────────── */}
      {step === "confirm" && formData && (
        <ConfirmExpenseScreen
          data={formData}
          projectName={params.projectName ?? ""}
          projectCode={params.projectCode ?? ""}
          isEditing={isEditing}
          colors={colors}
          onGoBack={handleGoBackToForm}
          onConfirm={handleConfirmSave}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerRight: {
    minWidth: 32,
    alignItems: "flex-end",
  },
  headerCode: {
    fontSize: 12,
    fontWeight: "600",
  },
});
