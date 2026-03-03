import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

// ── Types ────────────────────────────────────────────────────────────────────

/** The three options the user can pick. */
export type ThemePreference = "system" | "light" | "dark";

/** Resolved to an actual scheme — never "system". */
export type ResolvedScheme = "light" | "dark";

interface ThemeContextValue {
  /** What the user chose (persisted). */
  preference: ThemePreference;
  /** The actual light/dark value after resolving "system". */
  colorScheme: ResolvedScheme;
  /** Change the preference — automatically persisted. */
  setPreference: (p: ThemePreference) => void;
}

// ── Storage key ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "user_theme_preference";

// ── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  colorScheme: "light",
  setPreference: () => {},
});

// ── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme() ?? "light";
  const [preference, _setPreference] = useState<ThemePreference>("system");

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "light" || val === "dark" || val === "system") {
        _setPreference(val);
      }
    });
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    _setPreference(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
  }, []);

  const colorScheme: ResolvedScheme = useMemo(
    () => (preference === "system" ? systemScheme : preference),
    [preference, systemScheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, colorScheme, setPreference }),
    [preference, colorScheme, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/** Use the resolved colour scheme (respects user override). */
export function useThemeContext() {
  return useContext(ThemeContext);
}
