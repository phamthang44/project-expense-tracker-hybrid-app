import FavoriteItem from "@/components/favorites/FavoriteItem";
import FavoritesHeader, {
  type FilterTab,
} from "@/components/favorites/FavoritesHeader";
import type { Project } from "@/constants/mock-data";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFavorites } from "@/hooks/use-favorites";
import { useProjects } from "@/hooks/use-projects";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation on Android (must be after all imports)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACTIVE_STATUSES = new Set(["Active", "Pending"]);
const ARCHIVED_STATUSES = new Set(["Archived", "Completed", "Cancelled"]);

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // ── Firestore data ──────────────────────────────────────────────────────────
  const { projects, loading, error } = useProjects();
  const { favIds, toggleFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSearch = () => {
    if (searchOpen) {
      setSearchQuery("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  const displayed = useMemo<Project[]>(() => {
    return projects.filter((p) => {
      if (!favIds.has(p.id)) return false;
      if (activeTab === "Active" && !ACTIVE_STATUSES.has(p.status))
        return false;
      if (activeTab === "Archived" && !ARCHIVED_STATUSES.has(p.status))
        return false;
      if (
        searchQuery &&
        !p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [projects, favIds, activeTab, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: Project }) => (
      <FavoriteItem
        project={item}
        isFavorite={favIds.has(item.id)}
        onToggleFavorite={toggleFavorite}
        colors={colors}
      />
    ),
    [favIds, toggleFavorite, colors],
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <FavoritesHeader
        colors={colors}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onToggleSearch={handleToggleSearch}
        onSearchQueryChange={setSearchQuery}
      />

      {/* ── List ─────────────────────────────────────── */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Loading favourites…
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
          data={displayed}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{ backgroundColor: colors.background }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="favorite-border"
                size={48}
                color={colors.subtext}
              />
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                No favorites in this category
              </Text>
            </View>
          }
          ListFooterComponent={
            displayed.length > 0 ? (
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.subtext }]}>
                  Showing {displayed.length} of{" "}
                  {projects.filter((p) => favIds.has(p.id)).length} favourites
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { fontSize: 15, textAlign: "center" },
  footer: { paddingVertical: 28, alignItems: "center" },
  footerText: { fontSize: 13 },
});
