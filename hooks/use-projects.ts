import { db } from "@/app/firebaseConfig";
import type { Expense, Project } from "@/constants/mock-data";
import { ddmmyyyyToISO } from "@/constants/mock-data";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Real-time hook that subscribes to both the "projects" and "expenses"
 * Firestore collections, joins them by projectId, and returns a
 * merged Project[] sorted by startDate (newest first).
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let projectDocs: QueryDocumentSnapshot[] = [];
    let expenseDocs: QueryDocumentSnapshot[] = [];
    let gotProjects = false;
    let gotExpenses = false;

    /** Merge project + expense snapshots whenever either updates. */
    function merge() {
      if (!gotProjects || !gotExpenses) return;

      // Group expenses by projectId (numeric)
      const expenseMap = new Map<number, Expense[]>();
      for (const eDoc of expenseDocs) {
        const e = mapExpense(eDoc);
        const list = expenseMap.get(e.projectId) ?? [];
        list.push(e);
        expenseMap.set(e.projectId, list);
      }

      const merged: Project[] = projectDocs.map((pDoc) => {
        const p = mapProject(pDoc);
        const expenses = expenseMap.get(p.projectId) ?? [];
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const currency = expenses.length > 0 ? expenses[0].currency : "USD";
        return { ...p, expenses, totalExpenses, currency };
      });

      // Sort by startDate descending (convert DD/MM/YYYY → ISO for comparison)
      merged.sort((a, b) => {
        const aISO = ddmmyyyyToISO(a.startDate);
        const bISO = ddmmyyyyToISO(b.startDate);
        return bISO.localeCompare(aISO);
      });

      setProjects(merged);
      setLoading(false);
      setError(null);
    }

    const unsubProjects = onSnapshot(
      collection(db, "projects"),
      (snap) => {
        projectDocs = snap.docs;
        gotProjects = true;
        merge();
      },
      (err) => {
        console.error("Firestore projects error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    const unsubExpenses = onSnapshot(
      collection(db, "expenses"),
      (snap) => {
        expenseDocs = snap.docs;
        gotExpenses = true;
        merge();
      },
      (err) => {
        console.error("Firestore expenses error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => {
      unsubProjects();
      unsubExpenses();
    };
  }, []);

  return { projects, loading, error };
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapProject(doc: QueryDocumentSnapshot): Project {
  const d = doc.data();
  return {
    id: doc.id,
    projectId: Number(d.id ?? 0),
    projectName: d.projectName ?? "",
    projectCode: d.projectCode ?? "",
    description: d.description ?? "",
    status: d.status ?? "Active",
    priority: d.priority ?? "Medium",
    budget: Number(d.budget ?? 0),
    manager: d.manager ?? "",
    clientInfo: d.clientInfo ?? null,
    specialRequirements: d.specialRequirements ?? null,
    startDate: d.startDate ?? "",
    endDate: d.endDate ?? "",
    // expenses, totalExpenses, currency are filled by merge()
    expenses: [],
    totalExpenses: 0,
    currency: "USD",
  };
}

function mapExpense(doc: QueryDocumentSnapshot): Expense {
  const d = doc.data();
  return {
    id: doc.id,
    expenseId: Number(d.expenseId ?? 0),
    projectId: Number(d.projectId ?? 0),
    amount: Number(d.amount ?? 0),
    currency: d.currency ?? "USD",
    date: d.date ?? "",
    type: d.type ?? "",
    claimant: d.claimant ?? "",
    description: d.description ?? null,
    location: d.location ?? null,
    paymentMethod: d.paymentMethod ?? "",
    paymentStatus: d.paymentStatus ?? "",
  };
}
