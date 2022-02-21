import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0x48A4d4B1EE2560705ee273f18EcBBbD115F1adF4");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "gogumaDAO Membership",
      description: "DAO for all the goguma lovers",
      image: readFileSync("scripts/assets/goguma.png"),
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();
