import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FilterSheet from "@/components/projects/FilterSheet";
import ProjectCard from "@/components/projects/ProjectCard";
import SearchHeader from "@/components/projects/SearchHeader";
import { type Project, ddmmyyyyToISO } from "@/constants/mock-data";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFavorites } from "@/hooks/use-favorites";
import { useProjects } from "@/hooks/use-projects";

/** Convert a Date to "YYYY-MM-DD" */
const toISO = (d: Date) => d.toISOString().slice(0, 10);

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  // ── Firestore data ─────────────────────────────────────────────────────────
  const { projects, loading, error } = useProjects();
  const { favIds, toggleFavorite } = useFavorites();

  const allStatuses = useMemo(
    () => [...new Set(projects.map((p) => p.status))],
    [projects],
  );
  const allManagers = useMemo(
    () => [...new Set(projects.map((p) => p.manager).filter(Boolean))],
    [projects],
  );

  // ── search / filter state ──────────────────────────────────────────────────
  const [nameQuery, setNameQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // draft filters (edited inside the sheet, committed on Apply)
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
  const [draftManager, setDraftManager] = useState<string | null>(null);
  const [draftFrom, setDraftFrom] = useState<Date | null>(null);
  const [draftTo, setDraftTo] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // applied filters (what actually filters the list)
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
  const [appliedManager, setAppliedManager] = useState<string | null>(null);
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  // ── helpers ────────────────────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (appliedStatus) n++;
    if (appliedManager) n++;
    if (appliedFrom) n++;
    if (appliedTo) n++;
    return n;
  }, [appliedStatus, appliedManager, appliedFrom, appliedTo]);

  const openSheet = useCallback(() => {
    setDraftStatus(appliedStatus);
    setDraftManager(appliedManager);
    setDraftFrom(appliedFrom ? new Date(appliedFrom) : null);
    setDraftTo(appliedTo ? new Date(appliedTo) : null);
    setShowFromPicker(false);
    setShowToPicker(false);
    setSheetOpen(true);
  }, [appliedStatus, appliedManager, appliedFrom, appliedTo]);

  const applyFilters = () => {
    setAppliedStatus(draftStatus);
    setAppliedManager(draftManager);
    setAppliedFrom(draftFrom ? toISO(draftFrom) : "");
    setAppliedTo(draftTo ? toISO(draftTo) : "");
    setSheetOpen(false);
  };

  const resetDraft = () => {
    setDraftStatus(null);
    setDraftManager(null);
    setDraftFrom(null);
    setDraftTo(null);
    setShowFromPicker(false);
    setShowToPicker(false);
  };

  const clearAllFilters = () => {
    resetDraft();
    setAppliedStatus(null);
    setAppliedManager(null);
    setAppliedFrom("");
    setAppliedTo("");
    setNameQuery("");
  };

  const removeApplied = (key: "status" | "manager" | "from" | "to") => {
    if (key === "status") setAppliedStatus(null);
    if (key === "manager") setAppliedManager(null);
    if (key === "from") setAppliedFrom("");
    if (key === "to") setAppliedTo("");
  };

  // ── filtered list ──────────────────────────────────────────────────────────
  const results = useMemo<Project[]>(() => {
    return projects.filter((p) => {
      if (
        nameQuery &&
        !p.projectName.toLowerCase().includes(nameQuery.toLowerCase())
      )
        return false;
      if (appliedStatus && p.status !== appliedStatus) return false;
      if (appliedManager && p.manager !== appliedManager) return false;
      const pISO = ddmmyyyyToISO(p.startDate);
      if (appliedFrom && pISO < appliedFrom) return false;
      if (appliedTo && pISO > appliedTo) return false;
      return true;
    });
  }, [
    projects,
    nameQuery,
    appliedStatus,
    appliedManager,
    appliedFrom,
    appliedTo,
  ]);

  // ── render helpers ─────────────────────────────────────────────────────────
  const renderProject = useCallback(
    ({ item }: { item: Project }) => (
      <ProjectCard
        project={item}
        isFavorite={favIds.has(item.id)}
        onToggleFavorite={toggleFavorite}
        colors={colors}
      />
    ),
    [favIds, toggleFavorite, colors],
  );

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <SearchHeader
        colors={colors}
        nameQuery={nameQuery}
        onNameQueryChange={setNameQuery}
        activeFilterCount={activeFilterCount}
        onOpenSheet={openSheet}
        applied={{
          status: appliedStatus,
          manager: appliedManager,
          from: appliedFrom,
          to: appliedTo,
        }}
        onRemoveFilter={removeApplied}
      />

      {/* ── Loading / Error / List ────────────────────────────────── */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Loading projects…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="cloud-off" size={48} color={colors.subtext} />
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            {error}
          </Text>
        </View>
      ) : (
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
              <MaterialIcons
                name="search-off"
                size={48}
                color={colors.subtext}
              />
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
      )}

      {/* ── Bottom Sheet (Filter Modal) ───────────────────────────── */}
      <FilterSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onApply={applyFilters}
        onReset={resetDraft}
        isDark={isDark}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        draftManager={draftManager}
        setDraftManager={setDraftManager}
        draftFrom={draftFrom}
        setDraftFrom={setDraftFrom}
        draftTo={draftTo}
        setDraftTo={setDraftTo}
        showFromPicker={showFromPicker}
        setShowFromPicker={setShowFromPicker}
        showToPicker={showToPicker}
        setShowToPicker={setShowToPicker}
        allStatuses={allStatuses}
        allManagers={allManagers}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { padding: 16 },
  resultCount: { fontSize: 12, fontWeight: "500", marginBottom: 10 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyText: { fontSize: 15, textAlign: "center" },
});
