import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function deploySimpleStorage() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bac478c580ee35f462398e11ab4d6a3";
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Deploying SimpleStorage with the account:", wallet.address);

    const simpleStorageArtifactPath = path.resolve(__dirname, "../../../uma-ctf-adapter/out/SimpleStorage.sol/SimpleStorage.json");
    const simpleStorageArtifact = JSON.parse(fs.readFileSync(simpleStorageArtifactPath, "utf8"));

    const SimpleStorageFactory = new ethers.ContractFactory(simpleStorageArtifact.abi, simpleStorageArtifact.bytecode, wallet);

    console.log("Attempting to estimate gas for deployment...");
    let gasEstimate = ethers.toBigInt(95317); // Default from previous successful estimate
    try {
        gasEstimate = await provider.estimateGas(await SimpleStorageFactory.getDeployTransaction());
        console.log("Gas estimate for deployment:", gasEstimate.toString());
    } catch (estimateError: any) {
        console.error("Gas estimation failed (using default):");
        // Continue with default gasEstimate if estimation fails
    }

    console.log("Deploying SimpleStorage...");
    try {
        const deployTransaction = await SimpleStorageFactory.getDeployTransaction();
        
        // Explicitly set gasLimit and gasPrice
        const tx = {
            ...deployTransaction,
            gasLimit: gasEstimate, // Use the estimated gas
            gasPrice: ethers.parseUnits("1", "gwei") // Set a low, fixed gas price (1 Gwei)
        };

        // Send the transaction directly
        const response = await wallet.sendTransaction(tx);
        await response.wait();

        // Get the contract address from the transaction receipt
        const receipt = await provider.getTransactionReceipt(response.hash);
        if (receipt && receipt.contractAddress) {
            console.log("SimpleStorage deployed to:", receipt.contractAddress);
        } else {
            console.log("Deployment transaction sent, but contract address not found in receipt.");
            console.log("Transaction hash:", response.hash);
        }

    } catch (error: any) {
        console.error("Deployment failed:", error.message);
        if (error.data) {
            console.error("Revert data:", error.data);
        }
        if (error.reason) {
            console.error("Revert reason:", error.reason);
        }
        console.error("Full error object:", JSON.stringify(error, null, 2));
        process.exit(1);
    }
}

deploySimpleStorage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
