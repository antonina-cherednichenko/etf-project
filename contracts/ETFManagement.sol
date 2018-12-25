pragma solidity >=0.4.21 <0.6.0;

contract ETFManagement {

  address public crowdsale;

  constructor(address _crowdsale) public {
    crowdsale = _crowdsale;
  }

  function getInfo()
    public
    view
    returns (bytes info)
    {
       return "Security basket for S&P 500: 1) SPDR S&P 500 ETF (SPY), 2) iShares Core S&P 500 ETF (IVV) 3) Vanguard S&P 500 ETF (VOO)"
    }

  function buyETFCoins(uint256 tokenAmount)
    public
    payable
    returns (bool success)
  {
     require(msg.value >= tokenAmount * getBasketPrice());
     //Buy selected basket of securities, if not succesful refund money
     //if successfule send tokens to the beneficiary
     crowdsale.buyTokens.value(msg.value)(msg.sender);
     return true;
  }

}
