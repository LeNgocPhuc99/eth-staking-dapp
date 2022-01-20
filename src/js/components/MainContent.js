import Web3 from "web3";
import React, { useState } from "react";
import { Table, InputGroup, Form, FormControl, Button } from "react-bootstrap";

function MainContent(props) {
  const [amount, setAmount] = useState();

  const stakeHandler = (event) => {
    event.preventDefault();
    let _amount;
    _amount = Web3.utils.toWei(amount.toString(), "ether");
    props.stakeTokens(_amount);
  };

  const unstakeHandler = (event) => {
    event.preventDefault();
    props.unstakeTokens();
  };

  const handleFormChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div id="content" className="mt-3">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Staking Balance</th>
            <th>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.stakingBalance} mDAI</td>
            <td>{props.dappTokenBalance} DAPP</td>
          </tr>
        </tbody>
      </Table>
      <br />
      <Form.Label>
        Balance: <span>{props.daiTokenBalance}</span>
      </Form.Label>
      <br />
      <InputGroup>
        <FormControl
          onChange={handleFormChange}
          placeholder="0"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Text id="basic-addon2">mDAI</InputGroup.Text>
      </InputGroup>
      <br />
      <Button onClick={stakeHandler} variant="primary">
        STAKE
      </Button>
      <Button onClick={unstakeHandler} variant="primary">
        UNSTAKE
      </Button>
    </div>
  );
}

export default MainContent;
