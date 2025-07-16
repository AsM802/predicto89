import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function deploy() {
    if (!process.env.RPC_URL) {
        throw new Error("Missing RPC_URL in .env file");
    }
    if (!process.env.PRIVATE_KEY) {
        throw new Error("Missing PRIVATE_KEY in .env file");
    }
    
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Deploying contracts with the account:", wallet.address);

    // Load mock contract artifacts
    const mockCtfArtifactPath = path.resolve(__dirname, "../../../uma-ctf-adapter/out/MockConditionalTokens.sol/MockConditionalTokens.json");
    const mockCtfArtifact = JSON.parse(fs.readFileSync(mockCtfArtifactPath, "utf8"));

    const mockFinderArtifactPath = path.resolve(__dirname, "../../../uma-ctf-adapter/out/MockFinder.sol/MockFinder.json");
    const mockFinderArtifact = JSON.parse(fs.readFileSync(mockFinderArtifactPath, "utf8"));

    // Deploy MockConditionalTokens
    console.log("Deploying MockConditionalTokens...");
    const MockConditionalTokensFactory = new ethers.ContractFactory(mockCtfArtifact.abi, mockCtfArtifact.bytecode, wallet);
    const mockCtf = await MockConditionalTokensFactory.deploy();
    await mockCtf.waitForDeployment();
    const mockCtfAddress = await mockCtf.getAddress();
    console.log("MockConditionalTokens deployed to:", mockCtfAddress);

    // Deploy MockFinder
    console.log("Deploying MockFinder...");
    const MockFinderFactory = new ethers.ContractFactory(mockFinderArtifact.abi, mockFinderArtifact.bytecode, wallet);
    const mockFinder = await MockFinderFactory.deploy();
    await mockFinder.waitForDeployment();
    const mockFinderAddress = await mockFinder.getAddress();
    console.log("MockFinder deployed to:", mockFinderAddress);

    // Deploy UmaCtfAdapter using mock addresses
    const adapterArtifactPath = path.resolve(__dirname, "../../../uma-ctf-adapter/out/UmaCtfAdapter.sol/UmaCtfAdapter.json");
    const adapterArtifact = JSON.parse(fs.readFileSync(adapterArtifactPath, "utf8"));

    const UmaCtfAdapterFactory = new ethers.ContractFactory(adapterArtifact.abi, adapterArtifact.bytecode, wallet);
    
    console.log("Deploying UmaCtfAdapter...");
    const umaCtfAdapter = await UmaCtfAdapterFactory.deploy(mockCtfAddress, mockFinderAddress);
    await umaCtfAdapter.waitForDeployment();
    const adapterAddress = await umaCtfAdapter.getAddress();

    console.log("✅ UmaCtfAdapter deployed to:", adapterAddress);
    console.log("\n\n----------------------------------------------------");
    console.log("IMPORTANT: Please update your .env file with the following line:");
    console.log(`ADAPTER_ADDRESS=${adapterAddress}`);
    console.log("----------------------------------------------------\n\n");
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });