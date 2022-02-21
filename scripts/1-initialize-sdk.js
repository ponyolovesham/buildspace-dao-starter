import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";
import dotenv from "dotenv";
dotenv.config();

const { PRIVATE_KEY, ALCHEMY_API_URL, WALLET_ADDRESS } = process.env;

if (!PRIVATE_KEY) {
  console.log("private key not found");
}

if (!ALCHEMY_API_URL) {
  console.log("alchemy api key not found");
}

if (!WALLET_ADDRESS) {
  console.log("wallet address not found");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(PRIVATE_KEY, ethers.getDefaultProvider(ALCHEMY_API_URL))
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is: ", apps[0].address);
  } catch (err) {
    console.log("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

export default sdk;
