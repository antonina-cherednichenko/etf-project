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
       return "Security basket for S&P 500: 1) SPDR S&P 500 ETF (SPY), 2) iShares Core S&P 500 ETF (IVV) 3) Vanguard S&P 500 ETF (VOO)";
  }

  function buyETFCoins(uint256 tokenAmount, uint256 price)
    public
    payable
    returns (bool success)
  {
     require(msg.value >= tokenAmount * price);
     //Buy selected basket of securities, if not succesful refund money
     //if successfule send tokens to the beneficiary
     crowdsale.buyTokens.value(msg.value)(msg.sender, price);
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
