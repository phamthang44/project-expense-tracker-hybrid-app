import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PRIMARY } from "@/constants/theme";
import type { ThemeColors } from "@/constants/types";

// ── Types ────────────────────────────────────────────────────────────────────

export type FilterTab = "All" | "Active" | "Archived";

export const FILTER_TABS: FilterTab[] = ["All", "Active", "Archived"];

interface FavoritesHeaderProps {
  colors: ThemeColors;
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchOpen: boolean;
  searchQuery: string;
  onToggleSearch: () => void;
  onSearchQueryChange: (v: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function FavoritesHeader({
  colors,
  activeTab,
  onTabChange,
  searchOpen,
  searchQuery,
  onToggleSearch,
  onSearchQueryChange,
}: FavoritesHeaderProps) {
  const searchRef = useRef<TextInput>(null);

  const handleToggleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleSearch();
    if (!searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* ── Header bar ───────────────────────────────── */}
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
          onPress={handleToggleSearch}
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
              onChangeText={onSearchQueryChange}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => onSearchQueryChange("")}
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
              onPress={() => onTabChange(tab)}
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
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
