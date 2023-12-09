import React, { useCallback, useEffect, useState } from "react"
import { ghUrlCheck } from "@/utils/tool"
import useStore from "../../store/store"
import { NarcState } from "../../store/type"

const EnterGithubInput = () => {
  const [gitUrl, setGitUrl] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true)

  const setGithubUrl = useStore((state) => state.setGithubUrl)
  const changeUIState = useStore((state) => state.setNarcState)

  useEffect(() => {
    if (gitUrl !== null && gitUrl !== "") {
      setIsValidUrl(ghUrlCheck(gitUrl))
    }
  }, [gitUrl])

  const handleSubmit = useCallback(async () => {
    // store
    if (gitUrl) setGithubUrl(gitUrl)
    changeUIState(NarcState.SELECT_SPONSORS)
  }, [changeUIState, gitUrl, setGithubUrl])

  return (
    <>
      <div className="flex flex-col space-y-20 p-10 h-[400px] items-center justify-center rounded-xl">
        <span className="font-white text-[18px] text-center">
          a validator tool for hackathon submissions
          <br />
          created with ❤️ for ETHGlobal
        </span>
        <div className="flex flex-col w-full space-y-4">
          <span className="text-white text-[15px] text-center">
            enter github URL
          </span>
          <input
            className={`"flex h-[50px] w-[500px] rounded-xl shadow-light-900 p-4 text-black focus:outline-none border-[1px] ${
              isValidUrl ? "border-green-600" : "border-red-600"
            }`}
            onChange={(e) => setGitUrl(e.target.value)}
          ></input>
        </div>
        <button
          className="flex w-[165px] bg-[#35274E] flex-row items-center justify-center rounded-xl py-2 text-center text-base font-medium text-white shadow-sm hover:bg-[#9C4FFF] hover:text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {/* <SponsorDropdown /> */}
      {/* <button
        className="flex w-[165px] bg-[#35274E] flex-row items-center justify-center rounded-xl py-2 text-center text-base font-medium text-white shadow-sm hover:bg-[#9C4FFF] hover:text-white"
        onClick={handleVerify}
      >
        Verify
      </button> */}
    </>
  )
}

export default EnterGithubInput
