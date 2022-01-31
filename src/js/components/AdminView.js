import React, { useContext, useState } from "react";

import BlockchainContext from "../../context/BlockchainContext";
import DisplayContext from "../../context/DisplayContext";

import { Button, FormControl, Container } from "react-bootstrap";

function AdminView() {
  const blockchainContext = useContext(BlockchainContext);
  const displayContext = useContext(DisplayContext);
  const { addRewards } = blockchainContext;
  const { dappTokenBalance } = displayContext;

  const handleOnClick = () => {
    addRewards();
  }

  return (
    <>
      <Container className="square inner-container">
        <br />
        Admin :: Add DAPP Token Rewards
        <hr />
        <br />
        Amount
        <br />
        <div className="label-above-button">
          Available DAPP balance to transfer: {dappTokenBalance}
        </div>
        <div className="input-button-container">
          <FormControl placeholder="Amount" />
        </div>
        <br /> <hr />
        <br />
        Duration (in days) <br />
        <div className="input-button-container">
          <FormControl placeholder="Days" />
        </div>
        <br />
        <hr />
        <div className="button-stretch">
          <br />
          <Button variant="success" onClick={handleOnClick}>ADD</Button>
          <br />
        </div>
        <br />
      </Container>
    </>
  );
}

export default AdminView;
