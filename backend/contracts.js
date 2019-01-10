const _ = require('lodash')
const contract = require('truffle-contract')
const config = require("../config");


let contractsData = {};

async function getData() {
  return new Promise((resolve, reject) => {

    if (!_.isEmpty(contractsData)) {
      return resolve(contractsData);
    }

    let ETFManagement = contract(require('../build/contracts/ETFManagement.json'));
    ETFManagement.setProvider(config.web3.currentProvider);

    let ETFCoin = contract(require('../build/contracts/ETFCoin.json'));
    ETFCoin.setProvider(config.web3.currentProvider);

    let ETFCrowdsale = contract(require('../build/contracts/ETFCrowdsale.json'));
    ETFCrowdsale.setProvider(config.web3.currentProvider);

    web3.eth.getAccounts(function(err, accounts) {
      if (err != null) {
        return reject(err);
      }

      if (!accounts || accounts.length == 0) {
        return reject({error: "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."});
      }

      contractsData.accounts = accounts;

      ETFCoin.deployed()
        .then(instance => contractsData.etfCoin = instance;)
        .then(() => ETFCrowdsale.deployed())
        .then(instance => contractsData.etfCrowdsale = instance;)
        .then(() => ETFManagement.deployed())
        .then(instance => contractsData.etfManagement = instance;)
        .catch(err => reject({error: "Deploying of contracts failed with an error" + err}))
    });
  })
}

module.exports = {getData}
