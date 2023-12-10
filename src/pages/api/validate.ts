// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"
import fs from "fs"
import { pipeline, Readable } from "stream"
import { promisify } from "util"
import JSZip from "jszip"
import { createWriteStream } from "fs"
import { sponsorList } from "../../utils/sponsorlist"
import { ethers } from "ethers";

type Data = {
  result: any
}

export default async function handler(
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

  const githubUrl = req.body.githubUrl
  const downloadUrl = githubUrl + "/archive/refs/heads/main.zip"
  const projectName = githubUrl.split("/")[4]
  console.log(`Step 0: Analysing ${projectName}`)
  // fetch download url
  await download(downloadUrl, "temp/" + projectName + ".zip")

  // combines code .zip into single .text based on priority filetypes
  let code = await combinator(
    "temp/" + projectName + ".zip",
    "temp/" + projectName + ".txt"
  )
  // get sponsor specific prompt and send to openai
  let sponsorResponses: { [key: string]: any } = {}
  const selectedSponsors: string[] = req.body.usedSponsors
  console.log({ selectedSponsors })
  for (const sponsor of selectedSponsors) {
    const result = await evaluateProject(sponsor, code);
    const resultQualitative = await evaluateProject(sponsor, code, true);
    
    sponsorResponses[sponsor] = {
      score: result,
      qualitative: resultQualitative,
    }
  }

  // at some point mint an nft of the resulting score (mantle and base)
  const mint_wallet = req.body.mint_wallet || '0xB587Be5607CEDdDc6049E7Ad5EcF6523916A0868';
  if(process.env.DEPLOYER_WALLET_PRIVATE_KEY)
    mintNFT(mint_wallet)
  res.status(200).json({ result: sponsorResponses })
}

const streamPipeline = promisify(pipeline)

async function download(url: string, outputPath: string) {
  try {
    console.log(`Step 0.5: Downloading project zip ${url}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`)
    }

    // Assuming response.body is a Node.js stream (which it should be in node-fetch)
    const nodeStream = response.body as NodeJS.ReadableStream

    await streamPipeline(nodeStream, createWriteStream(outputPath))
    console.log(`Step 1: Downloaded ${url} to ${outputPath}`)
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
      fileName.endsWith(".md") ||
      fileName.endsWith(".sol") ||
      fileName.endsWith(".js") ||
      fileName.endsWith(".jsx") ||
      fileName.endsWith(".ts") ||
      fileName.endsWith(".tsx") ||
      fileName.endsWith(".rs") ||
      fileName.endsWith(".py")
    ) {
      let fileData = await file.async("string")

      // get first 20 lines of code
      fileData = fileData.split("\n").slice(0, 20).join("\n")

      combinedCode += fileName + ": \n"
      combinedCode += fileData + " \n"
    }
  }

  // Write the combined code to code.txt using promises
  await fs.promises.writeFile(outputPath, combinedCode)
  console.log(`Step 2: Combined code from ${inputPath} to ${outputPath}`)
  return combinedCode
}

function getSponsorEvalPrompt(sponsorName: string) {
  if (sponsorName) {
    const filePath = `sponsors/${sponsorName}_ETHIndia2023.txt`
    try {
      const prompt = fs.readFileSync(filePath, "utf8")
      return prompt
    } catch (error) {
      console.error(`Error reading file ${filePath}: ${error}`)
      return undefined
    }
  } else {
    console.error(`Sponsor with name ${sponsorName} not found.`)
    return undefined
  }
}

async function evaluateProject(
  sponsorName: string,
  code: string,
  qualitative = false
) {
  let prompt = getSponsorEvalPrompt(sponsorName)
  // @todo send to openai
  console.log("Step 3: Sending to OpenAI Codex")
  code = code.slice(0, 10000)
  prompt = prompt?.slice(0, 1000)
  let resultScore = await callOpenAIChat(
    qualitative
      ? `You are an evaluation assistant for a hackathon. Projects are to demonstrate creative use of the provided SDKs from sponsors and build a blockchain project. Do not look for usage of the OpenAI api. You are to use the provided sponsor requirements to judge the codebase and find instances when the sponsor product is used in the code. Respond with a list of code instances that use the sponsor product.`
      : `You are an evaluation judge for a hackathon. Projects are to demonstrate creative use of the provided SDKs from ${sponsorName} in a blockchain project. You are to use the provided Prize qualification requirements to judge the project and provide a score from 1-10. Respond with only the number score. Give the project a point for every use of ${sponsorName}.`,
    `Sponsor Company: ${sponsorName} \n Prize qualification requirements: \n ${prompt} \n\n\n Submitted code to evaluate:${code} \n Your score:`
  )

  console.log(`Step 4: ${resultScore}`)
  // @todo return score
  return resultScore
}

// call chat
function callOpenAIChat(systemPrompt: string, userInput: string) {
  return new Promise((resolve, reject) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY // Make sure to set your API key in the environment variables
    console.log(`prompt length ${systemPrompt.length} ${userInput.length}`)
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      max_tokens: 100,
    }

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data)
        let responseScore = data.choices[0].message.content
        resolve(responseScore) // Resolve the promise with the response score
      })
      .catch((error) => {
        console.error("Error:", error)
        reject(error) // Reject the promise in case of an error
      })
  })
}


// Define the contract ABI
const contractABI = [
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
  // ... include other contract methods if needed
];

// Set up your contract's address and the Goerli network URL
const contractAddress = '0xB587Be5607CEDdDc6049E7Ad5EcF6523916A0868';
const url = 'https://goerli.base.org';

// Create a provider connected to the Goerli testnet
const provider = new ethers.JsonRpcProvider(url);

// Your private key (keep it secure!)
// let mnemonicWallet = ethers.Wallet.fromPhrase(process.env.DEPLOYER_WALLET_PRIVATE_KEY || '');
const privateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY || '';
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Define the recipient address for minting
// const recipientAddress = 'RECIPIENT_ADDRESS';

// Call the safeMint function
async function mintNFT(recipientAddress: string) {
  try {
      const tx = await contract.safeMint(recipientAddress);
      await tx.wait();
      console.log('NFT minted successfully:', tx);
  } catch (error) {
      console.error('Minting failed:', error);
  }
}
