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
          label={"Staking Balance (mDAI)"}
          value={numberToFixed(userInfo["deposited"])}
        />
        <CardKeyValue
          label="Reward Balance (DAPP)"
          value={numberToFixed(userInfo["rewardTokenBalance"])}
        />
        <br />
        <br />
        <div className="label-above-button">
          Available {userInfo["depSymbol"]} token balance to stake:{" "}
          {userInfo["depositTokenBalance"]}
          {userInfo["depSymbol"]}
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
              <Button variant="success">STAKE</Button>
            </OverlayTrigger>
          </div>
        </div>
        <br />

        <div className="label-above-button">
          You staked:
          {userInfo["deposited"]}
          {userInfo["depSymbol"]}
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
              <Button variant="success">UNSTAKE</Button>
            </OverlayTrigger>
          </div>
        </div>

        <br />
        <div className="button-stretch">
          <Button variant="success">CLAIM REWARD</Button>
        </div>
      </Container>
    </>
  );
}

export default UserView;
