import React, { useEffect, useRef, useState } from "react"
import { sponsorList } from "../utils/sponsorlist"
import useStore from "../../store/store"
import { NarcState } from "../../store/type"

const SponsorDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedSponsors, selectSponsor } = useStore()

  const changeUIState = useStore((state) => state.setNarcState)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [dropdownRef, isOpen])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (sponsor: string) => {
    selectSponsor(sponsor)
  }

  const selectedSponsorsText =
    selectedSponsors.length > 0 ? selectedSponsors.join(", ") : "--"

  return (
    <div className="relative flex flex-col space-y-4 items-center">
      <span className="text-white text-[18px]">Select Sponsor Tracks:</span>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-white w-[400px] border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {selectedSponsorsText}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 h-[200px] overflow-y-auto overscroll-none bg-white border border-gray-300 rounded-md shadow-lg text-black"
        onMouseLeave={toggleDropdown}>
          {sponsorList.map((sponsor, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(sponsor)}
            >
              {sponsor}
            </div>
          ))}
        </div>
      )}
      <button
        className="flex w-[165px] bg-[#35274E] flex-row items-center justify-center rounded-xl py-2 text-center text-base font-medium text-white shadow-sm hover:bg-[#9C4FFF] hover:text-white"
        onClick={() => {
          changeUIState(NarcState.VERIFY)
        }}
      >
        Done
      </button>
    </div>
  )
}

export default SponsorDropdown
