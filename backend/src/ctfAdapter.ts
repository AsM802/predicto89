
import { ethers } from "ethers";
import * as UmaCtfAdapter from "../../../uma-ctf-adapter/out/UmaCtfAdapter.sol/UmaCtfAdapter.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable not set");
}
const signer = new ethers.Wallet(privateKey, provider);

const adapterAddress = process.env.ADAPTER_ADDRESS;
if (!adapterAddress) {
    throw new Error("ADAPTER_ADDRESS environment variable not set");
}
const adapterContract = new ethers.Contract(adapterAddress, UmaCtfAdapter.abi, signer);

export const initializeMarket = async (marketData: {
    ancillaryData: string;
    rewardToken: string;
    reward: ethers.BigNumberish;
    proposalBond: ethers.BigNumberish;
    liveness: ethers.BigNumberish;
}) => {
    try {
        // Validate rewardToken as an Ethereum address
        if (!ethers.isAddress(marketData.rewardToken)) {
            throw new Error("Invalid rewardToken address provided.");
        }

        const encodedAncillaryData = ethers.hexlify(ethers.toUtf8Bytes(marketData.ancillaryData));

        const tx = await adapterContract.initialize(
            encodedAncillaryData,
            marketData.rewardToken,
            marketData.reward,
            marketData.proposalBond,
            marketData.liveness
        );
        await tx.wait();
        console.log("Market initialized:", tx.hash);
    } catch (error: unknown) {
        console.error("Error initializing market:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to initialize market: ${error.message}`);
        } else {
            throw new Error("Failed to initialize market: An unknown error occurred.");
        }
    }
};

export const resolveMarket = async (marketId: string) => {
    try {
        const tx = await adapterContract.resolve(marketId);
        await tx.wait();
        console.log("Market resolved:", tx.hash);
    } catch (error: unknown) {
        console.error("Error resolving market:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to resolve market: ${error.message}`);
        } else {
            throw new Error("Failed to resolve market: An unknown error occurred.");
        }
    }
};
