// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import fetch from 'node-fetch';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import JSZip from 'jszip';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // craft openai response query
  // input: github repo url
  const githubUrl = githubRepos[0]; // req.body.githubUrl;
  const downloadUrl = githubUrl + "/archive/refs/heads/main.zip";

  // fetch download url
  download(downloadUrl, "temp/" + githubUrl.split("/")[4] + ".zip");

  // combinator 
  combinator("temp/" + githubUrl.split("/")[4] + ".zip");
  // send to openai

  res.status(200).json({ name: "John Doe" })
}

// https://github.com/search?q=ethindia%202023&type=repositories
let githubRepos = [
  "https://github.com/abhishek0405/ETHINDIA2023",
  "https://github.com/shreyash-agrawal/ETHIndia2023",
  "https://github.com/kaushikc44/ethindia2023",
  "https://github.com/akashvana/bask3ts",
  "https://github.com/amey-g/bask3ts",
  "https://github.com/iamtanay7/BookSwap-ETHIndia2023",
];


const streamPipeline = promisify(pipeline);

async function download(url: string, outputPath: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`);
    }

    await streamPipeline(response.body, fs.createWriteStream(outputPath));
    console.log(`Downloaded ${url} to ${outputPath}`);
  } catch (error) {
    console.error(`Failed to download ${url}: ${error}`);
  }
}

async function combinator(inputPath: string) {
  // Read the zip file using promises
  const data = await fs.promises.readFile(inputPath);
  const zip = await JSZip.loadAsync(data);

  let combinedCode = '';

  // Process each file in the zip
  for (const [fileName, file] of Object.entries(zip.files)) {
      if (fileName.endsWith('.sol') || fileName.endsWith('.js') || fileName.endsWith('.py')) {
          const fileData = await file.async('string');
          combinedCode += fileData + '\n';
      }
  }

  // Write the combined code to code.txt using promises
  await fs.promises.writeFile('code.txt', combinedCode);
}