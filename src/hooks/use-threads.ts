"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ThreadInterface } from "~/types/thread";

export function useThreads(userId: string, search: string = "") {
  // For now, let's use a simpler approach that matches the reactive nature of Convex
  // We can use the paginated query but for simplicity of migration let's just use the list
  const result = useQuery(api.threads.listThreadsPaginated, {
    userId,
    term: search || undefined,
    paginationOpts: { numItems: 50, cursor: null },
  });

  const threads: ThreadInterface[] = (result?.page || []).map((t: any) => ({
    id: t.id,
    title: t.title || "Untitled",
    model: t.model,
    status: t.status,
    pinned: t.pinned ?? false,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    userId: t.userId,
  }));

  return {
    results: threads,
    status: result === undefined ? "LoadingFirstPage" : "Idle",
    loadMore: () => {}, // TODO: Implement real pagination if needed
  };
}
