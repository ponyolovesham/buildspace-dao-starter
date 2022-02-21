import React from "react";
import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();

  console.log("address: ", address);
  if (!address) {
    return (
      <div className='landing'>
        <h1>Welcome to PampDAO!</h1>
        <button onClick={() => connectWallet("injected")} className='btn-hero'>
          Connect your wallet
        </button>
      </div>
    );
  }

  return (
    <div className='landing'>
      <h1>Wallet connected!</h1>
    </div>
  );
};

export default App;
