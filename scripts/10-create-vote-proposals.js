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
    const amount = 400_000;
    await voteModule.propose(
      `Should the DAO mint an additional ${amount} tokens into the treasury?`,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "mint",
            [voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log("✅ Successfully created proposal to mint tokens");
  } catch (e) {
    console.error("failed to create first proposal", e);
    process.exit(1);
  }

  try {
    const amount = 6_400;
    await voteModule.propose(
      `Should the DAO transfer ${amount} tokens from the treasury to ${process.env.WALLET_ADDRESS} for being a leader?`,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (e) {
    console.error("failed to create second proposal", e);
  }
})();
