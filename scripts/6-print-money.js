import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xb205F6C382301215e1a022ff8d4a90346A583473"
);

(async () => {
  try {
    const amount = 1_000_000;
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    console.log(
      "✅ there now is: ",
      ethers.utils.formatUnits(totalSupply, 18),
      "$GOGUMA tokens in circulation"
    );
  } catch (error) {
    console.log("failed to print money", error);
  }
})();
