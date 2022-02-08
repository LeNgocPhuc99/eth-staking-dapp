import React, { useContext, useState } from "react";

import BlockchainContext from "../../context/BlockchainContext";
import DisplayContext from "../../context/DisplayContext";

import { Button, Form, Container } from "react-bootstrap";

function AdminView() {
  const blockchainContext = useContext(BlockchainContext);
  const displayContext = useContext(DisplayContext);
  const { web3, accounts, tokenFarmContract, dappTokenContract } =
    blockchainContext;
  const { userInfo, refreshUserInfo, onInputNumberChange } = displayContext;

  const [rewardsAmount, setRewardsAmount] = useState("");
  const [inputDuration, setInputDuration] = useState("");

  async function addRewards() {
    if(parseFloat(rewardsAmount) > parseFloat(userInfo["rewardTokenBalance"])) {
      window.alert("Not enough balance");
      return;
    }

    let amount = web3.utils.toWei(rewardsAmount);
    let days = inputDuration;
    
    await dappTokenContract.methods
      .approve(tokenFarmContract.options.address, amount.toString())
      .send({ from: accounts[0] });

    await tokenFarmContract.methods
      .addRewards(amount.toString(), days)
      .send({ from: accounts[0] });

    await refreshUserInfo();
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
          Available {userInfo["rewSymbol"]} balance to transfer:{" "}
          {userInfo["rewardTokenBalance"]}
        </div>
        <div className="input-button-container">
          <Form.Control
            key="a1"
            placeholder="Amount"
            value={rewardsAmount}
            onChange={(e) => {
              onInputNumberChange(e, setRewardsAmount);
            }}
          />
        </div>
        <br /> <hr />
        <br />
        Duration (in days) <br />
        <div className="input-button-container">
          <Form.Control
            placeholder="Days"
            value={inputDuration}
            onChange={(e) => {
              onInputNumberChange(e, setInputDuration);
            }}
          />
        </div>
        <br />
        <hr />
        <div className="button-stretch">
          <br />
          <Button variant="success" onClick={addRewards}>
            ADD
          </Button>
          <br />
        </div>
        <br />
      </Container>
    </>
  );
}

export default AdminView;
