import { create } from "zustand"
import { SponsorState, NarcState } from "./type"

const useStore = create<SponsorState>((set) => ({
  sponsors: [],
  selectedSponsors: [],
  narcState: NarcState.ENTER_GH_URL,
  githubUrl: null,
  score: null,

  addSponsor: (sponsor) =>
    set((state) => ({ sponsors: [...state.sponsors, sponsor] })),
  removeSponsor: (sponsor) =>
    set((state) => ({ sponsors: state.sponsors.filter((s) => s !== sponsor) })),

  selectSponsor: (sponsor) =>
    set((state) => ({
      selectedSponsors: state.selectedSponsors.includes(sponsor)
        ? state.selectedSponsors.filter((s) => s !== sponsor)
        : [...state.selectedSponsors, sponsor],
    })),

  clearSelectedSponsors: () => set({ selectedSponsors: [] }),

  // set UI states
  setNarcState: (narcState: NarcState) =>
    set((state) => ({ ...state, narcState })),

  // set github URL
  setGithubUrl: (githubUrl: string) =>
    set((state) => ({ ...state, githubUrl })),

  // set score value from AI agent
  setScore: (score: number) => set((state) => ({ ...state, score })),
}))

export default useStore
