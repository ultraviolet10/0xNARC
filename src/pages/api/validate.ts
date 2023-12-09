// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"
import fs from "fs"
import { pipeline, Readable } from "stream"
import { promisify } from "util"
import JSZip from "jszip"
import { createWriteStream } from "fs"

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // craft openai response query
  // input: github repo url
  // https://github.com/search?q=ethindia%202023&type=repositories
  let githubRepos = [
    "https://github.com/abhishek0405/ETHINDIA2023",
    "https://github.com/shreyash-agrawal/ETHIndia2023",
    "https://github.com/kaushikc44/ethindia2023",
    "https://github.com/akashvana/bask3ts",
    "https://github.com/amey-g/bask3ts",
    "https://github.com/iamtanay7/BookSwap-ETHIndia2023",
  ]

  const githubUrl = githubRepos[0] // req.body.githubUrl;
  const downloadUrl = githubUrl + "/archive/refs/heads/main.zip"
  const projectName = githubUrl.split("/")[4]
  // fetch download url
  download(downloadUrl, "temp/" + projectName + ".zip")

  // combinator
  combinator("temp/" + projectName + ".zip", "temp/" + projectName + ".txt")
  // send to openai

  res.status(200).json({ name: "John Doe" })
}

const streamPipeline = promisify(pipeline)

async function download(url: string, outputPath: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`)
    }

    // Assuming response.body is a Node.js stream (which it should be in node-fetch)
    const nodeStream = response.body as NodeJS.ReadableStream

    await streamPipeline(nodeStream, createWriteStream(outputPath))
    console.log(`Downloaded ${url} to ${outputPath}`)
  } catch (error) {
    console.error(`Failed to download ${url}: ${error}`)
  }
}

// @todo move to util
async function combinator(inputPath: string, outputPath: string) {
  // Read the zip file using promises
  const data = await fs.promises.readFile(inputPath)
  const zip = await JSZip.loadAsync(data)

  let combinedCode = ""

  // Process each file in the zip
  for (const [fileName, file] of Object.entries(zip.files)) {
    if (
      fileName.endsWith(".sol") ||
      fileName.endsWith(".js") ||
      fileName.endsWith(".py")
    ) {
      const fileData = await file.async("string")
      combinedCode += fileData + "\n"
    }
  }

  // Write the combined code to code.txt using promises
  await fs.promises.writeFile(outputPath, combinedCode)
}
