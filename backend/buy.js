const Web3 = require("web3");


const DEFAULT_HTTP_PROVIDER = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(DEFAULT_HTTP_PROVIDER));
