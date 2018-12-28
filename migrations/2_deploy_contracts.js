const ETFCoin = artifacts.require('./ETFCoin.sol');
const ETFCrowdsale = artifacts.require('./ETFCrowdsale.sol');
const ETFManagement = artifacts.require('./ETFManagement.sol');

const config = require("../config");

module.exports = function(deployer) {
  deployer.deploy(ETFCoin, config.coin.name, config.coin.symbol, config.coin.decimals)
   .then(instance => deployer.deploy(ETFCrowdsale, 1, config.tokens.fundWallet, instance.address))
   .then(instance => deployer.deploy(ETFManagement, instance.address))
}
