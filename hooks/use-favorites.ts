import { db } from "@/app/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Firestore-backed favorites.
 *
 * Collection: `user_favorites`
 * Document ID = project Firestore doc ID (e.g. "DSDA", "PRJ-002")
 * Fields:     { projectDocId, createdAt }
 *
 * Because this is a user-facing hybrid app (no auth yet), all favorites
 * are stored in a single shared collection. When auth is added later,
 * the collection path can be changed to `users/{uid}/favorites`.
 */
const FAV_COLLECTION = "user_favorites";

export function useFavorites() {
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, FAV_COLLECTION),
      (snap) => {
        const ids = new Set<string>(snap.docs.map((d) => d.id));
        setFavIds(ids);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore user_favorites error:", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  /** Toggle a project's favorite status in Firestore. */
  const toggleFavorite = async (projectDocId: string) => {
    const ref = doc(db, FAV_COLLECTION, projectDocId);
    if (favIds.has(projectDocId)) {
      // Optimistic UI
      setFavIds((prev) => {
        const next = new Set(prev);
        next.delete(projectDocId);
        return next;
      });
      await deleteDoc(ref);
    } else {
      setFavIds((prev) => new Set(prev).add(projectDocId));
      await setDoc(ref, {
        projectDocId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const isFavorite = (projectDocId: string) => favIds.has(projectDocId);

  return { favIds, loading, toggleFavorite, isFavorite };
}
