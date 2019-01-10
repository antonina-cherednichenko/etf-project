const Web3 = require("web3");

const DEFAULT_HTTP_PROVIDER = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(DEFAULT_HTTP_PROVIDER));
let config = {}

config.web3 = web3;

config.coin = {
  "name": "ETFCoin",
  "symbol": "ETF",
  "decimals": 18
}

config.etf = {
  //"description": web3.utils.fromAscii('Security basket for S&P 500: SPY, IVV, VOO'),
  "description": web3.utils.fromAscii('Security basket for S&P 500'),
  "basket":[
    web3.utils.fromAscii("SPY"),
    web3.utils.fromAscii("IVV"),
    web3.utils.fromAscii("VOO")
  ]
}

config.tokens = {
  "initialSupply": 1000000,
  //TODO change that with proper address
  "fundWallet": '0x000000000000000000000000000000000000dead'
}

module.exports = config;
