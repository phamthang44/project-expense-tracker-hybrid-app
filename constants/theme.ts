/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const PRIMARY = "#1973f0";

export const Colors = {
  light: {
    text: "#0f172a",
    subtext: "#64748b",
    background: "#f6f7f8",
    surface: "#ffffff",
    card: "#f1f5f9",
    border: "#e2e8f0",
    tint: PRIMARY,
    icon: "#64748b",
    tabIconDefault: "#94a3b8",
    tabIconSelected: PRIMARY,
  },
  dark: {
    text: "#f1f5f9",
    subtext: "#94a3b8",
    background: "#101822",
    surface: "#0f172a",
    card: "#1e293b",
    border: "#1e293b",
    tint: PRIMARY,
    icon: "#94a3b8",
    tabIconDefault: "#64748b",
    tabIconSelected: PRIMARY,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
