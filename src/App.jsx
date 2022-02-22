import React from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x7a65c8A3877052dC3a03021FCb977EB7ef125765"
);

const tokenModule = sdk.getTokenModule(
  "0xb205F6C382301215e1a022ff8d4a90346A583473"
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("address: ", address);

  const signer = provider && provider.getSigner();

  const [hasClaimedNFT, setHasClaimedNFT] = React.useState(false);
  const [isClaiming, setIsClaiming] = React.useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = React.useState({});
  const [memberAddresses, setMemberAddresses] = React.useState([]);

  const shortenAddress = (str) =>
    str.substring(0, 6) + "..." + str.substring(str.length - 4);

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

  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>gogumaDAO Member Page</h1>
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
