export enum NarcState {
  ENTER_GH_URL = "ENTER_GH_URL",
  SELECT_SPONSORS = "SELECT_SPONSORS",
  VERIFY = "VERIFY",
  RESULT = "RESULT",
  AWARD = "AWARD",
}

export interface StoreState {
  sponsors: string[]
  selectedSponsors: string[]
  narcState: NarcState
  githubUrl: string | null
  score: number | null
  addSponsor: (sponsor: string) => void
  removeSponsor: (sponsor: string) => void
  selectSponsor: (sponsor: string) => void
  clearSelectedSponsors: () => void
  setNarcState: (narcState: NarcState) => void
  setGithubUrl: (githubUrl: string) => void
  setScore: (score: number) => void
}

export type QualitativeScore = {
  score: number
  qualitative: string
}

export type Score = {
  [key: string]: QualitativeScore
}
