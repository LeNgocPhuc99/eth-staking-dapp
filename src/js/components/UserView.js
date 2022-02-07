import React, { useContext, useState } from "react";
import {
  Button,
  Container,
  Form,
  OverlayTrigger,
} from "react-bootstrap";

import DisplayContext from "../../context/DisplayContext";
import BlockchainContext from "../../context/BlockchainContext";

function UserView() {
  const displayContext = useContext(DisplayContext);
  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts, tokenFarmContract, daiTokenContract } =
    blockchainContext;
  const { userInfo, refreshUserInfo, onInputNumberChange } = displayContext;

  const [stakeAmount, setStakeAmount] = useState("");
  const [unStakeAmount, setUnStakeAmount] = useState("");

  const handleFormChange = (e) => {
    setAmount(e.target.value);
  };

  function numberToFixed(n) {
    if (n === "undefined") {
      return n;
    }
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

  return (
    <>
      <Container className="square inner-container">
        <br />
        <CardKeyValue
          label={"Staking Balance (mDAI)"}
          value={userInfo["deposited"]}
        />
        <CardKeyValue
          label="Reward Balance (DAPP)"
          value={userInfo["rewardTokenBalance"]}
        />
        <br />
        <br />
        <div className="label-above-button">
          Available {userInfo["depSymbol"]} token balance to stake:{" "}
          {userInfo["depositTokenBalance"]}{userInfo["depSymbol"]}
        </div>
        <div className="input-button-container">
          <div>
            <Form.Control
              value={stakeAmount}
              onChange={(e) => {onInputNumberChange(e, setStakeAmount)}}
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
          {userInfo["deposited"]}{userInfo["depSymbol"]}
        </div>
        <div className="input-button-container">
          <div>
            <Form.Control
              value={unStakeAmount}
              onChange={(e) => {onInputNumberChange(e, setUnStakeAmount)}}
              placeholder="Amount tokens"
            />
          </div>
          <div>
            <OverlayTrigger placement="right" overlay={<></>}>
              <Button variant="success">UNSTAKE</Button>
            </OverlayTrigger>
          </div>
        </div>

        <div className="button-stretch">
          <Button variant="success">CLAIM REWARD</Button>
        </div>
      </Container>
    </>
  );
}

export default UserView;
