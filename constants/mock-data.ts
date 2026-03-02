/**
 * Mock project data.
 * This file is designed to be easily swapped for Firebase Firestore calls.
 *
 * Future integration:
 *   import { collection, getDocs } from 'firebase/firestore';
 *   const snapshot = await getDocs(collection(db, 'projects'));
 *   const projects: Project[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
 */

export interface Expense {
  id: string;
  label: string;
  amount: number;
  currency: string;
  date: string; // ISO 8601 date string, e.g. "2025-10-24"
}

export interface Project {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Pending" | "Completed" | "Archived";
  /** MaterialIcons icon name */
  iconName: string;
  /** Background color of the icon tile */
  iconBgColor: string;
  /** Icon foreground color */
  iconColor: string;
  /** ISO 8601 date string for the project (from Firebase), e.g. "2023-10-24" */
  date: string;
  isFavorite: boolean;
  isPriority: boolean;
  /** Optional remote image URL (used in Favorites list) */
  imageUrl?: string;
  /** Total expense amount (sum of all expense items) */
  totalExpenses: number;
  /** Currency code, e.g. "USD" */
  currency: string;
  /** List of individual expenses */
  expenses: Expense[];
}

/**
 * Helper: format an ISO date string into a readable label.
 * e.g. "2023-10-24" → "Oct 24, 2023"
 */
export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Modern Eco-Villa",
    category: "Architecture",
    status: "Active",
    iconName: "folder",
    iconBgColor: "#dbeafe",
    iconColor: "#1973f0",
    date: "2025-09-10",
    isFavorite: true,
    isPriority: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkBpxhiwOg-2vnEIHpbQxW0SH0yPC9LWImak2X0TQP8kdEclJEvtKDTebcaXrHtl9H5KRCWK3fWpvZ0zpCUSFhnRZ449n-2nCuvtCPW-s8_XqBxrgMtfRzucUWEsiFy_AgIs8EleLLvueBtoLFV-HeMszkj2BnQxWoG2Q1xY-VvHD0cNXLRUNgZQ4sxHxXHvswAJ-z_jzeMCQC88rHDg10tRww69apc_6VvcsbKiAiW6CCzxd1IzlBQ1TBGFCuuCtw0_qU0-GjvQ",
    totalExpenses: 4200,
    currency: "USD",
    expenses: [
      {
        id: "e1-1",
        label: "Materials",
        amount: 2500,
        currency: "USD",
        date: "2025-09-10",
      },
      {
        id: "e1-2",
        label: "Labour",
        amount: 1700,
        currency: "USD",
        date: "2025-10-01",
      },
    ],
  },
  {
    id: "2",
    name: "Urban Loft Renovation",
    category: "Interior",
    status: "Pending",
    iconName: "storage",
    iconBgColor: "#ede9fe",
    iconColor: "#7c3aed",
    date: "2025-08-15",
    isFavorite: true,
    isPriority: false,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX1TOtQQHfC4lWsWHJ7sAR5_asp5D7E9NWD-PZGCvtgT_7CxwraikmHTG9OjmsEU5lO-65sDEzu0iNEr8QRel-Vsg5pB_2eJvrf60qUuR0V5CR0919y2kYSv2gYYvP72wNFuZHD_IDMavlSy1y4gZcWJie2TTK6oW9iTkm8sMuMU3GhtmciiV2rZjMgNMH9inNCXdKvPNzn4VFj29KxcDt0po79GauiObU4l5gsOOv6VX72o1PFx5bXqNoq5unwL49NyzLymyidA",
    totalExpenses: 800,
    currency: "USD",
    expenses: [
      {
        id: "e2-1",
        label: "Software Licences",
        amount: 800,
        currency: "USD",
        date: "2025-08-15",
      },
    ],
  },
  {
    id: "3",
    name: "Riverside Public Park",
    category: "Landscape",
    status: "Active",
    iconName: "bar-chart",
    iconBgColor: "#d1fae5",
    iconColor: "#059669",
    date: "2025-09-20",
    isFavorite: true,
    isPriority: false,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXeZFdx5OMfqgd3Q6XOw84xlBGvvY44CaJKJFzldofYPbx1Z-iaORkq_e1sKGwP_oADgZv_JQqgdQqNQiEO-owp7649bKOceI_id-bwi1k90CI-Kk36SKd0ftyMWfp2sbkYABBXJwM9wF6o5AYWQ8zIDPWMjQOFMslko3SlIArUwa9jRvbKfydarMvCpKnHIiCx41pIfZUBtLJ_AoJAvnm3phWw7YwdJZYLb-xDSD-ZRLqvD5vIv32aa_ocZ4PSxRoZ0uD2az5yg",
    totalExpenses: 3100,
    currency: "USD",
    expenses: [
      {
        id: "e3-1",
        label: "Consultancy",
        amount: 1500,
        currency: "USD",
        date: "2025-09-20",
      },
      {
        id: "e3-2",
        label: "Equipment",
        amount: 1600,
        currency: "USD",
        date: "2025-10-05",
      },
    ],
  },
  {
    id: "4",
    name: "Tech HQ Workspace",
    category: "Commercial",
    status: "Completed",
    iconName: "image",
    iconBgColor: "#dbeafe",
    iconColor: "#2563eb",
    date: "2023-10-24",
    isFavorite: true,
    isPriority: false,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkQ9sbNs1HKBCXXj4dmZAlkjXb6yow3J5BIzL1NbmlyDQyukvFomeScFMEOFMSIjQlo1UPBINIxx97liaEq2bKN_r5dGviOEQ-4znosXK881gktMSRa1-D_HWiePLo4apIKjm98H4iVuoxt7jPal5W-L1q7WpR_Wo7Fq5wO9sZvvUxlXGsSRnWrqGmOjaZk788NqzITaDl_WaEOOsGegQsSuT_I7WFmg7lLTkJZHQq1wsevb_ZN9TY5t5jZBpEBOc2spEYr7ecIw",
    totalExpenses: 9800,
    currency: "USD",
    expenses: [
      {
        id: "e4-1",
        label: "Photography",
        amount: 4000,
        currency: "USD",
        date: "2023-09-12",
      },
      {
        id: "e4-2",
        label: "Editing",
        amount: 2800,
        currency: "USD",
        date: "2023-10-01",
      },
      {
        id: "e4-3",
        label: "Hosting",
        amount: 3000,
        currency: "USD",
        date: "2023-10-20",
      },
    ],
  },
  {
    id: "5",
    name: "Project Alpha Phase 1",
    category: "Engineering",
    status: "Archived",
    iconName: "code",
    iconBgColor: "#ffedd5",
    iconColor: "#ea580c",
    date: "2023-10-18",
    isFavorite: false,
    isPriority: false,
    totalExpenses: 1200,
    currency: "USD",
    expenses: [
      {
        id: "e5-1",
        label: "Developer hours",
        amount: 1200,
        currency: "USD",
        date: "2023-10-18",
      },
    ],
  },
];
