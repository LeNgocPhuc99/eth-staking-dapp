import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Web3 from "web3";

import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";

import BlockchainContext from "../context/BlockchainContext";
import DisplayContext from "../context/DisplayContext";

import UserView from "./components/UserView";
import AdminView from "./components/AdminView";
import DappNavar from "./components/DappNavbar";

import "../css/App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();
  const [owner, setOwner] = useState();
  const [daiToken, setDaiToken] = useState();
  const [dappToken, setDappToken] = useState();
  const [tokenFarm, setTokenFarm] = useState();
  const [daiTokenBalance, setDaiTokenBalance] = useState();
  const [dappTokenBalance, setDappTokenBalance] = useState();
  const [stakingBalance, setStakingBalance] = useState();

  useEffect(() => {
    const ethEnable = async () => {
      await loadBlockchainData();
    };

    ethEnable();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);

      let web3 = window.web3;

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
        setDaiTokenBalance(Web3.utils.fromWei(daiTokenBalance.toString()));
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
        setDappTokenBalance(Web3.utils.fromWei(dappTokenBalance.toString()));
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
        let owner = await tokenFarm.methods.owner().call();
        setOwner(owner);
        let stakingBalance = await tokenFarm.methods
          .stakingBalance(accounts[0])
          .call();
        setStakingBalance(Web3.utils.fromWei(stakingBalance.toString()));
      } else {
        window.alert("TokenFarm contract not deployed to detected network");
      }
    } else if (!window.web3) {
      window.alert("Non-Ethereum browser detected.");
    }
    setLoading(false);
  };

  const reloadData = async () => {
    setLoading(true);
    let _daiBalance = await daiToken.methods.balanceOf(account).call();
    setDaiTokenBalance(Web3.utils.fromWei(_daiBalance.toString()));
    let _stakingBalance = await tokenFarm.methods
      .stakingBalance(account)
      .call();
    setStakingBalance(Web3.utils.fromWei(_stakingBalance.toString()));
    setLoading(false);
  };

  const stakeTokens = (_amount) => {
    setLoading(true);
    daiToken.methods
      .approve(tokenFarm._address, _amount)
      .send({ from: account })
      .on("receipt", () => {
        tokenFarm.methods
          .stakeTokens(_amount)
          .send({ from: account })
          .on("receipt", () => {
            reloadData();
            setLoading(false);
          });
      });
  };

  const unstakeTokens = () => {
    setLoading(true);
    tokenFarm.methods
      .unstakeTokens()
      .send({ from: account })
      .on("receipt", () => {
        reloadData();
        setLoading(false);
      });
  };

  const updateRewards = () => {
    setLoading(true);
    tokenFarm.methods
      .updateRewards()
      .send({ from: account })
      .on("receipt", () => {
        reloadData();
        setLoading(false);
      });
  };

  const MainView = () => (
    <>
      <br />
      <div style={{ display: "flex" }}>
        <UserView />
        {account.toLowerCase() === owner.toLowerCase() ? (
          <AdminView />
        ) : undefined}
      </div>
    </>
  );

  if (loading) {
    return (
      <center>
        <br />
        <Spinner animation="border" variant="success" />
      </center>
    );
  } else {
    return (
      <div className="outerApp">
        <BlockchainContext.Provider
          value={{ account, stakeTokens, unstakeTokens, updateRewards }}
        >
          <DisplayContext.Provider
            value={{ stakingBalance, dappTokenBalance, daiTokenBalance }}
          >
            <DappNavar />
            <br />
            <div className="App">
              <MainView />
            </div>
          </DisplayContext.Provider>
        </BlockchainContext.Provider>
      </div>
    );
  }
}

export default App;
