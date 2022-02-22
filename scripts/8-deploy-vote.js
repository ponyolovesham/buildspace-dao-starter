import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0x48A4d4B1EE2560705ee273f18EcBBbD115F1adF4"
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "gogumaDAO proposals",
      votingTokenAddress: "0xb205F6C382301215e1a022ff8d4a90346A583473",
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address
    );
  } catch (error) {
    console.error("failed to deploy vote module", error);
  }
})();
