import React from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import { UnsupportedChainIdError } from "@web3-react/core";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x7a65c8A3877052dC3a03021FCb977EB7ef125765"
);

const tokenModule = sdk.getTokenModule(
  "0xb205F6C382301215e1a022ff8d4a90346A583473"
);

const voteModule = sdk.getVoteModule(
  "0xbc9E8bFf6a7365D05B234AD4D390E655738D65F7"
);

const App = () => {
  const { connectWallet, address, provider, error } = useWeb3();

  const signer = provider && provider.getSigner();

  const [hasClaimedNFT, setHasClaimedNFT] = React.useState(false);
  const [isClaiming, setIsClaiming] = React.useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = React.useState({});
  const [memberAddresses, setMemberAddresses] = React.useState([]);
  const [proposals, setProposals] = React.useState([]);
  const [isVoting, setIsVoting] = React.useState(false);
  const [hasVoted, setHasVoted] = React.useState(false);

  const shortenAddress = (str) =>
    str.substring(0, 6) + "..." + str.substring(str.length - 4);

  React.useEffect(() => {
    (async () => {
      if (!hasClaimedNFT) {
        return;
      }

      try {
        const proposals = await voteModule.getAll();
        setProposals(proposals);

        console.log("🌈 Proposals:", proposals);
      } catch (e) {
        console.log("failed to get proposals", e);
      }
    })();
  }, [hasClaimedNFT]);

  React.useEffect(() => {
    (async () => {
      if (!hasClaimedNFT) {
        return;
      }

      if (!proposals.length) {
        return;
      }

      try {
        const hasVoted = await voteModule.hasVoted(
          proposals[0].proposalId,
          address
        );
        if (hasVoted) {
          console.log("user already voted");
        } else {
          console.log("user has not voted yet");
        }
      } catch (e) {
        console.error("Failed to check if wallet has voted", e);
      }
    })();
  }, [hasClaimedNFT, proposals, address]);

  React.useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    (async () => {
      try {
        const memberAddresses = await bundleDropModule.getAllClaimerAddresses(
          "0"
        );
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    })();
  }, [hasClaimedNFT]);

  React.useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    (async () => {
      try {
        const amounts = await tokenModule.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("failed to get token amounts", error);
      }
    })();
  }, [hasClaimedNFT]);

  const memberList = React.useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  React.useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  React.useEffect(() => {
    (async () => {
      if (!address) {
        return;
      }

      const balance = await bundleDropModule.balanceOf(address, "0");

      try {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      }
    })();
  }, [address]);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className='unsupported-network'>
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className='landing'>
        <h1>Welcome to gogumaDAO!</h1>
        <button onClick={() => connectWallet("injected")} className='btn-hero'>
          Connect your wallet
        </button>
      </div>
    );
  }

  // if (hasClaimedNFT) {
  //   return (
  //     <div className='member-page'>
  //       <h1>gogumaDAO Member Page</h1>
  //       <p>Congratulations on being a member</p>
  //       <div>
  //         <div>
  //           <h2>Member List</h2>
  //           <table className='card'>
  //             <thead>
  //               <tr>
  //                 <th>Address</th>
  //                 <th>Token Amount</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {memberList.map((member) => {
  //                 return (
  //                   <tr key={member.address}>
  //                     <td>{shortenAddress(member.address)}</td>
  //                     <td>{member.tokenAmount}</td>
  //                   </tr>
  //                 );
  //               })}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>🍠 DAO Member Dashboard</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className='card'>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}>
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className='card'>
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type='radio'
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type='submit'>
                {isVoting
                  ? "Voting..."
                  : hasVoted
                  ? "You Already Voted"
                  : "Submit Votes"}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  }

  async function mintNFT() {
    setIsClaiming(true);

    try {
      await bundleDropModule.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    } catch (error) {
      console.log("failed to claim", error);
    } finally {
      setIsClaiming(false);
    }
  }

  return (
    <div className='landing'>
      <h1>Min your free goguma membership NFT!</h1>
      <button disabled={isClaiming} onClick={mintNFT}>
        {isClaiming ? "Minting..." : "Mint"}
      </button>
    </div>
  );
};

export default App;
