export enum NarcState {
  ENTER_GH_URL = "ENTER_GH_URL",
  SELECT_SPONSORS = "SELECT_SPONSORS",
  VERIFY = "VERIFY",
  RESULT = "RESULT",
  AWARD = "AWARD",
}

export interface SponsorState {
  sponsors: string[]
  selectedSponsors: string[]
  narcState: NarcState
  githubUrl: string|null
  addSponsor: (sponsor: string) => void
  removeSponsor: (sponsor: string) => void
  selectSponsor: (sponsor: string) => void
  clearSelectedSponsors: () => void
  setNarcState: (narcState: NarcState) => void
  setGithubUrl: (githubUrl: string) => void
}
