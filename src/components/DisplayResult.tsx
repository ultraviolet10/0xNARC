import React, { useEffect } from "react"

interface DisplayResultProps {
  isLoading: boolean
  score: number
}

const DisplayResult: React.FC<DisplayResultProps> = ({ isLoading, score }) => {
  return (
    <>
      {!isLoading ? null : (
        <div className="flex flex-col space-y-20 p-10 h-[400px] items-center justify-center rounded-xl">
          <span className="font-white text-[18px] text-center">{`Here's the tabulated results:`}</span>
          <span className="font-white text-[25px]">{score}</span>
        </div>
      )}
    </>
  )
}

export default DisplayResult
