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

          <input
            className={
              isValidUrl
                ? "flex h-[50px] w-[500px] rounded-xl shadow-light-900 p-4 text-black"
                : "flex h-[50px] w-[500px] rounded-xl shadow-light-900 p-4 text-black border-[1px] border-red-400"
            }
            onChange={(e) => setGitUrl(e.target.value)}
            onClick={handleVerify}
          ></input>
        </div>
      </div>
    </main>
  )
}
