import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { MOCK_PROJECTS, Project, formatDate } from "@/constants/mock-data";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// ── Constants ──────────────────────────────────────────────────────────────────
const ALL_STATUSES: Project["status"][] = [
  "Active",
  "Pending",
  "Completed",
  "Archived",
];

const ALL_CATEGORIES = [...new Set(MOCK_PROJECTS.map((p) => p.category))];

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/** Convert a Date to "YYYY-MM-DD" */
const toISO = (d: Date) => d.toISOString().slice(0, 10);

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  // ── search state ───────────────────────────────────────────────────────────
  const [nameQuery, setNameQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // draft filters (edited inside the sheet, committed on Apply)
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
  const [draftCategory, setDraftCategory] = useState<string | null>(null);
  const [draftFrom, setDraftFrom] = useState<Date | null>(null);
  const [draftTo, setDraftTo] = useState<Date | null>(null);

  // which picker is open (Android shows a dialog, iOS shows inline)
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // applied filters (what actually filters the list)
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  // ── star/fav state ─────────────────────────────────────────────────────────
  const [starredIds, setStarredIds] = useState<Set<string>>(
    new Set(MOCK_PROJECTS.filter((p) => p.isFavorite).map((p) => p.id)),
  );

  // ── helpers ────────────────────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (appliedStatus) n++;
    if (appliedCategory) n++;
    if (appliedFrom) n++;
    if (appliedTo) n++;
    return n;
  }, [appliedStatus, appliedCategory, appliedFrom, appliedTo]);

  const openSheet = useCallback(() => {
    // Sync draft to currently applied values when opening
    setDraftStatus(appliedStatus);
    setDraftCategory(appliedCategory);
    setDraftFrom(appliedFrom ? new Date(appliedFrom) : null);
    setDraftTo(appliedTo ? new Date(appliedTo) : null);
    setShowFromPicker(false);
    setShowToPicker(false);
    setSheetOpen(true);
  }, [appliedStatus, appliedCategory, appliedFrom, appliedTo]);

  const applyFilters = () => {
    setAppliedStatus(draftStatus);
    setAppliedCategory(draftCategory);
    setAppliedFrom(draftFrom ? toISO(draftFrom) : "");
    setAppliedTo(draftTo ? toISO(draftTo) : "");
    setSheetOpen(false);
  };

  const resetDraft = () => {
    setDraftStatus(null);
    setDraftCategory(null);
    setDraftFrom(null);
    setDraftTo(null);
    setShowFromPicker(false);
    setShowToPicker(false);
  };

  const onFromChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowFromPicker(false);
    if (date) setDraftFrom(date);
  };

  const onToChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowToPicker(false);
    if (date) setDraftTo(date);
  };

  const clearAllFilters = () => {
    resetDraft();
    setAppliedStatus(null);
    setAppliedCategory(null);
    setAppliedFrom("");
    setAppliedTo("");
    setNameQuery("");
  };

  const removeApplied = (key: "status" | "category" | "from" | "to") => {
    if (key === "status") setAppliedStatus(null);
    if (key === "category") setAppliedCategory(null);
    if (key === "from") setAppliedFrom("");
    if (key === "to") setAppliedTo("");
  };

  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── filtered list ──────────────────────────────────────────────────────────
  const results = useMemo<Project[]>(() => {
    return MOCK_PROJECTS.filter((p) => {
      // name search
      if (nameQuery && !p.name.toLowerCase().includes(nameQuery.toLowerCase()))
        return false;
      // status
      if (appliedStatus && p.status !== appliedStatus) return false;
      // category
      if (appliedCategory && p.category !== appliedCategory) return false;
      // date from
      if (appliedFrom && p.date < appliedFrom) return false;
      // date to
      if (appliedTo && p.date > appliedTo) return false;
      return true;
    });
  }, [nameQuery, appliedStatus, appliedCategory, appliedFrom, appliedTo]);

  // ── render helpers ─────────────────────────────────────────────────────────
  const renderProject = ({ item }: { item: Project }) => {
    const starred = starredIds.has(item.id);
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.iconTile, { backgroundColor: item.iconBgColor }]}>
          <MaterialIcons
            name={item.iconName as any}
            size={24}
            color={item.iconColor}
          />
        </View>
        <View style={styles.cardBody}>
          <Text
            style={[styles.cardTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.cardMeta, { color: colors.subtext }]}>
            {item.category} • {item.status} • {formatDate(item.date)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleStar(item.id)}
          style={styles.starBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={starred ? "star" : "star-border"}
            size={24}
            color={starred ? "#f59e0b" : colors.icon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // ── sheet colors ───────────────────────────────────────────────────────────
  const sheetBg = isDark ? "#1e293b" : "#ffffff";
  const sheetText = colors.text;
  const sheetSubtext = colors.subtext;
  const sheetField = isDark ? "#334155" : "#f1f5f9";

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* ── Sticky Header ─────────────────────────────────────────── */}
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
              Search Results
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="sync" size={24} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Search row */}
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
              placeholder="Search project name…"
              placeholderTextColor={colors.subtext}
              value={nameQuery}
              onChangeText={setNameQuery}
              returnKeyType="search"
            />
            {nameQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setNameQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="close" size={18} color={colors.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {/* Advanced filter button */}
          <TouchableOpacity
            onPress={openSheet}
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilterCount > 0 ? PRIMARY : colors.card,
              },
            ]}
          >
            <MaterialIcons
              name="tune"
              size={20}
              color={activeFilterCount > 0 ? "#fff" : colors.subtext}
            />
            {activeFilterCount > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {(appliedFrom || appliedTo) && (
              <View style={[styles.pill, { backgroundColor: PRIMARY }]}>
                <MaterialIcons
                  name="event"
                  size={14}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.pillText}>
                  {appliedFrom ? formatDate(appliedFrom) : "…"}
                  {" — "}
                  {appliedTo ? formatDate(appliedTo) : "…"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    removeApplied("from");
                    removeApplied("to");
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
            {appliedStatus && (
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
                  {appliedStatus}
                </Text>
                <TouchableOpacity
                  onPress={() => removeApplied("status")}
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
            {appliedCategory && (
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
                  {appliedCategory}
                </Text>
                <TouchableOpacity
                  onPress={() => removeApplied("category")}
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

      {/* ── Result count + list ───────────────────────────────────── */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: colors.background },
        ]}
        ListHeaderComponent={
          <Text style={[styles.resultCount, { color: colors.subtext }]}>
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No projects match your search
            </Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text
                style={{
                  color: PRIMARY,
                  fontSize: 14,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Clear all filters
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ── Bottom Sheet Modal ─────────────────────────────────────────────── */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSheetOpen(false)}>
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
                onPress={resetDraft}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text
                  style={{ color: PRIMARY, fontSize: 14, fontWeight: "600" }}
                >
                  Reset Filters
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Date Range ────────────────────────────────────── */}
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
                  setShowFromPicker((prev) => !prev);
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
                  {draftFrom ? formatDate(toISO(draftFrom)) : "Start date"}
                </Text>
                {draftFrom && (
                  <TouchableOpacity
                    onPress={() => {
                      setDraftFrom(null);
                      setShowFromPicker(false);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialIcons
                      name="close"
                      size={16}
                      color={sheetSubtext}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* To date */}
              <TouchableOpacity
                style={[styles.dateField, { backgroundColor: sheetField }]}
                activeOpacity={0.7}
                onPress={() => {
                  setShowFromPicker(false);
                  setShowToPicker((prev) => !prev);
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
                  {draftTo ? formatDate(toISO(draftTo)) : "End date"}
                </Text>
                {draftTo && (
                  <TouchableOpacity
                    onPress={() => {
                      setDraftTo(null);
                      setShowToPicker(false);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialIcons
                      name="close"
                      size={16}
                      color={sheetSubtext}
                    />
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

            {/* ── Project Status ────────────────────────────────── */}
            <Text
              style={[styles.sectionLabel, { color: sheetText, marginTop: 20 }]}
            >
              Project Status
            </Text>
            <View style={styles.chipsWrap}>
              {ALL_STATUSES.map((s) => {
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

            {/* ── Project Category ──────────────────────────────── */}
            <Text
              style={[styles.sectionLabel, { color: sheetText, marginTop: 20 }]}
            >
              Project Category
            </Text>
            <View
              style={[styles.dropdownField, { backgroundColor: sheetField }]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => setDraftCategory(null)}
                  style={[
                    styles.catChip,
                    !draftCategory
                      ? { backgroundColor: PRIMARY }
                      : { backgroundColor: isDark ? "#334155" : "#e2e8f0" },
                  ]}
                >
                  <Text
                    style={{
                      color: !draftCategory ? "#fff" : sheetSubtext,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    All Categories
                  </Text>
                </TouchableOpacity>
                {ALL_CATEGORIES.map((c) => {
                  const active = draftCategory === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setDraftCategory(active ? null : c)}
                      style={[
                        styles.catChip,
                        active
                          ? { backgroundColor: PRIMARY }
                          : { backgroundColor: isDark ? "#334155" : "#e2e8f0" },
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

            {/* ── Apply Button ──────────────────────────────────── */}
            <TouchableOpacity
              onPress={applyFilters}
              style={styles.applyBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  // Header
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

  // Search row
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

  // Pills
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

  // List
  listContent: { padding: 16 },
  resultCount: { fontSize: 12, fontWeight: "500", marginBottom: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", marginBottom: 3 },
  cardMeta: { fontSize: 12 },
  starBtn: { padding: 4, marginLeft: 8 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyText: { fontSize: 15, textAlign: "center" },

  // ── Bottom Sheet ───────────────────────────────────────────
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

  // Section
  sectionLabel: { fontSize: 15, fontWeight: "600", marginBottom: 10 },

  // Date
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

  // Status chips
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusChipText: { fontSize: 13, fontWeight: "600" },

  // Category
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

  // Apply
  applyBtn: {
    marginTop: 28,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
