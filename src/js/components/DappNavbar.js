import React, { useContext } from "react";
import BlockchainContext from "../../context/BlockchainContext";

function DappNavar() {
  const blockchainContext = useContext(BlockchainContext);
  const { account } = blockchainContext;

  const AddressView = () => (
    <>
      Your're account: {account ? account.substring(0, 6) : undefined}...
      {account
        ? account.substring(account.length - 4, account.length)
        : undefined}
    </>
  );
  return (
    <>
      <div className="dapp-nav-bar">
        <div>
          LNP - DAPP Token Farm
        </div>
        <div>STAKE</div>
        <div>
          <AddressView />
        </div>
      </div>
    </>
  );
}

export default DappNavar;
