import { db } from "@/app/firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

/** Shape of the data the form collects (excluding auto-generated fields). */
export interface NewExpenseData {
  projectId: number;
  amount: number;
  currency: string;
  /** DD/MM/YYYY */
  date: string;
  type: string;
  claimant: string;
  description: string;
  location: string;
  paymentMethod: string;
  paymentStatus: string;
}

/**
 * Write a new expense document to the Firestore "expenses" collection.
 *
 * The document schema matches the one used by the Admin (Kotlin) app so
 * the existing `useProjects` real-time listener picks it up automatically.
 *
 * @returns The Firestore document ID of the newly created expense.
 */
export async function addExpense(data: NewExpenseData): Promise<string> {
  // Use timestamp-based ID to avoid collisions with admin-generated IDs
  const expenseId = Date.now();

  const docRef = await addDoc(collection(db, "expenses"), {
    expenseId,
    projectId: data.projectId,
    amount: data.amount,
    currency: data.currency,
    date: data.date,
    type: data.type,
    claimant: data.claimant,
    description: data.description || null,
    location: data.location || null,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
  });

  return docRef.id;
}

/**
 * Update an existing expense document in Firestore.
 *
 * @param docId  The Firestore document ID (e.g. "10_10").
 * @param data   The fields to overwrite.
 */
export async function updateExpense(
  docId: string,
  data: Partial<NewExpenseData>,
): Promise<void> {
  const ref = doc(db, "expenses", docId);
  await updateDoc(ref, {
    ...data,
    description: data.description || null,
    location: data.location || null,
  });
}
