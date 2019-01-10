
let config = {}

config.coin = {
  "name": "ETFCoin",
  "symbol": "ETF",
  "decimals": 18
}

config.etf = {
  "description": "Security basket for S&P 500: 1) SPDR S&P 500 ETF (SPY), 2) iShares Core S&P 500 ETF (IVV) 3) Vanguard S&P 500 ETF (VOO)",
  "basket":["SPY", "IVV", "VOO"]
}

config.tokens = {
  "initialSupply": 1000000,
  //TODO change that with proper address
  "fundWallet": '0x000000000000000000000000000000000000dead'
}
