pragma solidity >=0.4.21 <0.6.0;

import "./ETFCrowdsale.sol";

contract ETFManagement {

  address payable public crowdsale;
  //bytes32[] memory basket = ["SPY", "IVV", "VOO"];
  bytes32[] basket;
  bytes32 description;
  //bytes32 etfInfo = "Security basket for S&P 500: 1) SPDR S&P 500 ETF (SPY), 2) iShares Core S&P 500 ETF (IVV) 3) Vanguard S&P 500 ETF (VOO)";

  constructor(address payable _crowdsale, bytes32[] memory _basket, bytes32 _description) public {
    crowdsale = _crowdsale;
    basket = _basket;
    description = _description;
  }

  function getDescription()
    public
    view
    returns (bytes32)
  {
       return description;
  }

  function buyETFCoins(uint256 tokenAmount, uint256 price)
    public
    payable
    returns (bool success)
  {
     ETFCrowdsale etfCrowdsale = ETFCrowdsale(crowdsale);
     etfCrowdsale.updateBasketPrice(price);
     etfCrowdsale.buyTokens(msg.sender);
     return true;
  }

  /* function sellETFCoins(uint256 tokenAmount)
    public
    returns (bool success)
  {
     //check that we have right to transfer tokens
     token.transferFrom(msg.sender, this, tokenAmount);

  } */

}
