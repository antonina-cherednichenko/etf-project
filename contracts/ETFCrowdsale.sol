pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract ETFCrowdsale is MintedCrowdsale {

  uint internal price = 0;

  // Return price in wei for a security basket
  /* function getBasketPrice()
    public view returns (uint price)
  {
    if (price == 0) {
      updateBasketPrice();
    }
    return price;
  } */

  /** TODO use oracles to get price for selected securities in the basket
      Function is periodically called to update price of underlying securities in the basket
  */
  /* function updateBasketPrice()
    public returns (bool success)
  {
    price = 1 ether;
    //TODO emit event here
    return true;
  } */

  constructor (
        uint256 rate,
        address payable wallet,
        ERC20Mintable token
    )
        public
        Crowdsale(rate, wallet, token)
    {
        //As goal needs to be met for a successful crowdsale
        //the value needs to less or equal than a cap which is limit for accepted funds
        //require(goal <= cap);
    }

  function updateBasketPrice(uint256 _price)
    public returns (bool)
  {
    price = _price;
    return true;
  }

  /**
   * @dev Overrides parent method taking into account variable rate.
   * @param weiAmount The value in wei to be converted into tokens
   * @return The number of tokens _weiAmount wei will buy at present time
   */
  function _getTokenAmount(uint256 weiAmount)
    internal view returns (uint256)
  {
    /* return weiAmount.div(getBasketPrice()); */
    return weiAmount.div(price);
  }

}
