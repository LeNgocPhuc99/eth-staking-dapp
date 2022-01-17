import React, { useState, useEffect } from "react";
import Web3 from "web3";

import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";

function App() {
  const [account, setAccount] = useState();
  const [daiToken, setDaiToken] = useState();
  const [dappToken, setDappToken] = useState();
  const [tokenFarm, setTokenFarm] = useState();
  const [daiTokenBalance, setDaiTokenBalance] = useState();
  const [dappTokenBalance, setDappTokenBalance] = useState();
  const [stakingBalance, setStakingBalance] = useState();

  useEffect(() => {
    const ethEnable = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };

    ethEnable();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected.");
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();

    // load DaiToken contract
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      setDaiToken(daiToken);
      let daiTokenBalance = await daiToken.methods
        .balanceOf(accounts[0])
        .call();
      setDaiTokenBalance(daiTokenBalance.toString());
    } else {
      window.alert("DaiContract contract not deployed to detected network");
    }

    // load DappToken contract
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      );
      setDappToken(dappToken);
      let dappTokenBalance = await dappToken.methods
        .balanceOf(accounts[0])
        .call();
      setDappTokenBalance(dappTokenBalance.toString());
    } else {
      window.alert("DappContract contract not deployed to detected network");
    }

    // load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      setTokenFarm(tokenFarm);
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(accounts[0])
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert("TokenFarm contract not deployed to detected network");
    }
  };

  return (
    <div>
      <h1>Hello World!!!</h1>
    </div>
  );
}

export default App;
