pragma solidity >=0.4.21 <0.6.0;

contract ETFManagement {

  address public crowdsale;


  constructor(address _crowdsale) public {
    crowdsale = _crowdsale;
  }

  function getInfo()
    public
    constant
    returns (bytes info)
    {
       return "Security basket for S&P 500: 1) SPDR S&P 500 ETF (SPY), 2) iShares Core S&P 500 ETF (IVV) 3) Vanguard S&P 500 ETF (VOO)"
    }

  function buyETFCoin(address beneficiary, uint256 tokenAmount)
    public
    payable
  {
     require(msg.value >= tokenAmount * getBasketPrice());

  }

}
