import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// gov contract
const voteModule = sdk.getVoteModule(
  "0xbc9E8bFf6a7365D05B234AD4D390E655738D65F7"
);

// erc-20 contract
const tokenModule = sdk.getTokenModule(
  "0xb205F6C382301215e1a022ff8d4a90346A583473"
);

(async () => {
  try {
    await tokenModule.grantRole("minter", voteModule.address);
    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (e) {
    console.error("failed to grant vote module permissions on token module", e);
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // get 90% of the supply i'm holding
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const ninetyPercentOfOwned = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(voteModule.address, ninetyPercentOfOwned);

    console.log("✅ Successfully transferred tokens to vote module");
  } catch (e) {
    console.error("failed to transfer tokens to vote module", e);
  }
})();
