import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x7a65c8a3877052dc3a03021fcb977eb7ef125765"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Le milk",
        description: "Milk for the goguma ",
        image: readFileSync("scripts/assets/milk.png"),
      },
    ]);

    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
