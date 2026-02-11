import { create } from "zustand";

type DraftMap = Record<string, Record<string, unknown>>;

interface EntityDraftState {
  drafts: DraftMap;
  setDraft: (key: string, data: Record<string, unknown>) => void;
  clearDraft: (key: string) => void;
}

export const useEntityDraftStore = create<EntityDraftState>((set) => ({
  drafts: {},

  setDraft: (key, data) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: data,
      },
    })),

  clearDraft: (key) =>
    set((state) => {
      const next = { ...state.drafts };
      delete next[key];
      return { drafts: next };
    }),
}));
