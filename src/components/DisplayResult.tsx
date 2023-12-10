import React, { useEffect, useState } from "react"
import { Score } from "../../store/type"

interface DisplayResultProps {
  isLoading: boolean
  scores: { [key: string]: Score } | null
}

const DisplayResult: React.FC<DisplayResultProps> = ({ isLoading, scores }) => {
  const [renderScore, setRenderScore] = useState<boolean>(false)

  useEffect(() => {
    if (scores !== null) setRenderScore(true)
  }, [scores])

  return (
    <>
      {!isLoading && renderScore ? (
        <div className="flex flex-col space-y-20 h-[400px] overflow-y-auto overflow-none items-center justify-center rounded-xl">
          <span className="font-white text-[18px] text-center">
            {"Here's the tabulated results:"}
          </span>
          {scores &&
            Object.entries(scores).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <span className="font-bold">{key}</span>
                <div className="pl-2">
                  <span className="text-purple-500">{value.score as any}</span>
                  <span>{` - ${value.qualitative}`}</span>
                </div>
              </div>
            ))}
        </div>
      ) : null}
    </>
  )
}

export default DisplayResult
