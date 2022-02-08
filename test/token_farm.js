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

  function assertEqualWithMargin(_num1, _num2, _margin, _message) {
    if (
      BN.max(_num1, _num2)
        .sub(BN.min(_num1, _num2))
        .lte(_margin.mul(new BN(3)))
    )
      return;

    assert.equal(_num1.toString(), _num2.toString(), _message);
  }

  it("should calculate the parameters correctly", async () => {
    const daiToken = await DaiToken.new();
    const dappToken = await DappToken.new();
    const tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
    await dappToken.transfer(accounts[0], tokens("1000000"));
    await daiToken.transfer(accounts[1], tokens("100"), defaultOptions);

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

  it("should calculate and distribute rewards", async () => {
    const daiToken = await DaiToken.new();
    const dappToken = await DappToken.new();
    const tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
    await dappToken.transfer(accounts[0], tokens("1000000"));
    await daiToken.transfer(accounts[1], tokens("100"), defaultOptions);

    let prevUserBalance = await dappToken.balanceOf(accounts[1], {
      from: accounts[1],
    });

    // add rewards
    let rewardAmount = tokens("300");
    let days = 30;
    await dappToken.approve(tokenFarm.address, rewardAmount, defaultOptions);
    await tokenFarm.addRewards(rewardAmount, days, defaultOptions);
    let preContractRewardBalance = await dappToken.balanceOf(
      tokenFarm.address,
      { from: accounts[1] }
    );

    let contractRps = await tokenFarm.rewardPerSecond.call(defaultOptions);

    // user stakes funds
    let depositAmount = tokens("10");
    await daiToken.approve(tokenFarm.address, depositAmount, {
      from: accounts[1],
    });
    await tokenFarm.deposit(depositAmount, { from: accounts[1] });
    let initialReward = await tokenFarm.pendingRewards(accounts[1], {
      from: accounts[1],
    });
    assert.equal(
      initialReward.toString(),
      0,
      "User has rewards pending straight after staking"
    );

    // after 10 days
    let secs = 60 * 60 * 24 * 10;
    await timeMachine.advanceTimeAndBlock(secs);
    let pendingReward = await tokenFarm.pendingRewards(accounts[1], {
      from: accounts[1],
    });
    let expectedPendingReward = contractRps
      .mul(new BN(secs))
      .div(rpsMultiplierBN);
    assertEqualWithMargin(
      pendingReward,
      expectedPendingReward,
      contractRps.div(rpsMultiplierBN),
      "Wrong pending reward"
    );

    // claim reward
    await tokenFarm.claim({ from: accounts[1] });

    // check user rewards balance
    let userBalance = await dappToken.balanceOf(accounts[1], {
      from: accounts[1],
    });
    let delta = userBalance.sub(prevUserBalance);
    assertEqualWithMargin(
      delta,
      expectedPendingReward,
      contractRps.div(rpsMultiplierBN),
      "Wrong amount of reward"
    );
    prevUserBalance = userBalance;

    // check TokenFarm rewards balance
    let contractBalance = await dappToken.balanceOf(tokenFarm.address, {
      from: accounts[1],
    });
    let contractDelta = preContractRewardBalance.sub(contractBalance);
    assertEqualWithMargin(
      contractDelta,
      expectedPendingReward,
      contractRps.div(rpsMultiplierBN),
      "contract lost different amount of reward"
    );
    preContractRewardBalance = contractBalance;
  });
});
