const DaiToken = artifacts.require("DaiToken");
const AsuraToken = artifacts.require("AsuraToken");

module.exports = function (deployer) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(AsuraToken);
  const asuraToken = await AsuraToken.deployed();
};
