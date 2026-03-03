import { useThemeContext, type ResolvedScheme } from "@/context/ThemeContext";

export function useColorScheme(): ResolvedScheme {
  return useThemeContext().colorScheme;
}
