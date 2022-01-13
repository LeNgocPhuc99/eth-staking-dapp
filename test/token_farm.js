const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    // Load Contract
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all DAPP tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));
    // Send tokens to investor
    await daiToken.transfer(investor, "100", { from: owner });
  });

  describe("Mock DAI deployment", async () => {
    it("has name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("DAPP deployment", async () => {
    it("has name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "Dapp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });

    it("contract has tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });
});
