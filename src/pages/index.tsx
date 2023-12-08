import { Inter } from "next/font/google"
import { useCallback, useEffect, useState } from "react"
import { ghUrlCheck } from "@/utils/tool"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [gitUrl, setGitUrl] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false)

  useEffect(() => {
    if (gitUrl) {
      setIsValidUrl(ghUrlCheck(gitUrl))
    }
  }, [gitUrl])

  const handleVerify = useCallback(async () => {
    // api call to server to make openapi request
    // feed in docs, zipped
    // need blob?
    // const data = await fetch("/api/validate")
    // console.log({ data })
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
    >
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col space-y-4 p-10 items-center justify-center">
          <span className="font-white text-[25px]">0xNARC</span>

          <div className="flex flex-col grow items-center justify-center space-y-10">
            <input
              className={
                isValidUrl
                  ? "flex h-[50px] w-[500px] rounded-xl shadow-light-900 p-4 text-black"
                  : "flex h-[50px] w-[500px] rounded-xl shadow-light-900 p-4 text-black border-[1px] border-red-400"
              }
              onChange={(e) => setGitUrl(e.target.value)}
            ></input>
            <button
              className="flex w-[165px] bg-[#35274E] flex-row items-center justify-center rounded-xl py-2 text-center text-base font-medium text-white shadow-sm hover:bg-[#9C4FFF] hover:text-white"
              onClick={handleVerify}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
