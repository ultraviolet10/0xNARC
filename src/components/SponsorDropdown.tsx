import React, { useEffect, useRef, useState } from "react"
import { sponsorList } from "../utils/sponsorList"
import useStore from "../../store/store"

const SponsorDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { sponsors, selectedSponsors, selectSponsor } = useStore()

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
    selectedSponsors.length > 0
      ? selectedSponsors.join(", ")
      : "Select Sponsors"

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-white w-[400px] border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {selectedSponsorsText}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg text-black">
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
    </div>
  )
}

export default SponsorDropdown
