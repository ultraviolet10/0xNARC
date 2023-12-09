import { Inter } from "next/font/google"
import { useCallback } from "react"
import SponsorDropdown from "@/components/SponsorDropdown"
import useStore from "../../store/store"
import { NarcState } from "../../store/type"
import EnterGithubInput from "@/components/EnterGithubInput"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const narcState = useStore((state) => state.narcState)

  const handleVerify = useCallback(async () => {
    const data = await fetch("/api/validate")
    console.log({ data })
  }, [])

  const renderUIState = () => {
    switch (narcState) {
      case NarcState.ENTER_GH_URL:
        return <EnterGithubInput /> // Replace with your component
      case NarcState.SELECT_SPONSORS:
        return <SponsorDropdown /> // Example, replace with your actual component
      case NarcState.VERIFY:
        return <div>Verification Component</div> // Replace with your component
      case NarcState.RESULT:
        return <div>Result Display Component</div> // Replace with your component
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
        <div className="flex flex-row w-full p-16 items-center justify-center">
          <span className="font-white text-[25px]">0xNARC</span>
        </div>
        <div className="flex flex-col space-y-20 p-10 h-[400px] items-center justify-center border-[1px] border-gray-600 rounded-xl">
          {renderUIState()}
        </div>
      </div>
    </main>
  )
}
