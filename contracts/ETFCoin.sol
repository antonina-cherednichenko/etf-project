pragma solidity >=0.4.21 <0.6.0;

import "zeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";


/**
 * A basic token for selected investment strategy
 */
contract ETFCoin is ERC20Mintable {
    string public constant name = "ETF Coin";
    string public constant symbol = "ETF";
    uint8  public constant decimals = 18;

    constructor(uint initialBalance) public {
        balances[msg.sender] = initialBalance;
        totalSupply_ = initialBalance;
    }
}
