import React, { useContext, useState } from "react";
import { Button, Container, Form, OverlayTrigger } from "react-bootstrap";

import TimeLeft from "./TimeLeft";

import DisplayContext from "../../context/DisplayContext";
import BlockchainContext from "../../context/BlockchainContext";

function UserView() {
  const displayContext = useContext(DisplayContext);
  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts, tokenFarmContract, daiTokenContract } =
    blockchainContext;
  const { userInfo, refreshUserInfo, onInputNumberChange, isNonZeroNumber } =
    displayContext;

  const [stakeAmount, setStakeAmount] = useState("");
  const [unStakeAmount, setUnStakeAmount] = useState("");

  function numberToFixed(n) {
    if (n === undefined) return n;
    return parseFloat(n).toFixed(6);
  }

  async function deposit() {
    if (!isNonZeroNumber(stakeAmount)) {
      window.alert("Not amount enter");
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(userInfo["depositTokenBalance"])) {
      window.alert("Not enough balance");
      return;
    }
    let amount = web3.utils.toWei(stakeAmount.toString());

    await daiTokenContract.methods
      .approve(tokenFarmContract.options.address, amount.toString())
      .send({ from: accounts[0] });

    await tokenFarmContract.methods.deposit(amount).send({ from: accounts[0] });
    setStakeAmount("");
    await refreshUserInfo();
  }

  async function withdraw() {
    if (!isNonZeroNumber(unStakeAmount)) {
      window.alert("Not amount entered");
      return;
    }

    if (parseFloat(unStakeAmount) > parseFloat(userInfo["deposited"])) {
      window.alert("Can't unstake more than stake");
      return;
    }

    let amount = web3.utils.toWei(unStakeAmount.toString());
    await tokenFarmContract.methods
      .withdraw(amount)
      .send({ from: accounts[0] });

    setUnStakeAmount("");
    await refreshUserInfo();
  }

  async function claim() {
    await tokenFarmContract.methods.claim().send({ from: accounts[0] });
    await refreshUserInfo();
  }

  const CardKeyValue = (props) => (
    <>
      <div className="card-key-value">
        <div>{props.label}</div>
        <div>{props.value}</div>
      </div>
      <hr />
    </>
  );

  const RewardsFinished = (props) => (
    <>
      <div className="line-label">
        <div>Staking reward period finished</div>
      </div>
    </>
  );

  const RewardsActive = (props) => (
    <>
      <TimeLeft />
      <CardKeyValue
        label="Rewards per day"
        value={numberToFixed(userInfo["rewardPerDay"])}
      />
    </>
  );

  return (
    <>
      <Container className="square inner-container">
        <br />
        {isNonZeroNumber(userInfo["rewardPerDay"]) ? (
          <RewardsActive />
        ) : (
          <RewardsFinished />
        )}
        <CardKeyValue
          label={"Your reward balance: "}
          value={
            numberToFixed(userInfo["rewardTokenBalance"]) +
            " " +
            userInfo["rewSymbol"]
          }
        />
        <CardKeyValue
          label={"Your staked:"}
          value={
            numberToFixed(userInfo["deposited"]) + " " + userInfo["depSymbol"]
          }
        />
        <CardKeyValue
          label="Your pending reward: "
          value={
            numberToFixed(userInfo["pendingRewards"]) +
            " " +
            userInfo["rewSymbol"]
          }
        />
        <br />
        <br />
        <div className="label-above-button">
          Available {userInfo["depSymbol"]} token balance to stake:{" "}
          {userInfo["depositTokenBalance"]} {userInfo["depSymbol"]}
        </div>
        <div className="input-button-container">
          <div>
            <Form.Control
              value={stakeAmount}
              onChange={(e) => {
                onInputNumberChange(e, setStakeAmount);
              }}
              placeholder="Amount tokens"
            />
          </div>
          <div>
            <OverlayTrigger placement="right" overlay={<></>}>
              <Button onClick={deposit} variant="success">
                STAKE
              </Button>
            </OverlayTrigger>
          </div>
        </div>
        <br />

        <div className="label-above-button">
          You staked: {userInfo["deposited"]} {userInfo["depSymbol"]}
        </div>
        <div className="input-button-container">
          <div>
            <Form.Control
              value={unStakeAmount}
              onChange={(e) => {
                onInputNumberChange(e, setUnStakeAmount);
              }}
              placeholder="Amount tokens"
            />
          </div>
          <div>
            <OverlayTrigger placement="right" overlay={<></>}>
              <Button onClick={withdraw} variant="success">
                UNSTAKE
              </Button>
            </OverlayTrigger>
          </div>
        </div>

        <br />
        <div className="button-stretch">
          <Button onClick={claim} variant="success">
            CLAIM REWARD
          </Button>
        </div>
      </Container>
    </>
  );
}

export default UserView;
