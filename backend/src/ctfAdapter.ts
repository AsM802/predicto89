
import { ethers } from "ethers";
import * as UmaCtfAdapter from "../../../uma-ctf-adapter/out/UmaCtfAdapter.sol/UmaCtfAdapter.json";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
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
        const tx = await adapterContract.initialize(
            marketData.ancillaryData,
            marketData.rewardToken,
            marketData.reward,
            marketData.proposalBond,
            marketData.liveness
        );
        await tx.wait();
        console.log("Market initialized:", tx.hash);
    } catch (error) {
        console.error("Error initializing market:", error);
        throw new Error("Failed to initialize market");
    }
};

export const resolveMarket = async (marketId: string) => {
    try {
        const tx = await adapterContract.resolve(marketId);
        await tx.wait();
        console.log("Market resolved:", tx.hash);
    } catch (error) {
        console.error("Error resolving market:", error);
        throw new Error("Failed to resolve market");
    }
};
