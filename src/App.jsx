import React from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x7a65c8A3877052dC3a03021FCb977EB7ef125765"
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("address: ", address);

  const signer = provider && provider.getSigner();

  const [hasClaimedNFT, setHasClaimedNFT] = React.useState(false);
  const [isClaiming, setIsClaiming] = React.useState(false);

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
        <h1>Goguma luvers</h1>
        <p>welcome!</p>
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
