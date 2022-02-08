const { assert } = require("chai");
const timeMachine = require("ganache-time-traveler");

const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", async (accounts) => {
  let daiToken, dappToken, tokenFarm;
  const defaultOptions = { from: accounts[0] };
  const BN = web3.utils.BN;
  const secondsInDayBN = new BN(24).mul(new BN(60)).mul(new BN(60));
  const rpsMultiplierBN = new BN(10 ** 7);

  beforeEach(async () => {
    let snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot["result"];
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  async function getTime() {
    return (await web3.eth.getBlock(await web3.eth.getBlockNumber()))[
      "timestamp"
    ];
  }

  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    await dappToken.transfer(accounts[0], tokens("1000000"));
    await daiToken.transfer(accounts[1], tokens("100"), defaultOptions);
  });

  it("should calculate the parameters correctly", async () => {
    let rewardAmount = tokens("300");
    let days = 30;
    await dappToken.approve(tokenFarm.address, rewardAmount, defaultOptions);
    await tokenFarm.addRewards(rewardAmount, days, defaultOptions);

    let startingTime = await getTime();

    let contractRps = await tokenFarm.rewardPerSecond.call(defaultOptions);
    let expectedRps = await new BN(rewardAmount)
      .mul(rpsMultiplierBN)
      .div(new BN(days))
      .div(secondsInDayBN);
    assert.equal(
      contractRps.toString(),
      expectedRps.toString(),
      "Wrong contract end time"
    );

    let contractEndTime = await tokenFarm.rewardPeriodEndTimestamp.call(
      defaultOptions
    );
    let expectedEndTime = await new BN(startingTime).add(
      new BN(days).mul(secondsInDayBN)
    );
    assert.equal(
      contractEndTime.toString(),
      expectedEndTime.toString(),
      "Wrong contract end time"
    );
  });
});
