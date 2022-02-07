import React, { useContext } from "react";
import BlockchainContext from "../../context/BlockchainContext";

function DappNavar() {
  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts } = blockchainContext;

  const AddressView = () => (
    <>
      Connected: {accounts ? accounts[0].substring(0, 6) : undefined}...
      {accounts
        ? accounts[0].substring(accounts[0].length - 4, accounts[0].length)
        : undefined}
    </>
  );
  return (
    <>
      <div className="dapp-nav-bar">
        <div>LNP - DAPP Token Farm</div>
        <div>STAKE</div>
        <div>{web3 ? <AddressView /> : "Not connected"}</div>
      </div>
    </>
  );
}

export default DappNavar;
