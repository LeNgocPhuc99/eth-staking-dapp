import Web3 from "web3";

async function getWeb3() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return web3;
    } catch (error) {
      throw error;
    }
  } else if (window.wbe3) {
    const web3 = window.web3;
    console.log("Injected web3 detected.");
    return web3;
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    const web3 = new Web3(provider);
    console.log("Using Local web3");
    return web3;
  }
}

export default getWeb3;
