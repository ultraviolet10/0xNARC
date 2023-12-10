/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google"
import { useCallback, useState } from "react"
import SponsorDropdown from "@/components/SponsorDropdown"
import useStore from "../../store/store"
import { NarcState, Score } from "../../store/type"
import EnterGithubInput from "@/components/EnterGithubInput"
import DisplayResult from "@/components/DisplayResult"
import LoadingSpinner from "@/components/LoadingSpinner"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [scoreObtained, setScoreObtained] = useState<{
    [key: string]: Score
  } | null>(null)
  const [parsing, setParsing] = useState<boolean>(false)

  const narcState = useStore((state) => state.narcState)
  const onTrial = useStore((state) => state.githubUrl)
  const sponsorsSelected = useStore((state) => state.selectedSponsors)
  const changeUIState = useStore((state) => state.setNarcState)

  const handleVerify = useCallback(async () => {
    try {
      // ui loading state
      setParsing(true)

      const requestBody = {
        githubUrl: onTrial,
        usedSponsors: sponsorsSelected,
      }

      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()

      // ui state update
      if (data.result) setScoreObtained(data.result)
      changeUIState(NarcState.RESULT)
    } catch (error) {
      setParsing(false)
      // maybe show toast
      console.error("Error fetching data:", error)
    }
  }, [changeUIState, onTrial, sponsorsSelected])

  const renderUIState = () => {
    switch (narcState) {
      case NarcState.ENTER_GH_URL:
        return <EnterGithubInput /> // Replace with your component
      case NarcState.SELECT_SPONSORS:
        return <SponsorDropdown /> // Example, replace with your actual component
      case NarcState.VERIFY:
        if (!parsing) {
          return (
            <button
              className="flex w-[165px] bg-[#35274E] flex-row items-center justify-center rounded-xl py-2 text-center text-base font-medium text-white shadow-sm hover:bg-[#9C4FFF] hover:text-white"
              onClick={handleVerify}
            >
              Verify
            </button>
          )
        } else {
          return <LoadingSpinner />
        }
      case NarcState.RESULT:
        if (scoreObtained) {
          return <DisplayResult isLoading={false} scores={scoreObtained} />
        }

      case NarcState.AWARD:
        return <div>Award Component</div> // Replace with your component
      default:
        return <div>Default Component</div> // Replace with your component
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start ${inter.className}`}
    >
      <div className="flex flex-col items-center h-screen w-screen">
        <div className="flex flex-col w-full p-16 items-center justify-center">
          <img src="/logo.png" alt="narc logo" className="w-32" />
        </div>
        <div className="relative flex flex-col space-y-20 p-10 h-[500px] w-[800px] items-center justify-center border-[1px] border-gray-600 rounded-xl">
          {onTrial && onTrial !== "" ? (
            <div className="absolute top-10 flex flex-row space-x-1 items-center">
              <span className="text-[20px] text-white">Project URL:</span>
              <a
                href={onTrial}
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                <span className="text-[20px] p-2 rounded-xl bg-blue-500 hover:bg-green-900 cursor-pointer truncate">
                  {onTrial}
                </span>
              </a>
            </div>
          ) : null}
          {sponsorsSelected.length > 0 && (
            <span className="absolute top-10 text-[20px] text-white">
              Sponsor Tracks: {sponsorsSelected.join(", ")}
            </span>
          )}
          <div></div>
          {renderUIState()}
        </div>
      </div>
    </main>
  )
}
