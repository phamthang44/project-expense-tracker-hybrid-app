import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";

import { MOCK_PROJECTS, Project, formatDate } from "@/constants/mock-data";
import { Colors, PRIMARY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type FilterTab = "All" | "Active" | "Archived";

const FILTER_TABS: FilterTab[] = ["All", "Active", "Archived"];

const ACTIVE_STATUSES = new Set(["Active", "Pending"]);
const ARCHIVED_STATUSES = new Set(["Archived", "Completed"]);

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [favIds, setFavIds] = useState<Set<string>>(
    new Set(MOCK_PROJECTS.filter((p) => p.isFavorite).map((p) => p.id)),
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<TextInput>(null);

  const toggleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (searchOpen) {
      setSearchQuery("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  const displayed = useMemo<Project[]>(() => {
    return MOCK_PROJECTS.filter((p) => {
      if (!favIds.has(p.id)) return false;
      if (activeTab === "Active" && !ACTIVE_STATUSES.has(p.status))
        return false;
      if (activeTab === "Archived" && !ARCHIVED_STATUSES.has(p.status))
        return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [favIds, activeTab, searchQuery]);

  const toggleFav = (id: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderItem = ({ item }: { item: Project }) => {
    const isFav = favIds.has(item.id);
    return (
      <View
        style={[
          styles.row,
          { borderBottomColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        {/* Thumbnail */}
        <View style={styles.thumbContainer}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.thumb}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.thumb,
                styles.thumbFallback,
                { backgroundColor: item.iconBgColor },
              ]}
            >
              <MaterialIcons
                name={item.iconName as any}
                size={28}
                color={item.iconColor}
              />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.meta, { color: colors.subtext }]}>
            {item.category} • {item.status} • {formatDate(item.date)}
          </Text>
          {item.isPriority && (
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: `${PRIMARY}1a` }]}>
                <Text style={[styles.badgeText, { color: PRIMARY }]}>
                  PRIORITY
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Heart button */}
        <TouchableOpacity
          onPress={() => toggleFav(item.id)}
          style={styles.heartBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={isFav ? "favorite" : "favorite-border"}
            size={24}
            color={PRIMARY}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* ── Header ───────────────────────────────────── */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity style={[styles.iconBtn, { borderRadius: 20 }]}>
          <MaterialIcons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Favorites
        </Text>
        <TouchableOpacity
          onPress={toggleSearch}
          style={[
            styles.iconBtn,
            {
              borderRadius: 20,
              backgroundColor: searchOpen ? `${PRIMARY}15` : "transparent",
            },
          ]}
        >
          <MaterialIcons
            name={searchOpen ? "search-off" : "search"}
            size={24}
            color={searchOpen ? PRIMARY : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* ── Inline search bar (slides in) ────────────── */}
      {searchOpen && (
        <View
          style={[
            styles.inlineSearchWrap,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View
            style={[styles.inlineSearchBar, { backgroundColor: colors.card }]}
          >
            <MaterialIcons
              name="search"
              size={18}
              color={colors.subtext}
              style={{ marginRight: 8 }}
            />
            <TextInput
              ref={searchRef}
              style={[styles.inlineSearchInput, { color: colors.text }]}
              placeholder="Search favourites…"
              placeholderTextColor={colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <MaterialIcons name="close" size={16} color={colors.subtext} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* ── Filter Tabs ──────────────────────────────── */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        {FILTER_TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                active
                  ? { borderBottomColor: PRIMARY }
                  : { borderBottomColor: "transparent" },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? PRIMARY : colors.subtext },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── List ─────────────────────────────────────── */}
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
                {MOCK_PROJECTS.filter((p) => favIds.has(p.id)).length}{" "}
                favourites
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === "android" ? 16 : 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    flex: 1,
    textAlign: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 24,
    borderBottomWidth: 1,
  },
  tab: {
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  thumbContainer: {
    marginRight: 14,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  thumbFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  meta: {
    fontSize: 13,
    fontWeight: "500",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heartBtn: {
    padding: 4,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 28,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
  },
  inlineSearchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  inlineSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  inlineSearchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
