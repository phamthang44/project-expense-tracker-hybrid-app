import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
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

// ── Dropdown / chip options ──────────────────────────────────────────────────

const CURRENCIES = ["USD", "EUR", "GBP", "VND", "JPY", "AUD", "CAD"];

const EXPENSE_TYPES = [
  "Travel",
  "Labour",
  "Equipment",
  "Food & Entertainment",
  "Accommodation",
  "Materials",
  "Software",
];

const PAYMENT_METHODS = ["Cash", "Credit Card", "Bank Transfer", "Cheque"];

const PAYMENT_STATUSES = ["Paid", "Pending", "Reimbursed"];

// ── Props ────────────────────────────────────────────────────────────────────

export interface AddExpenseFormData {
  expenseId: string;
  amount: string;
  currency: string;
  date: Date;
  type: string;
  claimant: string;
  description: string;
  location: string;
  paymentMethod: string;
  paymentStatus: string;
}

/** Optional initial data for pre-filling the form in edit mode. */
export interface ExpenseInitialData {
  expenseId?: string;
  amount: string;
  currency: string;
  /** DD/MM/YYYY */
  date: string;
  type: string;
  claimant: string;
  description: string;
  location: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface AddExpenseFormProps {
  projectName: string;
  colors: ThemeColors;
  isDark: boolean;
  submitting: boolean;
  /** When true, form is in edit mode. */
  isEditing?: boolean;
  /** Pre-fill values for edit mode. */
  initialData?: ExpenseInitialData;
  onSubmit: (data: AddExpenseFormData) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseDDMMYYYY(str: string): Date {
  if (!str) return new Date();
  const [dd, mm, yyyy] = str.split("/");
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(d.getTime()) ? new Date() : d;
}

function generateExpenseId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `EXP-${num}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AddExpenseForm({
  projectName,
  colors,
  isDark,
  submitting,
  isEditing = false,
  initialData,
  onSubmit,
}: AddExpenseFormProps) {
  // Auto-generated expense ID (read-only)
  const expenseId = useMemo(
    () => initialData?.expenseId || generateExpenseId(),
    [initialData?.expenseId],
  );

  // form state (pre-filled if editing)
  const [amount, setAmount] = useState(initialData?.amount ?? "");
  const [currency, setCurrency] = useState(initialData?.currency ?? "USD");
  const [date, setDate] = useState(
    initialData?.date ? parseDDMMYYYY(initialData.date) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState(initialData?.type ?? "");
  const [claimant, setClaimant] = useState(initialData?.claimant ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.paymentMethod ?? "Cash",
  );
  const [paymentStatus, setPaymentStatus] = useState(
    initialData?.paymentStatus ?? "Pending",
  );

  // validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // dropdown open state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      e.amount = "Enter a valid amount > 0";
    }
    if (!type) e.type = "Select an expense type";
    if (!claimant.trim()) e.claimant = "Claimant name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      expenseId,
      amount,
      currency,
      date,
      type,
      claimant: claimant.trim(),
      description: description.trim(),
      location: location.trim(),
      paymentMethod,
      paymentStatus,
    });
  }

  function onDateChange(_event: DateTimePickerEvent, selectedDate?: Date) {
    setShowDatePicker(Platform.OS === "ios"); // iOS keeps it open
    if (selectedDate) setDate(selectedDate);
  }

  const formatDisplayDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // ── Reusable sub-components ────────────────────────────────────────────────

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.card,
      color: colors.text,
      borderColor: colors.border,
    },
  ];

  function renderLabel(label: string, required = false) {
    return (
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={{ color: "#ef4444" }}> *</Text>}
      </Text>
    );
  }

  function renderError(key: string) {
    return errors[key] ? (
      <Text style={styles.errorText}>{errors[key]}</Text>
    ) : null;
  }

  function renderDropdown(
    id: string,
    value: string,
    options: string[],
    onChange: (v: string) => void,
  ) {
    const isOpen = openDropdown === id;
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.input,
            styles.dropdownTrigger,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setOpenDropdown(isOpen ? null : id)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: value ? colors.text : colors.subtext,
              flex: 1,
            }}
          >
            {value || "Select…"}
          </Text>
          <MaterialIcons
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={22}
            color={colors.icon}
          />
        </TouchableOpacity>

        {isOpen && (
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.dropdownItem,
                  opt === value && {
                    backgroundColor: `${PRIMARY}18`,
                  },
                ]}
                onPress={() => {
                  onChange(opt);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={{
                    color: opt === value ? PRIMARY : colors.text,
                    fontWeight: opt === value ? "700" : "400",
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  /** Chip-style selector (used for Payment Method, Payment Status). */
  function renderChipSelector(
    options: string[],
    selected: string,
    onChange: (v: string) => void,
    columns = 2,
  ) {
    return (
      <View style={[styles.chipGrid, columns === 3 && { gap: 8 }]}>
        {options.map((opt) => {
          const isActive = opt === selected;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.chip,
                {
                  borderColor: isActive ? PRIMARY : colors.border,
                  backgroundColor: isActive ? `${PRIMARY}12` : colors.card,
                  flex: columns === 2 ? 1 : undefined,
                  minWidth: columns === 3 ? "28%" : undefined,
                },
              ]}
              onPress={() => onChange(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? PRIMARY : colors.text },
                  isActive && { fontWeight: "700" },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Expense ID (auto-generated, read-only) ───────────────────── */}
      {renderLabel("Expense ID")}
      <View style={[styles.input, styles.readOnlyRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ color: colors.subtext, fontSize: 15 }}>{expenseId}</Text>
        <MaterialIcons name="lock" size={16} color={colors.subtext} />
      </View>

      {/* ── Date of Expense ───────────────────────────────────────────── */}
      {renderLabel("Date of Expense", true)}
      <TouchableOpacity
        style={[
          styles.input,
          styles.dropdownTrigger,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: colors.text, fontSize: 15 }}>{formatDisplayDate(date)}</Text>
        <MaterialIcons name="calendar-today" size={20} color={colors.icon} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          themeVariant={isDark ? "dark" : "light"}
        />
      )}

      {/* ── Amount & Currency ─────────────────────────────────────────── */}
      <View style={styles.row}>
        <View style={{ flex: 2 }}>
          {renderLabel("Amount", true)}
          <TextInput
            style={[
              ...inputStyle,
              errors.amount ? styles.inputError : undefined,
            ]}
            placeholder="0.00"
            placeholderTextColor={colors.subtext}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {renderError("amount")}
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          {renderLabel("Currency", true)}
          {renderDropdown("currency", currency, CURRENCIES, setCurrency)}
        </View>
      </View>

      {/* ── Type of Expense ───────────────────────────────────────────── */}
      {renderLabel("Type of Expense", true)}
      {renderDropdown("type", type, EXPENSE_TYPES, setType)}
      {renderError("type")}

      {/* ── Payment Method (chip selector) ────────────────────────────── */}
      {renderLabel("Payment Method", true)}
      {renderChipSelector(PAYMENT_METHODS, paymentMethod, setPaymentMethod, 2)}

      {/* ── Claimant ──────────────────────────────────────────────────── */}
      {renderLabel("Claimant", true)}
      <View style={[styles.input, styles.iconInputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialIcons name="person" size={20} color={colors.subtext} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.iconInputText, { color: colors.text }]}
          placeholder="Full name"
          placeholderTextColor={colors.subtext}
          value={claimant}
          onChangeText={setClaimant}
        />
      </View>
      {renderError("claimant")}

      {/* ── Payment Status (chip selector) ────────────────────────────── */}
      {renderLabel("Payment Status", true)}
      {renderChipSelector(PAYMENT_STATUSES, paymentStatus, setPaymentStatus, 3)}

      {/* ── Location (optional) ───────────────────────────────────────── */}
      {renderLabel("Location (Optional)")}
      <View style={[styles.input, styles.iconInputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialIcons name="location-on" size={20} color={colors.subtext} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.iconInputText, { color: colors.text }]}
          placeholder="City, Office, Site…"
          placeholderTextColor={colors.subtext}
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* ── Description (optional) ────────────────────────────────────── */}
      {renderLabel("Description (Optional)")}
      <TextInput
        style={[...inputStyle, styles.textArea]}
        placeholder="Brief description…"
        placeholderTextColor={colors.subtext}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <MaterialIcons
              name="preview"
              size={22}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.submitBtnText}>
              Continue to Review
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 4,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  readOnlyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconInputText: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: -2,
    marginBottom: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },

  /* Chip selector */
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },

  /* Submit */
  submitBtn: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 28,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
