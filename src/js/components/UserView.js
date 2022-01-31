import Web3 from "web3";
import React, { useContext, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  OverlayTrigger,
} from "react-bootstrap";

import DisplayContext from "../../context/DisplayContext";
import BlockchainContext from "../../context/BlockchainContext";

function UserView() {
  const [amount, setAmount] = useState();
  const displayContext = useContext(DisplayContext);
  const blockchainContent = useContext(BlockchainContext);
  const { stakeTokens, unstakeTokens } = blockchainContent;
  const { stakingBalance, dappTokenBalance, daiTokenBalance } = displayContext;

  const stakeHandler = (event) => {
    event.preventDefault();
    let _amount;
    _amount = Web3.utils.toWei(amount.toString(), "ether");
    stakeTokens(_amount);
  };

  const unstakeHandler = (event) => {
    event.preventDefault();
    unstakeTokens();
  };

  const handleFormChange = (e) => {
    setAmount(e.target.value);
  };

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
        <CardKeyValue label="Staking Balance (mDAI)" value={stakingBalance} />
        <CardKeyValue label="Reward Balance (DAPP)" value={dappTokenBalance} />
        <br />
        <br />
        <div className="label-above-button">
          Available mDAI token balance to stake: {daiTokenBalance} mDAI
        </div>
        <div className="input-button-container">
          <div>
            <FormControl
              onChange={handleFormChange}
              placeholder="Amount mDAI tokens"
            />
          </div>
          <div>
            <OverlayTrigger placement="right" overlay={<></>}>
              <Button variant="success" onClick={stakeHandler}>
                STAKE
              </Button>
            </OverlayTrigger>
          </div>
        </div>
        <br />
        <div className="button-stretch">
          <Button onClick={unstakeHandler} variant="success">
            UNSTAKE
          </Button>
        </div>
      </Container>
    </>
  );
}

export default UserView;
