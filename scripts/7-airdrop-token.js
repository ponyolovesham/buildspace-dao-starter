import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0x7a65c8a3877052dc3a03021fcb977eb7ef125765"
);
const tokenModule = sdk.getTokenModule(
  "0xb205F6C382301215e1a022ff8d4a90346A583473"
);

(async () => {
  try {
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

    if (!walletAddresses.length) {
      console.log("No NFTs have been claimed yet");
      process.exit(0);
    }

    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✅ airdropping", randomAmount, "tokens to", address);
      const airdropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };

      return airdropTarget;
    });
    console.log("🌈 Starting airdrop...");
    await tokenModule.transferBatch(airdropTargets);
    console.log(
      `✅ Successfully airdropped ${airdropTargets
        .map(({ amount }) => amount)
        .reduce((acc, el) => acc + el)} tokens to ${
        airdropTargets.length
      } holders of the NFT!`
    );
  } catch (error) {
    console.error("failed to airdrop tokens", error);
  }
})();
