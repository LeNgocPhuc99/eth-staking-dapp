import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";

import getWeb3 from "./utils/getWeb3";

import BlockchainContext from "../context/BlockchainContext";
import DisplayContext from "../context/DisplayContext";

import UserView from "./components/UserView";
import AdminView from "./components/AdminView";
import DappNavar from "./components/DappNavbar";

import { Button } from "react-bootstrap";
import "../css/App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();

  const [userInfo, setUserInfo] = useState({});
  const [owner, setOwner] = useState();

  const [daiTokenContract, setDaiTokenContract] = useState();
  const [dappTokenContract, setDappTokenContract] = useState();
  const [tokenFarmContract, setTokenFarmContract] = useState();

  useEffect(() => {
    (async () => {
      setLoading(false);
    })();
  }, []);

  async function connectToBlockchain() {
    try {
      setLoading(true);
      // load web3
      const web3 = await getWeb3();
      setWeb3(web3);

      // get user's accounts
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      const networkId = await web3.eth.net.getId();

      // load DaiToken contract
      const daiTokenData = DaiToken.networks[networkId];
      if (daiTokenData) {
        const daiTokenContract = new web3.eth.Contract(
          DaiToken.abi,
          daiTokenData.address
        );

        setDaiTokenContract(daiTokenContract);
      } else {
        window.alert("DaiContract contract not deployed to detected network");
      }
      // load DappToken contract
      const dappTokenData = DappToken.networks[networkId];
      if (dappTokenData) {
        const dappTokenContract = new web3.eth.Contract(
          DappToken.abi,
          dappTokenData.address
        );
        setDappTokenContract(dappTokenContract);
      } else {
        window.alert("DappContract contract not deployed to detected network");
      }
      // load TokenFarm
      const tokenFarmData = TokenFarm.networks[networkId];
      if (tokenFarmData) {
        const tokenFarmContract = new web3.eth.Contract(
          TokenFarm.abi,
          tokenFarmData.address
        );
        setTokenFarmContract(tokenFarmContract);
        const owner = await tokenFarmContract.methods.owner().call();
        setOwner(owner);
      } else {
        window.alert("TokenFarm contract not deployed to detected network");
      }

      window.ethereum.on("accountsChanged", function (_accounts) {
        if (_accounts.length === 0) {
          setAccounts(undefined);
          setWeb3(undefined);
        } else {
          setAccounts(_accounts);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    const loadData = async () => {
      await refreshUserInfo();
    };

    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof tokenFarmContract !== "undefined" &&
      typeof daiTokenContract !== "undefined" &&
      typeof dappTokenContract !== "undefined"
    ) {
      loadData();
    }
  }, [web3, accounts, tokenFarmContract, daiTokenContract, dappTokenContract]);

  async function refreshUserInfo() {
    setLoading(true);
    let res = await tokenFarmContract.methods
      .getUserInfo()
      .call({ from: accounts[0] });
    let depBalance = await daiTokenContract.methods
      .balanceOf(accounts[0])
      .call({ from: accounts[0] });
    let rewardBalance = await dappTokenContract.methods
      .balanceOf(accounts[0])
      .call({ from: accounts[0] });
    let depSymbol = await daiTokenContract.methods
      .symbol()
      .call({ from: accounts[0] });
    let rewSymbol = await dappTokenContract.methods
      .symbol()
      .call({ from: accounts[0] });

    let userInfo = {
      deposited: web3.utils.fromWei(res["_deposited"]),
      rewardPerDay: (res["_rewardPerSecond"] * 24 * 60 * 60) / 10 ** 18,
      daysLeft: res["_secondsLeft"] / 60 / 60 / 24,
      depositTokenBalance: web3.utils.fromWei(depBalance),
      rewardTokenBalance: web3.utils.fromWei(rewardBalance),
      depSymbol: depSymbol,
      rewSymbol: rewSymbol,
    };

    console.log(userInfo);

    setUserInfo(userInfo);
    setLoading(false);
  }

  function onInputNumberChange(e, f) {
    const re = new RegExp("^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");
    if (e.target.value === "" || re.test(e.target.value)) {
      f(e.target.value);
    }
  }

  function isNonZeroNumber(_input) {
    return _input !== undefined && _input !== "" && parseFloat(_input) !== 0.0;
  }

  const MainView = () => (
    <>
      <br />
      <div style={{ display: "flex" }}>
        <UserView />
        {accounts[0].toLowerCase() === owner.toLowerCase() ? (
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
          value={{
            web3,
            accounts,
            tokenFarmContract,
            dappTokenContract,
            daiTokenContract,
          }}
        >
          <DisplayContext.Provider
            value={{
              userInfo,
              refreshUserInfo,
              onInputNumberChange,
              isNonZeroNumber,
            }}
          >
            <DappNavar />
            <br />
            <div className="App">
              {web3 ? (
                <MainView />
              ) : (
                <>
                  <br />
                  <div className="button-stretch">
                    <Button variant="success" onClick={connectToBlockchain}>
                      Connect
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DisplayContext.Provider>
        </BlockchainContext.Provider>
      </div>
    );
  }
}

export default App;
