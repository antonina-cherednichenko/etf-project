const ETFCoin = artifacts.require('./ETFCoin.sol');
const ETFCrowdsale = artifacts.require('./ETFCrowdsale.sol');
const ETFManagement = artifacts.require('./ETFManagement.sol');
const config = require("../config");

module.exports = function(deployer) {
  deployer.deploy(ETFCoin, 10000)
   .then(instance => deployer.deploy(ETFCrowdsale, 1, '0x0', instance.address))
   .then(instance => deployer.deploy(ETFManagement, instance.address))
}
