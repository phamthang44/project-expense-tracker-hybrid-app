import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { formatDate } from "@/constants/mock-data";
import { PRIMARY } from "@/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/** Convert a Date to "DD/MM/YYYY" for formatDate display */
const toDDMMYYYY = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// ── Props ────────────────────────────────────────────────────────────────────

export interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  isDark: boolean;

  // Draft state
  draftStatus: string | null;
  setDraftStatus: (v: string | null) => void;
  draftManager: string | null;
  setDraftManager: (v: string | null) => void;
  draftFrom: Date | null;
  setDraftFrom: (v: Date | null) => void;
  draftTo: Date | null;
  setDraftTo: (v: Date | null) => void;

  // Picker visibility
  showFromPicker: boolean;
  setShowFromPicker: (v: boolean | ((prev: boolean) => boolean)) => void;
  showToPicker: boolean;
  setShowToPicker: (v: boolean | ((prev: boolean) => boolean)) => void;

  // Data for chips
  allStatuses: string[];
  allManagers: string[];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function FilterSheet({
  visible,
  onClose,
  onApply,
  onReset,
  isDark,
  draftStatus,
  setDraftStatus,
  draftManager,
  setDraftManager,
  draftFrom,
  setDraftFrom,
  draftTo,
  setDraftTo,
  showFromPicker,
  setShowFromPicker,
  showToPicker,
  setShowToPicker,
  allStatuses,
  allManagers,
}: FilterSheetProps) {
  const sheetBg = isDark ? "#1e293b" : "#ffffff";
  const sheetText = isDark ? "#f1f5f9" : "#0f172a";
  const sheetSubtext = isDark ? "#94a3b8" : "#64748b";
  const sheetField = isDark ? "#334155" : "#f1f5f9";

  const onFromChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowFromPicker(false);
    if (date) setDraftFrom(date);
  };

  const onToChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowToPicker(false);
    if (date) setDraftTo(date);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { backgroundColor: sheetBg }]}>
        {/* Drag handle */}
        <View style={styles.handleRow}>
          <View
            style={[
              styles.handle,
              { backgroundColor: isDark ? "#475569" : "#cbd5e1" },
            ]}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetScroll}
        >
          {/* Title row */}
          <View style={styles.sheetTitleRow}>
            <Text style={[styles.sheetTitle, { color: sheetText }]}>
              Advanced Search
            </Text>
            <TouchableOpacity
              onPress={onReset}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ color: PRIMARY, fontSize: 14, fontWeight: "600" }}>
                Reset Filters
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Date Range ─────────────────────────────────── */}
          <Text style={[styles.sectionLabel, { color: sheetText }]}>
            Date Range
          </Text>
          <View style={styles.dateRow}>
            {/* From date */}
            <TouchableOpacity
              style={[styles.dateField, { backgroundColor: sheetField }]}
              activeOpacity={0.7}
              onPress={() => {
                setShowToPicker(false);
                setShowFromPicker((prev: boolean) => !prev);
              }}
            >
              <MaterialIcons
                name="date-range"
                size={18}
                color={sheetSubtext}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.dateInput,
                  { color: draftFrom ? sheetText : sheetSubtext },
                ]}
                numberOfLines={1}
              >
                {draftFrom ? formatDate(toDDMMYYYY(draftFrom)) : "Start date"}
              </Text>
              {draftFrom && (
                <TouchableOpacity
                  onPress={() => {
                    setDraftFrom(null);
                    setShowFromPicker(false);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="close" size={16} color={sheetSubtext} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* To date */}
            <TouchableOpacity
              style={[styles.dateField, { backgroundColor: sheetField }]}
              activeOpacity={0.7}
              onPress={() => {
                setShowFromPicker(false);
                setShowToPicker((prev: boolean) => !prev);
              }}
            >
              <MaterialIcons
                name="date-range"
                size={18}
                color={sheetSubtext}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.dateInput,
                  { color: draftTo ? sheetText : sheetSubtext },
                ]}
                numberOfLines={1}
              >
                {draftTo ? formatDate(toDDMMYYYY(draftTo)) : "End date"}
              </Text>
              {draftTo && (
                <TouchableOpacity
                  onPress={() => {
                    setDraftTo(null);
                    setShowToPicker(false);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="close" size={16} color={sheetSubtext} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* Native date picker — iOS inline / Android dialog */}
          {showFromPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={draftFrom ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={onFromChange}
                maximumDate={draftTo ?? undefined}
                themeVariant={isDark ? "dark" : "light"}
              />
            </View>
          )}
          {showToPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={draftTo ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={onToChange}
                minimumDate={draftFrom ?? undefined}
                themeVariant={isDark ? "dark" : "light"}
              />
            </View>
          )}

          {/* ── Project Status ─────────────────────────────── */}
          <Text
            style={[styles.sectionLabel, { color: sheetText, marginTop: 20 }]}
          >
            Project Status
          </Text>
          <View style={styles.chipsWrap}>
            {allStatuses.map((s) => {
              const active = draftStatus === s;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setDraftStatus(active ? null : s)}
                  style={[
                    styles.statusChip,
                    active
                      ? {
                          backgroundColor: `${PRIMARY}18`,
                          borderColor: PRIMARY,
                        }
                      : {
                          backgroundColor: sheetField,
                          borderColor: isDark ? "#475569" : "#e2e8f0",
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      { color: active ? PRIMARY : sheetSubtext },
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Project Manager ─────────────────────────────── */}
          <Text
            style={[styles.sectionLabel, { color: sheetText, marginTop: 20 }]}
          >
            Project Manager
          </Text>
          <View style={[styles.dropdownField, { backgroundColor: sheetField }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setDraftManager(null)}
                style={[
                  styles.catChip,
                  !draftManager
                    ? { backgroundColor: PRIMARY }
                    : { backgroundColor: isDark ? "#334155" : "#e2e8f0" },
                ]}
              >
                <Text
                  style={{
                    color: !draftManager ? "#fff" : sheetSubtext,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  All Managers
                </Text>
              </TouchableOpacity>
              {allManagers.map((c) => {
                const active = draftManager === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setDraftManager(active ? null : c)}
                    style={[
                      styles.catChip,
                      active
                        ? { backgroundColor: PRIMARY }
                        : {
                            backgroundColor: isDark ? "#334155" : "#e2e8f0",
                          },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? "#fff" : sheetSubtext,
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ── Apply Button ────────────────────────────────── */}
          <TouchableOpacity
            onPress={onApply}
            style={styles.applyBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  handleRow: { alignItems: "center", paddingTop: 12, paddingBottom: 8 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  sheetScroll: { paddingHorizontal: 24, paddingBottom: 16 },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 22, fontWeight: "700" },
  sectionLabel: { fontSize: 15, fontWeight: "600", marginBottom: 10 },
  dateRow: { flexDirection: "row", gap: 10 },
  dateField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  dateInput: { flex: 1, fontSize: 14 },
  pickerContainer: { marginTop: 10, alignItems: "center" },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusChipText: { fontSize: 13, fontWeight: "600" },
  dropdownField: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    marginRight: 6,
  },
  applyBtn: {
    marginTop: 28,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
