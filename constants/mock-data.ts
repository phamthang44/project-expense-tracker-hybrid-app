/**
 * Shared types and helpers for the Project Expense Tracker.
 * Interfaces mirror the real Firestore collections.
 */

// ── Expense (Firestore "expenses" collection) ────────────────────────────────
export interface Expense {
  /** Firestore document ID, e.g. "10_10" */
  id: string;
  expenseId: number;
  projectId: number;
  amount: number;
  currency: string;
  /** DD/MM/YYYY from admin app */
  date: string;
  /** Expense category, e.g. "Food & Entertainment" */
  type: string;
  claimant: string;
  description: string | null;
  location: string | null;
  paymentMethod: string;
  paymentStatus: string;
}

// ── Project (Firestore "projects" collection) ────────────────────────────────
export interface Project {
  /** Firestore document ID, e.g. "DSDA", "PRJ-002" */
  id: string;
  /** Numeric id field from admin app */
  projectId: number;
  projectName: string;
  projectCode: string;
  description: string;
  status: string;
  /** "High" | "Medium" | "Low" */
  priority: string;
  budget: number;
  manager: string;
  clientInfo: string | null;
  specialRequirements: string | null;
  /** DD/MM/YYYY */
  startDate: string;
  /** DD/MM/YYYY */
  endDate: string;
  /** Expenses fetched from "expenses" collection, matched by projectId */
  expenses: Expense[];
  /** Computed sum of expense amounts */
  totalExpenses: number;
  /** Default currency from expenses, or "USD" */
  currency: string;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Parse a "DD/MM/YYYY" string into a Date object.
 * Returns null for empty / malformed strings.
 */
export function parseDDMMYYYY(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Convert "DD/MM/YYYY" → "YYYY-MM-DD" (ISO) for date comparison.
 */
export function ddmmyyyyToISO(str: string): string {
  if (!str) return "";
  const parts = str.split("/");
  if (parts.length !== 3) return str;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

/**
 * Format a "DD/MM/YYYY" string into a readable label.
 * e.g. "24/10/2023" → "Oct 24, 2023"
 */
export function formatDate(ddmmyyyy: string): string {
  const d = parseDDMMYYYY(ddmmyyyy);
  if (!d) return ddmmyyyy || "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// ── Visual helpers (derive icon/colour from status) ──────────────────────────

export interface StatusVisuals {
  iconName: string;
  iconBgColor: string;
  iconColor: string;
}

/** Map a project status string to MaterialIcons icon + colours. */
export function getStatusVisuals(status: string): StatusVisuals {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        iconName: "folder",
        iconBgColor: "#dbeafe",
        iconColor: "#2563eb",
      };
    case "pending":
      return {
        iconName: "hourglass-empty",
        iconBgColor: "#fef3c7",
        iconColor: "#d97706",
      };
    case "completed":
      return {
        iconName: "check-circle",
        iconBgColor: "#d1fae5",
        iconColor: "#059669",
      };
    case "cancelled":
      return {
        iconName: "cancel",
        iconBgColor: "#fee2e2",
        iconColor: "#dc2626",
      };
    case "archived":
      return {
        iconName: "archive",
        iconBgColor: "#e5e7eb",
        iconColor: "#6b7280",
      };
    default:
      return {
        iconName: "folder",
        iconBgColor: "#dbeafe",
        iconColor: "#2563eb",
      };
  }
}
